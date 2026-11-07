'use client';

import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  Download,
  Share2,
  Target,
} from 'lucide-react';

type Result = {
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

type ReviewedQuestion = {
  questionOrder: number;
  questionId: string;
  questionText: string;
  section: string;
  options: { A: string; B: string; C: string; D: string };
  selectedOption: string | null;
  correctOption: string;
  isCorrect: boolean;
  explanation: string | null;
};

type Props = {
  result: Result;
  review: ReviewedQuestion[];
  reviewLoading: boolean;
  showReview: boolean;
  onReview: () => void;
  onToggleReview: (visible: boolean) => void;
};

type SectionMetric = {
  id: string;
  label: string;
  course: string;
  score: number;
  maximum: number;
  percentage: number;
};

const sectionInfo = {
  numerical: { label: 'numerical', course: 'programmingCourse' },
  logical: { label: 'logical', course: 'programmingCourse' },
  verbal: { label: 'verbal', course: 'schoolCourse' },
  computer: { label: 'computer', course: 'computerCourse' },
} as const;

const gaugeCircumference = 2 * Math.PI * 43;
const chartColors = ['#ffc928', '#f28b34', '#31558c', '#30a17a'];

function getSectionKey(section: string) {
  const normalized = section.toLowerCase();
  if (normalized.includes('numer')) return 'numerical';
  if (normalized.includes('logic')) return 'logical';
  if (normalized.includes('verbal')) return 'verbal';
  if (normalized.includes('computer')) return 'computer';
  return null;
}

function getPoint(
  centerX: number,
  centerY: number,
  radius: number,
  index: number,
  count: number,
) {
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
  return {
    x: centerX + Math.cos(angle) * radius,
    y: centerY + Math.sin(angle) * radius,
  };
}

function DonutChart({
  values,
  total,
  questionLabel,
}: {
  values: { correct: number; incorrect: number; unanswered: number };
  total: number;
  questionLabel: string;
}) {
  const circumference = 2 * Math.PI * 40;
  const segments = [
    { key: 'correct', value: values.correct, color: '#30a17a' },
    { key: 'incorrect', value: values.incorrect, color: '#f28b34' },
    { key: 'unanswered', value: values.unanswered, color: '#ffc928' },
  ];
  let offset = 0;

  return (
    <svg
      viewBox="0 0 100 100"
      className="mx-auto h-52 w-52 max-w-full"
      data-chart="donut"
      role="img"
      aria-label={questionLabel}
    >
      <circle cx="50" cy="50" r="40" fill="none" stroke="#edf0f5" strokeWidth="12" />
      {segments.map(({ key, value, color }) => {
        const segmentLength = total > 0 ? (value / total) * circumference : 0;
        const circle = (
          <circle
            key={key}
            className="result-donut-segment"
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
            transform="rotate(-90 50 50)"
          />
        );
        offset += segmentLength;
        return circle;
      })}
      <text x="50" y="47" textAnchor="middle" className="fill-[#10234d] text-[19px] font-bold">
        {total}
      </text>
      <text x="50" y="59" textAnchor="middle" className="fill-slate-500 text-[6px]">
        {questionLabel}
      </text>
    </svg>
  );
}

function RadarChart({ metrics, summary }: { metrics: SectionMetric[]; summary: string }) {
  const centerX = 150;
  const centerY = 130;
  const radius = 76;
  const points = metrics.map((metric, index) => {
    const point = getPoint(centerX, centerY, radius * (metric.percentage / 100), index, metrics.length);
    return `${point.x},${point.y}`;
  });

  return (
    <svg
      viewBox="0 0 300 260"
      className="mx-auto max-h-72 w-full max-w-[420px]"
      data-chart="radar"
      role="img"
      aria-label={summary}
    >
      {[25, 50, 75, 100].map((level) => {
        const pointsAtLevel = metrics
          .map((_, index) => {
            const point = getPoint(centerX, centerY, radius * (level / 100), index, metrics.length);
            return `${point.x},${point.y}`;
          })
          .join(' ');
        return (
          <polygon
            key={level}
            points={pointsAtLevel}
            fill="none"
            stroke="#dce2ec"
            strokeWidth="1"
          />
        );
      })}
      {metrics.map((_, index) => {
        const point = getPoint(centerX, centerY, radius, index, metrics.length);
        return (
          <line
            key={index}
            x1={centerX}
            y1={centerY}
            x2={point.x}
            y2={point.y}
            stroke="#dce2ec"
            strokeWidth="1"
          />
        );
      })}
      <polygon
        points={points.join(' ')}
        fill="rgba(255, 201, 40, 0.3)"
        stroke="#c47a00"
        strokeWidth="2.5"
      />
      {metrics.map((metric, index) => {
        const point = getPoint(centerX, centerY, 112, index, metrics.length);
        const anchor = point.x > centerX + 8 ? 'start' : point.x < centerX - 8 ? 'end' : 'middle';
        return (
          <text
            key={metric.id}
            x={point.x}
            y={point.y}
            textAnchor={anchor}
            dominantBaseline="middle"
            className="fill-slate-600 text-[9px] font-semibold"
          >
            {metric.label.length > 19 ? `${metric.label.slice(0, 17)}…` : metric.label}
          </text>
        );
      })}
    </svg>
  );
}

export default function AptitudeResultDashboard({
  result,
  review,
  reviewLoading,
  showReview,
  onReview,
  onToggleReview,
}: Props) {
  const t = useTranslations('AptitudeDashboard');
  const [actionMessage, setActionMessage] = useState('');
  const completeReview = review.length === result.totalQuestions && review.length > 0;

  const questionOutcomes = useMemo(() => {
    if (!completeReview) return null;
    const correct = review.filter((item) => item.selectedOption !== null && item.isCorrect).length;
    const incorrect = review.filter((item) => item.selectedOption !== null && !item.isCorrect).length;
    const unanswered = review.filter((item) => item.selectedOption === null).length;

    if (
      correct !== result.totalScore ||
      correct + incorrect + unanswered !== result.totalQuestions
    ) {
      return null;
    }

    return { correct, incorrect, unanswered, answered: correct + incorrect };
  }, [completeReview, result.totalQuestions, result.totalScore, review]);

  const sectionMetrics = useMemo<SectionMetric[]>(() => {
    if (!completeReview || !questionOutcomes) return [];

    const grouped = new Map<string, ReviewedQuestion[]>();
    for (const question of review) {
      const current = grouped.get(question.section) ?? [];
      current.push(question);
      grouped.set(question.section, current);
    }

    const metrics = Array.from(grouped.entries()).map(([section, questions]) => {
      const key = getSectionKey(section);
      const score = questions.filter(
        (question) => question.selectedOption !== null && question.isCorrect,
      ).length;
      const maximum = questions.length;
      const resultScore = key ? result.sectionScores[key] : score;

      return {
        id: section,
        label: key ? t(sectionInfo[key].label) : section,
        course: key ? t(sectionInfo[key].course) : t('generalCourseAdvice'),
        score: resultScore,
        maximum,
        percentage: maximum > 0 ? Math.round((resultScore / maximum) * 100) : 0,
        reviewScore: score,
      };
    });
    return metrics.some((metric) => metric.score !== metric.reviewScore) ? [] : metrics;
  }, [completeReview, questionOutcomes, result.sectionScores, review, t]);

  const strongest = useMemo(() => {
    if (!sectionMetrics.length) return [];
    const highest = Math.max(...sectionMetrics.map((item) => item.percentage));
    return sectionMetrics.filter((item) => item.percentage === highest);
  }, [sectionMetrics]);

  const practiceAreas = useMemo(() => {
    if (!sectionMetrics.length) return [];
    const lowest = Math.min(...sectionMetrics.map((item) => item.percentage));
    return sectionMetrics.filter((item) => item.percentage === lowest);
  }, [sectionMetrics]);

  const safePercentage = Math.min(100, Math.max(0, result.percentage));
  const gaugeOffset = gaugeCircumference * (1 - safePercentage / 100);

  async function shareResult() {
    setActionMessage('');
    const shareData = {
      title: t('shareTitle'),
      text: t('shareText', {
        score: result.totalScore,
        maximum: result.totalQuestions,
        percentage: result.percentage,
      }),
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareData.text} ${window.location.href}`);
        setActionMessage(t('copied'));
      } else {
        setActionMessage(t('shareUnavailable'));
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      console.error('Unable to share aptitude result:', error);
      setActionMessage(t('shareUnavailable'));
    }
  }

  function printResult() {
    window.print();
  }

  const legend = [
    { key: 'correct', label: t('correct'), value: questionOutcomes?.correct ?? 0, color: '#30a17a' },
    { key: 'incorrect', label: t('incorrect'), value: questionOutcomes?.incorrect ?? 0, color: '#f28b34' },
    { key: 'unanswered', label: t('unanswered'), value: questionOutcomes?.unanswered ?? 0, color: '#ffc928' },
  ];

  return (
    <section className="aptitude-result-dashboard mt-8 space-y-6" aria-labelledby="aptitude-result-title">
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1937] via-[#10234d] to-[#244574] p-6 text-white shadow-xl sm:p-9">
        <div className="relative z-10 max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#ffe27a]">
            <Check aria-hidden="true" size={15} />
            {t('completed')}
          </p>
          <h1 id="aptitude-result-title" className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            {t('heroTitle')}
          </h1>
          <p className="mt-2 text-sm leading-6 text-blue-100 sm:text-base">{t('heroDescription')}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={printResult}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ffc928] px-4 py-2.5 text-sm font-extrabold text-[#10234d] transition hover:-translate-y-0.5 hover:bg-[#ffda5e] active:scale-95"
            >
              <Download aria-hidden="true" size={17} />
              {t('download')}
            </button>
            <button
              type="button"
              onClick={shareResult}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/15 active:scale-95"
            >
              <Share2 aria-hidden="true" size={17} />
              {t('share')}
            </button>
            <button
              type="button"
              disabled
              title={t('retakeUnavailable')}
              className="inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/55"
            >
              {t('retake')}
            </button>
          </div>
          <p className="mt-2 text-xs text-blue-200">{t('retakeUnavailable')}</p>
          {actionMessage && <p role="status" className="mt-3 text-sm text-[#ffe27a]">{actionMessage}</p>}
        </div>
        <div aria-hidden="true" className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[44px] border-white/[0.05]" />
        <div aria-hidden="true" className="absolute -bottom-36 right-28 h-64 w-64 rounded-full border-[40px] border-[#ffc928]/10" />
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff4c2] text-[#10234d]">
              <Target aria-hidden="true" size={21} />
            </span>
            <div>
              <h3 className="text-lg font-extrabold text-[#10234d]">{t('overallTitle')}</h3>
              <p className="mt-1 text-sm leading-5 text-slate-600">{t('overallDescription')}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
            <div className="relative h-48 w-48 shrink-0">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" data-chart="gauge" role="img" aria-label={t('scoreSummary', { score: result.totalScore, maximum: result.totalQuestions, percentage: result.percentage })}>
                <circle cx="50" cy="50" r="43" fill="none" stroke="#edf0f5" strokeWidth="9" />
                <circle
                  cx="50"
                  cy="50"
                  r="43"
                  fill="none"
                  stroke="#ffc928"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={gaugeCircumference}
                  style={{ '--gauge-offset': `${gaugeOffset}px` } as CSSProperties}
                  className="score-gauge-progress"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black tracking-tight text-[#10234d]">{result.percentage}%</span>
                <span className="mt-1 text-xs font-semibold text-slate-500">{t('percentage')}</span>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-slate-500">{t('totalScore')}</p>
              <p className="mt-1 text-3xl font-black text-[#10234d]">
                {result.totalScore}<span className="px-1 text-xl font-medium text-slate-400">/</span>{result.totalQuestions}
              </p>
              <p className="mt-1 text-sm text-slate-600">{t('points')}</p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h3 className="text-lg font-extrabold text-[#10234d]">{t('outcomesTitle')}</h3>
          <p className="mt-1 text-sm leading-5 text-slate-600">{t('outcomesDescription')}</p>
          {questionOutcomes ? (
            <div className="mt-4 grid items-center gap-4 sm:grid-cols-[minmax(160px,0.9fr)_1fr]">
              <DonutChart
                values={questionOutcomes}
                total={result.totalQuestions}
                questionLabel={t('outcomesSummary', {
                  correct: questionOutcomes.correct,
                  incorrect: questionOutcomes.incorrect,
                  unanswered: questionOutcomes.unanswered,
                  total: result.totalQuestions,
                })}
              />
              <ul className="grid grid-cols-1 gap-3" aria-label={t('chartLegend')}>
                {legend.map((item) => {
                  const percentage = result.totalQuestions > 0
                    ? Math.round((item.value / result.totalQuestions) * 100)
                    : 0;
                  return (
                    <li key={item.key} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
                      <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-700">
                        <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="truncate">{item.label}</span>
                      </span>
                      <span className="shrink-0 text-sm font-extrabold text-[#10234d]">
                        {item.value} <span className="font-medium text-slate-500">({percentage}%)</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
              {reviewLoading ? t('loadingReview') : t('outcomesUnavailable')}
            </div>
          )}
        </article>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h3 className="text-lg font-extrabold text-[#10234d]">{t('categoryTitle')}</h3>
          <p className="mt-1 text-sm leading-5 text-slate-600">{t('categoryDescription')}</p>
          {sectionMetrics.length ? (
            <div className="mt-6 space-y-5">
              {sectionMetrics.map((metric, index) => (
                <div key={metric.id}>
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <span className="text-sm font-bold text-slate-700">{metric.label}</span>
                    <span className="shrink-0 text-right text-sm font-extrabold text-[#10234d]">
                      {metric.score}/{metric.maximum}
                      <span className="ml-1.5 font-semibold text-slate-500">· {metric.percentage}%</span>
                    </span>
                  </div>
                  <div
                    className="h-3 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                    aria-label={t('categoryProgressLabel', { category: metric.label })}
                    aria-valuenow={metric.score}
                    aria-valuemin={0}
                    aria-valuemax={metric.maximum}
                  >
                    <div
                      className="h-full rounded-full transition-[width] duration-700 ease-out"
                      style={{ width: `${metric.percentage}%`, backgroundColor: chartColors[index % chartColors.length] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
              {t('categoryUnavailable')}
            </div>
          )}
          <p className="sr-only">
            {t('categoryTextSummary', {
              categories: sectionMetrics.map((metric) => t('categoryTextItem', {
                category: metric.label,
                score: metric.score,
                maximum: metric.maximum,
                percentage: metric.percentage,
              })).join('; '),
            })}
          </p>
        </article>

        {sectionMetrics.length >= 3 && (
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h3 className="text-lg font-extrabold text-[#10234d]">{t('radarTitle')}</h3>
            <p className="mt-1 text-sm leading-5 text-slate-600">{t('radarDescription')}</p>
            <div className="mt-3">
              <RadarChart
                metrics={sectionMetrics}
                summary={t('radarSummary', {
                  categories: sectionMetrics.map((metric) => `${metric.label} ${metric.percentage}%`).join(', '),
                })}
              />
            </div>
            <ul className="mt-2 grid grid-cols-2 gap-2">
              {sectionMetrics.map((metric, index) => (
                <li key={metric.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-2.5 py-2 text-xs">
                  <span className="flex min-w-0 items-center gap-1.5 font-medium text-slate-600">
                    <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
                    <span className="truncate">{metric.label}</span>
                  </span>
                  <span className="font-extrabold text-[#10234d]">{metric.percentage}%</span>
                </li>
              ))}
            </ul>
          </article>
        )}
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <h3 className="text-lg font-extrabold text-[#10234d]">{t('questionAnalysisTitle')}</h3>
        <p className="mt-1 text-sm leading-5 text-slate-600">{t('questionAnalysisDescription')}</p>
        {questionOutcomes ? (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: t('answered'), value: questionOutcomes.answered, className: 'border-blue-100 bg-blue-50 text-blue-900' },
              { label: t('correct'), value: questionOutcomes.correct, className: 'border-green-100 bg-green-50 text-green-900' },
              { label: t('incorrect'), value: questionOutcomes.incorrect, className: 'border-orange-100 bg-orange-50 text-orange-900' },
              { label: t('unanswered'), value: questionOutcomes.unanswered, className: 'border-amber-100 bg-amber-50 text-amber-900' },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl border p-4 ${item.className}`}>
                <p className="text-xs font-bold">{item.label}</p>
                <p className="mt-1 text-2xl font-black">{item.value}</p>
                <p className="text-xs opacity-75">{t('ofTotal', { total: result.totalQuestions })}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            {reviewLoading ? t('loadingReview') : t('outcomesUnavailable')}
          </p>
        )}
      </article>

      <article className="rounded-2xl border border-[#f1dfaa] bg-gradient-to-br from-[#fff9e6] to-white p-5 shadow-sm sm:p-7">
        <h3 className="text-lg font-extrabold text-[#10234d]">{t('recommendationsTitle')}</h3>
        <p className="mt-1 text-sm leading-5 text-slate-600">{t('recommendationsDescription')}</p>
        {sectionMetrics.length ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-green-100 bg-white p-4">
              <h4 className="text-sm font-extrabold text-green-800">{t('strongestAreas')}</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {strongest.map((metric) => (
                  <span key={metric.id} className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-800">
                    {metric.label} · {metric.percentage}%
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-orange-100 bg-white p-4">
              <h4 className="text-sm font-extrabold text-orange-800">{t('practiceAreas')}</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {practiceAreas.map((metric) => (
                  <span key={metric.id} className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-800">
                    {metric.label} · {metric.percentage}%
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h4 className="text-sm font-extrabold text-[#10234d]">{t('revisionSuggestions')}</h4>
              <ul className="mt-3 space-y-3">
                {practiceAreas.map((metric) => (
                  <li key={metric.id} className="flex gap-2.5 text-sm leading-5 text-slate-600">
                    <BookOpenCheck aria-hidden="true" size={17} className="mt-0.5 shrink-0 text-[#c47a00]" />
                    <span>{t('reviewSectionAdvice', { category: metric.label })}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h4 className="text-sm font-extrabold text-[#10234d]">{t('relatedCourses')}</h4>
              <ul className="mt-3 space-y-3">
                {Array.from(new Map(practiceAreas.map((metric) => [metric.course, metric])).values()).map((metric) => (
                  <li key={metric.course} className="flex gap-2.5 text-sm leading-5 text-slate-600">
                    <ArrowRight aria-hidden="true" size={17} className="mt-0.5 shrink-0 text-[#c47a00]" />
                    <span>{metric.course}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-white p-4 text-sm leading-6 text-slate-600">
            {t('recommendationsUnavailable')}
          </p>
        )}
      </article>

      <div className="grid gap-4 rounded-2xl bg-[#10234d] p-5 text-white sm:grid-cols-[1fr_auto] sm:items-center sm:p-7">
        <div>
          <h3 className="text-xl font-extrabold">{t('coursesCtaTitle')}</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-blue-100">{t('coursesCtaDescription')}</p>
        </div>
        <Link
          href="/#courses"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ffc928] px-5 py-3 text-sm font-extrabold text-[#10234d] transition hover:-translate-y-0.5 hover:bg-[#ffda5e] active:scale-95"
        >
          {t('exploreCourses')}
          <ArrowRight aria-hidden="true" size={17} />
        </Link>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#10234d]">{t('answerReviewTitle')}</h3>
            <p className="mt-1 text-sm leading-5 text-slate-600">{t('answerReviewDescription')}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (showReview) {
                onToggleReview(false);
              } else {
                onReview();
              }
            }}
            disabled={reviewLoading}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#10234d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#183b7a] active:scale-95 disabled:cursor-wait disabled:opacity-60"
          >
            {showReview ? t('hideReview') : reviewLoading ? t('loadingReview') : t('reviewAnswers')}
          </button>
        </div>
        {showReview && (
          <div id="answer-review" className="mt-6 space-y-4">
            {review.map((item) => (
              <section key={item.questionId} className="rounded-xl border border-slate-200 p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-500">
                    {t('questionNumber', { number: item.questionOrder })} · {(() => {
                      const sectionKey = getSectionKey(item.section);
                      return sectionKey ? t(sectionKey) : item.section;
                    })()}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    item.selectedOption === null
                      ? 'bg-amber-50 text-amber-800'
                      : item.isCorrect
                        ? 'bg-green-50 text-green-800'
                        : 'bg-orange-50 text-orange-800'
                  }`}>
                    {item.selectedOption === null ? t('unanswered') : item.isCorrect ? t('correct') : t('incorrect')}
                  </span>
                </div>
                <h4 className="mt-3 text-sm font-bold leading-6 text-[#10234d]">{item.questionText}</h4>
                <div className="mt-3 grid gap-2">
                  {(['A', 'B', 'C', 'D'] as const).map((option) => (
                    <div
                      key={option}
                      className={`rounded-lg border p-3 text-sm leading-5 ${
                        option === item.correctOption
                          ? 'border-green-200 bg-green-50 text-green-900'
                          : option === item.selectedOption
                            ? 'border-orange-200 bg-orange-50 text-orange-900'
                            : 'border-slate-100 bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="mr-1 font-bold">{option}.</span>
                      {item.options[option]}
                      {option === item.correctOption && <span className="ml-2 font-semibold">· {t('correctAnswer')}</span>}
                      {option === item.selectedOption && <span className="ml-2 font-semibold">· {t('yourAnswer')}</span>}
                    </div>
                  ))}
                </div>
                {item.selectedOption === null && (
                  <p className="mt-3 text-sm text-amber-800">{t('questionUnanswered')}</p>
                )}
                {item.explanation && (
                  <div className="mt-3 rounded-lg bg-blue-50 p-4">
                    <p className="text-xs font-extrabold uppercase tracking-wide text-blue-900">{t('explanation')}</p>
                    <p className="mt-1 text-sm leading-6 text-blue-800">{item.explanation}</p>
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </article>

      <p className="text-center text-xs leading-5 text-slate-500">{t('disclaimer')}</p>
    </section>
  );
}
