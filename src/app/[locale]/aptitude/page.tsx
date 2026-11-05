
'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';

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

  return (
    typeof candidate.percentage === 'number' &&
    typeof candidate.totalScore === 'number' &&
    typeof candidate.totalQuestions === 'number' &&
    typeof sectionScores === 'object' &&
    sectionScores !== null &&
    typeof (sectionScores as Record<string, unknown>).numerical === 'number' &&
    typeof (sectionScores as Record<string, unknown>).logical === 'number' &&
    typeof (sectionScores as Record<string, unknown>).verbal === 'number' &&
    typeof (sectionScores as Record<string, unknown>).computer === 'number'
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

  const correctCount = reviewQuestions.length
    ? reviewQuestions.filter((item) => item.isCorrect).length
    : (testResult?.totalScore ?? 0);

  const wrongCount = reviewQuestions.length
    ? reviewQuestions.filter(
        (item) => item.selectedOption !== null && !item.isCorrect
      ).length
    : Math.max(0, answeredCount - correctCount);

  const unansweredCount = reviewQuestions.length
    ? reviewQuestions.filter((item) => item.selectedOption === null).length
    : Math.max(
        0,
        (testResult?.totalQuestions ?? 20) - answeredCount
      );

  const sectionData = testResult
    ? [
        {
          label: 'Numerical Ability',
          score: testResult.sectionScores.numerical,
          color: 'bg-blue-500',
          textColor: 'text-blue-700',
        },
        {
          label: 'Logical Reasoning',
          score: testResult.sectionScores.logical,
          color: 'bg-violet-500',
          textColor: 'text-violet-700',
        },
        {
          label: 'Verbal Ability',
          score: testResult.sectionScores.verbal,
          color: 'bg-amber-500',
          textColor: 'text-amber-700',
        },
        {
          label: 'Computer Knowledge',
          score: testResult.sectionScores.computer,
          color: 'bg-emerald-500',
          textColor: 'text-emerald-700',
        },
      ]
    : [];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm sm:p-10">

        <h1 className="text-3xl font-bold text-gray-900">
          Free Aptitude Test
        </h1>

        <p className="mt-2 text-gray-600">
          Complete the registration form to begin your aptitude test.
        </p>

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

          /* RESULT PAGE */
          <section className="mt-8 space-y-6">

            {/* RESULT HEADER */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 p-7 text-white shadow-xl sm:p-10">
              <div className="relative z-10">
                <p className="text-sm font-medium uppercase tracking-widest text-blue-200">
                  Aptitude Assessment Report
                </p>

                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                  Your Test Result
                </h2>

                <p className="mt-2 text-sm text-blue-100">
                  Your performance analysis and career improvement guide.
                </p>

                <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row">
                  <div className="flex h-36 w-36 shrink-0 flex-col items-center justify-center rounded-full border-4 border-blue-300 bg-white/10">
                    <span className="text-4xl font-bold">
                      {testResult.percentage}%
                    </span>
                    <span className="mt-1 text-xs text-blue-100">
                      Overall Score
                    </span>
                  </div>

                  <div>
                    <p className="text-2xl font-bold">
                      {testResult.totalScore} / {testResult.totalQuestions}
                    </p>

                    <p className="mt-1 text-sm text-blue-100">
                      Total correct answers
                    </p>

                    <p className="mt-4 text-sm text-blue-100">
                      {testResult.percentage < 40
                        ? 'Your learning journey starts here. Focus on building strong fundamentals.'
                        : testResult.percentage < 70
                          ? 'Good effort! Regular practice can improve your performance.'
                          : 'Great performance! Keep developing your skills.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-400/10" />
              <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-indigo-400/10" />
            </div>

            {/* PERFORMANCE SUMMARY */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

              <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
                <p className="text-sm text-green-700">Correct</p>
                <p className="mt-2 text-3xl font-bold text-green-800">
                  {correctCount}
                </p>
                <p className="text-xs text-green-700">Answers</p>
              </div>

              <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
                <p className="text-sm text-red-700">Wrong</p>
                <p className="mt-2 text-3xl font-bold text-red-800">
                  {wrongCount}
                </p>
                <p className="text-xs text-red-700">Answers</p>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-sm text-amber-700">Unanswered</p>
                <p className="mt-2 text-3xl font-bold text-amber-800">
                  {unansweredCount}
                </p>
                <p className="text-xs text-amber-700">Questions</p>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm text-blue-700">Total</p>
                <p className="mt-2 text-3xl font-bold text-blue-800">
                  {testResult.totalQuestions}
                </p>
                <p className="text-xs text-blue-700">Questions</p>
              </div>

            </div>

            {/* REVIEW MY ANSWERS BUTTON */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900">
                Check Your Answers
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Review all your answers, correct answers and explanations.
              </p>

              <button
                type="button"
                onClick={handleReviewAnswers}
                disabled={reviewLoading}
                className="mt-5 rounded-lg bg-blue-700 px-7 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reviewLoading ? 'Loading Answers...' : 'Review My Answers'}
              </button>
            </div>

            {/* ANSWER REVIEW */}
            {showReview && (
              <div className="space-y-6" id="answer-review">

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Your Answer Review
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Review your selected answers and learn from explanations.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowReview(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Hide Review
                  </button>
                </div>

                {reviewQuestions.map((item) => (
                  <div
                    key={item.questionId}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-gray-500">
                        Question {item.questionOrder} · {item.section}
                      </span>

                      {item.selectedOption === null ? (
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
                          Not Answered
                        </span>
                      ) : item.isCorrect ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                          Correct
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800">
                          Incorrect
                        </span>
                      )}
                    </div>

                    <h3 className="mb-4 font-semibold text-gray-900">
                      {item.questionText}
                    </h3>

                    <div className="space-y-2">
                      {(['A', 'B', 'C', 'D'] as const).map((option) => {
                        const isCorrectOption =
                          option === item.correctOption;

                        const isSelectedOption =
                          option === item.selectedOption;

                        return (
                          <div
                            key={option}
                            className={`rounded-lg border p-3 text-sm ${
                              isCorrectOption
                                ? 'border-green-500 bg-green-50 text-green-800'
                                : isSelectedOption
                                  ? 'border-red-500 bg-red-50 text-red-800'
                                  : 'border-gray-200 bg-gray-50 text-gray-700'
                            }`}
                          >
                            <span className="font-bold">{option}.</span>{' '}
                            {item.options[option]}

                            {isCorrectOption && (
                              <span className="ml-2 font-semibold">
                                (Correct Answer)
                              </span>
                            )}

                            {isSelectedOption && !item.isCorrect && (
                              <span className="ml-2 font-semibold">
                                (Your Answer)
                              </span>
                            )}

                            {isSelectedOption && item.isCorrect && (
                              <span className="ml-2 font-semibold">
                                (Your Answer)
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {item.selectedOption === null && (
                      <p className="mt-3 text-sm text-yellow-800">
                        You did not select an answer for this question.
                      </p>
                    )}

                    {item.explanation && (
                      <div className="mt-4 rounded-lg bg-blue-50 p-4">
                        <p className="mb-1 font-semibold text-blue-900">
                          Explanation
                        </p>
                        <p className="text-sm leading-6 text-blue-800">
                          {item.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

              </div>
            )}

            {/* SUBJECT WISE GRAPH */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
              <h3 className="text-xl font-bold text-gray-900">
                Subject-wise Performance
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Your marks in each subject out of 5 questions.
              </p>

              <div className="mt-7 space-y-7">
                {sectionData.map((section) => (
                  <div key={section.label}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-gray-800">
                        {section.label}
                      </span>

                      <span className={`text-sm font-bold ${section.textColor}`}>
                        {section.score} / 5
                      </span>
                    </div>

                    <div
                      className="h-3 w-full overflow-hidden rounded-full bg-gray-100"
                      role="progressbar"
                      aria-label={`${section.label} score`}
                      aria-valuenow={section.score}
                      aria-valuemin={0}
                      aria-valuemax={5}
                    >
                      <div
                        className={`h-full rounded-full ${section.color} transition-all duration-700`}
                        style={{
                          width: `${(section.score / 5) * 100}%`,
                        }}
                      />
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                      {section.score >= 4
                        ? 'Strong performance. Keep practising.'
                        : section.score === 3
                          ? 'Good foundation. Improve with regular practice.'
                          : 'Needs improvement. Focus on basic concepts and practice.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CAREER IMPROVEMENT GUIDE */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 sm:p-7">
              <h3 className="text-xl font-bold text-gray-900">
                Your Career Improvement Guide
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Follow these steps to improve your aptitude and career readiness.
              </p>

              <div className="mt-6 space-y-5">

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Strengthen your weak subjects
                    </h4>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Start with{' '}
                      {sectionData
                        .filter((section) => section.score <= 2)
                        .map((section) => section.label)
                        .join(', ') || 'your weaker areas'}.
                      {' '}Revise basic concepts and solve practice questions regularly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Follow a daily learning routine
                    </h4>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Spend 30–45 minutes daily on numerical ability,
                      logical reasoning, English communication and computer fundamentals.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Build practical skills
                    </h4>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Practise computer applications, communication and
                      problem-solving through practical exercises and projects.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Get career guidance
                    </h4>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Discuss your interests, current skills and learning goals
                      with a career counsellor before choosing a course.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* NEXT ACTION */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">
                Take the Next Step in Your Career
              </h3>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-600">
                Your aptitude result is a starting point for understanding
                your current skills. Get proper guidance to plan your next
                learning step.
              </p>

              <Link
                href="/#contact"
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 sm:w-auto"
              >
                Contact Us for Career Guidance
              </Link>

              <p className="mt-4 text-xs text-gray-400">
                This assessment is indicative and is not a final career selection test.
              </p>
            </div>

            <p className="text-center text-sm text-gray-500">
              Your result has been saved. You cannot retake this assessment.
            </p>

          </section>

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
