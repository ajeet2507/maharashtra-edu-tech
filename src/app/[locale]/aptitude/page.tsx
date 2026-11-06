
'use client';

import { FormEvent, useEffect, useState } from 'react';
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
        setMessage(data.message || 'Registration failed.');
        return;
      }

      setSuccess(true);
      setMessage(data.message);
    } catch {
      setMessage('Unable to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Start or restore the same test attempt
  const handleStartTest = async () => {
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
        setTestMessage(data.message || 'Unable to start test.');
        return;
      }

      if (data.alreadyAttempted) {
        setTestMessage(
          'Your test has already been submitted. Retest is not allowed.'
        );
        return;
      }

      if (!data.questions || data.questions.length !== 20) {
        setTestMessage('Unable to load all 20 questions.');
        return;
      }

      if (!data.attemptId) {
        setTestMessage('Test session could not be created. Please try again.');
        return;
      }

      setQuestions(data.questions);
      setAttemptId(data.attemptId);
      setAnswers(data.savedAnswers || {});
      setSuccess(true);
    } catch {
      setTestMessage('Unable to connect. Please try again.');
    } finally {
      setStartingTest(false);
    }
  };

  // Load submitted answers and correct answers securely
  const loadReviewData = async () => {
    setReviewLoading(true);

    try {
      const response = await fetch('/api/aptitude/review', {
        method: 'GET',
        cache: 'no-store',
      });

      const data: ReviewResponse = await response.json();

      if (!response.ok || !data.success || !data.review) {
        setTestMessage(
          data.message || 'Unable to load answer review.'
        );
        return false;
      }

      setReviewQuestions(data.review);
      return true;
    } catch (error) {
      console.error('Review error:', error);
      setTestMessage('Unable to load your answers. Please try again.');
      return false;
    } finally {
      setReviewLoading(false);
    }
  };

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
          setMessage(data.message || 'Unable to restore your test session.');
          return;
        }

        if (data.status === 'not_started') {
          setSuccess(true);
          setMessage('Your registration is already complete.');
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
            data.message || 'Your test attempt has expired.'
          );
        }
      } catch (error) {
        console.error('Session restoration error:', error);

        if (!cancelled) {
          setMessage(
            'Unable to restore your session. Please refresh the page.'
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
  }, []);

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
        setTestMessage(
          data.message || 'Unable to save your answer. Please try again.'
        );
        return;
      }

      setTestMessage('');
    } catch (error) {
      console.error('Save answer error:', error);
      setTestMessage(
        'Answer could not be saved. Please check your connection.'
      );
    }
  };

  // Submit test
  const handleSubmitTest = async () => {
    if (!attemptId) {
      setTestMessage('Test session not found. Please refresh and try again.');
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
        setTestMessage(
          data.message || 'Unable to submit test. Please try again.'
        );
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
          'Your test was submitted, but the result could not be loaded. Please refresh the page.'
        );
      }
    } catch (error) {
      console.error('Submit test error:', error);
      setTestMessage('Something went wrong while submitting your test.');
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
              Free Aptitude Test
            </h1>
            <p className="mt-2 text-gray-600">
              Complete the registration form to begin your aptitude test.
            </p>
          </>
        )}

        {restoring ? (
          <div className="mt-10 rounded-xl border border-blue-100 bg-blue-50 p-6 text-center">
            <p className="font-semibold text-blue-900">
              Restoring your aptitude test...
            </p>
            <p className="mt-2 text-sm text-blue-700">
              Please wait while we retrieve your test status.
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
              Aptitude Test
            </h2>

            <p className="text-gray-600">
              Answer all 20 questions.
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
              Answered: {answeredCount} / 20
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
                    Question {index + 1} of 20
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
                {submitting ? 'Submitting Test...' : 'Submit Test'}
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
                  ? 'Test Attempt Expired'
                  : '✓ Registration Successful!'}
              </p>

              <p className="mt-1 text-sm">
                {testMessage || message}
              </p>
            </div>

            {!attemptExpired && (
              <>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Your aptitude test is ready!
                  </h2>

                  <p className="mt-2 text-gray-600">
                    Click below to start your 20-question aptitude test.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleStartTest}
                  disabled={startingTest}
                  className="w-full rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {startingTest ? 'Loading Test...' : 'Start Aptitude Test'}
                </button>
              </>
            )}

          </div>

        ) : (

          /* REGISTRATION FORM */
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Full Name *
              </label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={100}
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Mobile Number *
              </label>
              <input
                name="mobile"
                type="tel"
                value={form.mobile}
                onChange={handleChange}
                required
                maxLength={10}
                pattern="[6-9][0-9]{9}"
                placeholder="10-digit mobile number"
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Highest Qualification *
              </label>
              <select
                name="highestQualification"
                value={form.highestQualification}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              >
                <option value="">Select Qualification</option>
                <option value="10th">10th</option>
                <option value="12th">12th</option>
                <option value="diploma">Diploma</option>
                <option value="graduate">Graduate</option>
                <option value="post_graduate">Post Graduate</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Stream *
              </label>
              <select
                name="stream"
                value={form.stream}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              >
                <option value="">Select Stream</option>
                <option value="arts">Arts</option>
                <option value="commerce">Commerce</option>
                <option value="science">Science</option>
                <option value="it_computer_science">IT / Computer Science</option>
                <option value="engineering">Engineering</option>
                <option value="management">Management</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Current Status *
              </label>
              <select
                name="currentStatus"
                value={form.currentStatus}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              >
                <option value="">Select Current Status</option>
                <option value="student">Student</option>
                <option value="fresher">Fresher</option>
                <option value="employee">Employee</option>
                <option value="working_professional">Working Professional</option>
                <option value="business_self_employed">Business / Self Employed</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Career Interest *
              </label>
              <input
                name="careerInterest"
                value={form.careerInterest}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={150}
                placeholder="e.g. Software Development, Accounting"
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Preferred Branch (Optional)
              </label>
              <input
                name="preferredBranch"
                value={form.preferredBranch}
                onChange={handleChange}
                maxLength={100}
                placeholder="Enter preferred branch"
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <label className="flex items-start gap-3 text-sm text-gray-600">
              <input
                type="checkbox"
                name="consentGiven"
                checked={form.consentGiven}
                onChange={handleChange}
                required
                className="mt-1 h-4 w-4"
              />
              <span>
                I agree to submit my details for the aptitude test
                and receive relevant career guidance.
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
              {loading ? 'Submitting...' : 'Register for Free Test'}
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
