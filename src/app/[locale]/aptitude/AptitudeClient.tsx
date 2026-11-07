
'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import AptitudeResultDashboard from '@/components/aptitude/AptitudeResultDashboard';

type AptitudeQuestion = {
  question_order: number;
  question: {
    id: string;
    question_text: string;
    section: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
  };
};

type StartResponse = {
  success: boolean;
  alreadyAttempted?: boolean;
  attemptId?: string;
  status?: string;
  totalQuestions?: number;
  questions?: AptitudeQuestion[];
  message: string;
  savedAnswers?: Record<string, string>;
};

type AptitudeResult = {
  percentage: number;
  totalScore: number;
  totalQuestions: number;
  sectionScores: {
    numerical: number;
    logical: number;
    verbal: number;
    computer: number;
  };
};

type SubmitResponse = {
  success: boolean;
  message: string;
  result?: unknown;
};

type RegistrationResponse = {
  success: boolean;
  message: string;
  duplicate?: boolean;
};

type StatusResponse = {
  success: boolean;
  status?: 'not_started' | 'in_progress' | 'submitted' | 'expired';
  attemptId?: string;
  result?: AptitudeResult;
  message?: string;
};

type ReviewQuestion = {
  questionOrder: number;
  questionId: string;
  questionText: string;
  section: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  selectedOption: string | null;
  correctOption: string;
  isCorrect: boolean;
  explanation: string | null;
};

type ReviewResponse = {
  success: boolean;
  totalQuestions?: number;
  review?: ReviewQuestion[];
  message?: string;
};

function isAptitudeResult(result: unknown): result is AptitudeResult {
  if (typeof result !== 'object' || result === null) {
    return false;
  }

  const candidate = result as Record<string, unknown>;
  const sectionScores = candidate.sectionScores;

  if (
    typeof candidate.percentage !== 'number' ||
    !Number.isFinite(candidate.percentage) ||
    candidate.percentage < 0 ||
    candidate.percentage > 100 ||
    typeof candidate.totalScore !== 'number' ||
    !Number.isFinite(candidate.totalScore) ||
    typeof candidate.totalQuestions !== 'number' ||
    !Number.isFinite(candidate.totalQuestions) ||
    candidate.totalQuestions <= 0 ||
    candidate.totalScore < 0 ||
    candidate.totalScore > candidate.totalQuestions ||
    typeof sectionScores !== 'object' ||
    sectionScores === null
  ) {
    return false;
  }

  const maximumScore = candidate.totalQuestions;
  const scores = sectionScores as Record<string, unknown>;
  const categoryScores = ['numerical', 'logical', 'verbal', 'computer'].map(
    (category) => scores[category],
  );

  return (
    categoryScores.every(
      (score) =>
        typeof score === 'number' &&
        Number.isFinite(score) &&
        score >= 0 &&
        score <= maximumScore,
    ) &&
    categoryScores.reduce<number>(
      (total, score) => total + (typeof score === 'number' ? score : 0),
      0,
    ) === candidate.totalScore
  );
}

export default function AptitudePage() {
  const t = useTranslations('AptitudePage');
  const getApiError = useCallback((message: string | undefined, fallback: string) => {
    const messages: Record<string, string> = {
      'Please check your registration details.': t('registrationDetailsError'),
      'You have already registered for the aptitude test using this mobile number.':
        t('duplicateRegistrationError'),
      'Unable to complete registration. Please try again.': t('registrationError'),
      'Your session is invalid or expired.': t('sessionExpired'),
      'Your session is invalid or expired. Please register again.': t('sessionExpired'),
      'Your test attempt has expired. Retest is not allowed.': t('sessionExpired'),
      'Your test has already been submitted or expired.': t('alreadyAttempted'),
      'This test has already been submitted.': t('alreadyAttempted'),
      'This test has already been submitted or expired.': t('alreadyAttempted'),
      'The test could not load all 20 questions.': t('questionsIncomplete'),
      'Test questions are currently unavailable.': t('questionsUnavailable'),
      'The test questions could not be loaded.': t('questionsUnavailable'),
      'Unable to load test questions.': t('questionsUnavailable'),
      'Unable to load your answers. Please try again.': t('answersUnavailable'),
      'Unable to load answer review.': t('reviewUnavailable'),
      'Unable to save your answer.': t('saveAnswerError'),
      'Unable to save your answer. Please try again.': t('saveAnswerError'),
      'Unable to submit your test. Please try again.': t('submitError'),
      'Unable to submit the test. Please try again.': t('submitError'),
      'Unable to restore your test session.': t('restoreError'),
      'Unable to retrieve your test status.': t('restoreError'),
      'Unable to create or retrieve test attempt.': t('attemptUnavailable'),
      'Unable to start the aptitude test.': t('startError'),
      'Something went wrong. Please try again.': t('requestError'),
    };

    return message ? messages[message] ?? fallback : fallback;
  }, [t]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    mobile: '',
    highestQualification: '',
    stream: '',
    currentStatus: '',
    careerInterest: '',
    preferredBranch: '',
    consentGiven: false,
  });

  const [startingTest, setStartingTest] = useState(false);
  const [questions, setQuestions] = useState<AptitudeQuestion[]>([]);
  const [attemptId, setAttemptId] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<AptitudeResult | null>(null);

  const [restoring, setRestoring] = useState(true);
  const [attemptExpired, setAttemptExpired] = useState(false);

  // Answer review states
  const [reviewQuestions, setReviewQuestions] = useState<ReviewQuestion[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;

    setForm((previous) => ({
      ...previous,
      [target.name]:
        target.type === 'checkbox'
          ? (target as HTMLInputElement).checked
          : target.value,
    }));
  };

  // Registration
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');
    setSuccess(false);

    try {
      const response = await fetch('/api/aptitude/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data: RegistrationResponse = await response.json();

      if (!response.ok) {
        setMessage(getApiError(data.message, t('registrationError')));
        return;
      }

      setSuccess(true);
      setMessage(t('registrationSuccessMessage'));
    } catch {
      setMessage(t('connectionError'));
    } finally {
      setLoading(false);
    }
  };

  // Start or restore the same test attempt
  const handleStartTest = useCallback(async () => {
    setStartingTest(true);
    setTestMessage('');
    setTestSubmitted(false);
    setTestResult(null);

    try {
      const response = await fetch('/api/aptitude/start', {
        method: 'POST',
      });

      const data: StartResponse = await response.json();

      if (!response.ok) {
        setTestMessage(getApiError(data.message, t('startError')));
        return;
      }

      if (data.alreadyAttempted) {
        setTestMessage(t('alreadyAttempted'));
        return;
      }

      if (!data.questions || data.questions.length !== 20) {
        setTestMessage(t('questionsIncomplete'));
        return;
      }

      if (!data.attemptId) {
        setTestMessage(t('attemptUnavailable'));
        return;
      }

      setQuestions(data.questions);
      setAttemptId(data.attemptId);
      setAnswers(data.savedAnswers || {});
      setSuccess(true);
    } catch {
      setTestMessage(t('connectionError'));
    } finally {
      setStartingTest(false);
    }
  }, [getApiError, t]);

  // Load submitted answers and correct answers securely
  const loadReviewData = useCallback(async () => {
    setReviewLoading(true);

    try {
      const response = await fetch('/api/aptitude/review', {
        method: 'GET',
        cache: 'no-store',
      });

      const data: ReviewResponse = await response.json();

      if (!response.ok || !data.success || !data.review) {
        setTestMessage(getApiError(data.message, t('reviewUnavailable')));
        return false;
      }

      setReviewQuestions(data.review);
      return true;
    } catch (error) {
      console.error('Review error:', error);
      setTestMessage(t('answersUnavailable'));
      return false;
    } finally {
      setReviewLoading(false);
    }
  }, [getApiError, t]);

  // Open answer review
  const handleReviewAnswers = async () => {
    setTestMessage('');

    const loaded = await loadReviewData();

    if (loaded) {
      setShowReview(true);
    }
  };

  // Restore student session after refresh
  useEffect(() => {
    let cancelled = false;

    const restoreAptitudeSession = async () => {
      try {
        const response = await fetch('/api/aptitude/status', {
          method: 'GET',
          cache: 'no-store',
        });

        if (cancelled) return;

        if (response.status === 401) {
          return;
        }

        const data: StatusResponse = await response.json();

        if (cancelled) return;

        if (!response.ok || !data.success) {
          setMessage(getApiError(data.message, t('restoreError')));
          return;
        }

        if (data.status === 'not_started') {
          setSuccess(true);
          setMessage(t('registrationCompleteMessage'));
          return;
        }

        if (data.status === 'submitted' && data.result) {
          setSuccess(true);
          setTestSubmitted(true);
          setTestResult(data.result);

          // Load answer details so counts remain correct after refresh.
          await loadReviewData();
          return;
        }

        if (data.status === 'in_progress') {
          await handleStartTest();
          return;
        }

        if (data.status === 'expired') {
          setSuccess(true);
          setAttemptExpired(true);
          setTestMessage(
            getApiError(data.message, t('sessionExpired'))
          );
        }
      } catch (error) {
        console.error('Session restoration error:', error);

        if (!cancelled) {
          setMessage(
            t('restoreSessionError')
          );
        }
      } finally {
        if (!cancelled) {
          setRestoring(false);
        }
      }
    };

    restoreAptitudeSession();

    return () => {
      cancelled = true;
    };
  }, [getApiError, handleStartTest, loadReviewData, t]);

  // Save selected answer
  const handleAnswerChange = async (
    questionId: string,
    selectedOption: string
  ) => {
    if (!attemptId) return;

    setAnswers((previous) => ({
      ...previous,
      [questionId]: selectedOption,
    }));

    try {
      const response = await fetch('/api/aptitude/save-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attemptId,
          questionId,
          selectedOption,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setTestMessage(getApiError(data.message, t('saveAnswerError')));
        return;
      }

      setTestMessage('');
    } catch (error) {
      console.error('Save answer error:', error);
      setTestMessage(t('saveConnectionError'));
    }
  };

  // Submit test
  const handleSubmitTest = async () => {
    if (!attemptId) {
      setTestMessage(t('testSessionMissing'));
      return;
    }

    setSubmitting(true);
    setTestMessage('');

    try {
      const formattedAnswers = questions.map((item) => ({
        questionId: item.question.id,
        selectedOption: answers[item.question.id] || null,
      }));

      const response = await fetch('/api/aptitude/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attemptId,
          answers: formattedAnswers,
        }),
      });

      const data: SubmitResponse = await response.json();

      if (!response.ok || !data.success) {
        setTestMessage(getApiError(data.message, t('submitError')));
        return;
      }

      setTestSubmitted(true);

      if (isAptitudeResult(data.result)) {
        setTestResult(data.result);
        setTestMessage('');

        // Fetch saved answers for accurate result summary.
        await loadReviewData();
      } else {
        setTestMessage(
          t('resultUnavailable')
        );
      }
    } catch (error) {
      console.error('Submit test error:', error);
      setTestMessage(t('submitUnexpectedError'));
    } finally {
      setSubmitting(false);
    }
  };

  const answeredCount = reviewQuestions.length
    ? reviewQuestions.filter((item) => item.selectedOption !== null).length
    : Object.values(answers).filter(Boolean).length;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className={`mx-auto rounded-2xl bg-white p-5 shadow-sm sm:p-8 ${testResult ? 'max-w-7xl' : 'max-w-3xl sm:p-10'}`}>

        {!testResult && (
          <>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('title')}
            </h1>
            <p className="mt-2 text-gray-600">
              {t('introduction')}
            </p>
          </>
        )}

        {restoring ? (
          <div className="mt-10 rounded-xl border border-blue-100 bg-blue-50 p-6 text-center">
            <p className="font-semibold text-blue-900">
              {t('restoringTitle')}
            </p>
            <p className="mt-2 text-sm text-blue-700">
              {t('restoringDescription')}
            </p>
          </div>

        ) : testResult ? (

          <AptitudeResultDashboard
            result={testResult}
            review={reviewQuestions}
            reviewLoading={reviewLoading}
            showReview={showReview}
            onReview={handleReviewAnswers}
            onToggleReview={setShowReview}
          />

        ) : questions.length > 0 ? (

          /* TEST QUESTIONS */
          <div className="mt-8 space-y-6">

            <h2 className="text-2xl font-bold text-gray-900">
              {t('testHeading')}
            </h2>

            <p className="text-gray-600">
              {t('testInstructions')}
            </p>

            {testMessage && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {testMessage}
              </p>
            )}

            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
              {t('answeredCount', { answered: answeredCount })}
            </div>

            {questions.map((item, index) => {
              const q = item.question;

              const options = [
                { key: 'A', value: q.option_a },
                { key: 'B', value: q.option_b },
                { key: 'C', value: q.option_c },
                { key: 'D', value: q.option_d },
              ];

              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-gray-200 p-5"
                >
                  <p className="text-sm font-medium text-blue-700">
                    {t('questionNumber', { number: index + 1 })}
                  </p>

                  <h3 className="mt-2 font-semibold text-gray-900">
                    {q.question_text}
                  </h3>

                  <div className="mt-4 space-y-3">
                    {options.map((option) => (
                      <label
                        key={option.key}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-blue-50"
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={option.key}
                          aria-label={t('answerOption', {
                            number: index + 1,
                            option: option.key,
                            answer: option.value,
                          })}
                          checked={answers[q.id] === option.key}
                          onChange={() =>
                            handleAnswerChange(q.id, option.key)
                          }
                          className="h-4 w-4"
                        />

                        <span>
                          <strong>{option.key}.</strong> {option.value}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleSubmitTest}
                disabled={submitting || testSubmitted}
                className="rounded-lg bg-blue-700 px-8 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? t('submittingTest') : t('submitTest')}
              </button>
            </div>

          </div>

        ) : success ? (

          /* REGISTRATION SUCCESS / EXPIRED */
          <div className="mt-8 space-y-5">

            <div
              role="status"
              className={`rounded-lg border p-4 ${
                attemptExpired
                  ? 'border-amber-200 bg-amber-50 text-amber-800'
                  : 'border-green-200 bg-green-50 text-green-800'
              }`}
            >
              <p className="font-semibold">
                {attemptExpired
                  ? t('testAttemptExpired')
                  : t('registrationSuccessful')}
              </p>

              <p className="mt-1 text-sm">
                {testMessage || message}
              </p>
            </div>

            {!attemptExpired && (
              <>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t('testReady')}
                  </h2>

                  <p className="mt-2 text-gray-600">
                    {t('startInstructions')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleStartTest}
                  disabled={startingTest}
                  className="w-full rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {startingTest ? t('loadingTest') : t('startTest')}
                </button>
              </>
            )}

          </div>

        ) : (

          /* REGISTRATION FORM */
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            <div>
              <label htmlFor="aptitude-full-name" className="mb-2 block font-medium text-gray-700">
                {t('fullName')}
              </label>
              <input
                name="fullName"
                id="aptitude-full-name"
                value={form.fullName}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={100}
                placeholder={t('fullNamePlaceholder')}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label htmlFor="aptitude-mobile" className="mb-2 block font-medium text-gray-700">
                {t('mobileNumber')}
              </label>
              <input
                name="mobile"
                id="aptitude-mobile"
                type="tel"
                value={form.mobile}
                onChange={handleChange}
                required
                maxLength={10}
                pattern="[6-9][0-9]{9}"
                placeholder={t('mobilePlaceholder')}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label htmlFor="aptitude-qualification" className="mb-2 block font-medium text-gray-700">
                {t('highestQualification')}
              </label>
              <select
                name="highestQualification"
                id="aptitude-qualification"
                value={form.highestQualification}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              >
                <option value="">{t('selectQualification')}</option>
                <option value="10th">{t('qualification10th')}</option>
                <option value="12th">{t('qualification12th')}</option>
                <option value="diploma">{t('qualificationDiploma')}</option>
                <option value="graduate">{t('qualificationGraduate')}</option>
                <option value="post_graduate">{t('qualificationPostGraduate')}</option>
                <option value="other">{t('other')}</option>
              </select>
            </div>

            <div>
              <label htmlFor="aptitude-stream" className="mb-2 block font-medium text-gray-700">
                {t('stream')}
              </label>
              <select
                name="stream"
                id="aptitude-stream"
                value={form.stream}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              >
                <option value="">{t('selectStream')}</option>
                <option value="arts">{t('streamArts')}</option>
                <option value="commerce">{t('streamCommerce')}</option>
                <option value="science">{t('streamScience')}</option>
                <option value="it_computer_science">{t('streamIt')}</option>
                <option value="engineering">{t('streamEngineering')}</option>
                <option value="management">{t('streamManagement')}</option>
                <option value="other">{t('other')}</option>
              </select>
            </div>

            <div>
              <label htmlFor="aptitude-current-status" className="mb-2 block font-medium text-gray-700">
                {t('currentStatus')}
              </label>
              <select
                name="currentStatus"
                id="aptitude-current-status"
                value={form.currentStatus}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              >
                <option value="">{t('selectCurrentStatus')}</option>
                <option value="student">{t('statusStudent')}</option>
                <option value="fresher">{t('statusFresher')}</option>
                <option value="employee">{t('statusEmployee')}</option>
                <option value="working_professional">{t('statusWorkingProfessional')}</option>
                <option value="business_self_employed">{t('statusBusiness')}</option>
                <option value="other">{t('other')}</option>
              </select>
            </div>

            <div>
              <label htmlFor="aptitude-career-interest" className="mb-2 block font-medium text-gray-700">
                {t('careerInterest')}
              </label>
              <input
                name="careerInterest"
                id="aptitude-career-interest"
                value={form.careerInterest}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={150}
                placeholder={t('careerInterestPlaceholder')}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label htmlFor="aptitude-preferred-branch" className="mb-2 block font-medium text-gray-700">
                {t('preferredBranch')}
              </label>
              <input
                name="preferredBranch"
                id="aptitude-preferred-branch"
                value={form.preferredBranch}
                onChange={handleChange}
                maxLength={100}
                placeholder={t('preferredBranchPlaceholder')}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <label className="flex items-start gap-3 text-sm text-gray-600">
              <input
                type="checkbox"
                name="consentGiven"
                id="aptitude-consent"
                checked={form.consentGiven}
                onChange={handleChange}
                required
                className="mt-1 h-4 w-4"
              />
              <span>
                {t('consent')}
              </span>
            </label>

            {message && (
              <div
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {loading ? t('submitting') : t('registerFreeTest')}
            </button>

          </form>
        )}

        {/* Review / API error message */}
        {testMessage && testResult && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {testMessage}
          </p>
        )}

      </div>
    </main>
  );
}
