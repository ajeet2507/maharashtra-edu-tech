
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getAptitudeStudent } from '@/lib/aptitudeSession';

export async function GET() {
  try {
    // 1. Verify secure student session
    const student = await getAptitudeStudent();

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: 'Your session is invalid or expired.',
        },
        { status: 401 }
      );
    }

    // 2. Find student's attempt
    const { data: attempt, error: attemptError } =
      await supabaseAdmin
        .from('aptitude_attempts')
        .select('id, status')
        .eq('student_id', student.id)
        .maybeSingle();

    if (attemptError) {
      console.error('Review attempt error:', attemptError);

      return NextResponse.json(
        {
          success: false,
          message: 'Unable to retrieve your test attempt.',
        },
        { status: 500 }
      );
    }

    if (!attempt || attempt.status !== 'submitted') {
      return NextResponse.json(
        {
          success: false,
          message: 'Answer review is available only after test submission.',
        },
        { status: 403 }
      );
    }

    // 3. Get assigned questions in original order
    const { data: assignedQuestions, error: assignedError } =
      await supabaseAdmin
        .from('aptitude_attempt_questions')
        .select('question_id, question_order')
        .eq('attempt_id', attempt.id)
        .order('question_order', { ascending: true });

    if (assignedError || !assignedQuestions) {
      console.error('Assigned questions error:', assignedError);

      return NextResponse.json(
        {
          success: false,
          message: 'Unable to retrieve assigned questions.',
        },
        { status: 500 }
      );
    }

    const questionIds = assignedQuestions.map(
      (item) => item.question_id
    );

    // 4. Get question details and correct answers
    const { data: questions, error: questionsError } =
      await supabaseAdmin
        .from('aptitude_questions')
        .select(`
          id,
          question_text,
          section,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_option,
          explanation
        `)
        .in('id', questionIds);

    if (questionsError || !questions) {
      console.error('Review questions error:', questionsError);

      return NextResponse.json(
        {
          success: false,
          message: 'Unable to retrieve question details.',
        },
        { status: 500 }
      );
    }

    // 5. Get student's submitted answers
    const { data: answers, error: answersError } =
      await supabaseAdmin
        .from('aptitude_answers')
        .select('question_id, selected_option, is_correct')
        .eq('attempt_id', attempt.id);

    if (answersError || !answers) {
      console.error('Review answers error:', answersError);

      return NextResponse.json(
        {
          success: false,
          message: 'Unable to retrieve your submitted answers.',
        },
        { status: 500 }
      );
    }

    // 6. Combine question, correct answer and student answer
    const review = assignedQuestions.map((assigned) => {
      const question = questions.find(
        (item) => item.id === assigned.question_id
      );

      const answer = answers.find(
        (item) => item.question_id === assigned.question_id
      );

      if (!question) {
        return null;
      }

      return {
        questionOrder: assigned.question_order,
        questionId: question.id,
        questionText: question.question_text,
        section: question.section,

        options: {
          A: question.option_a,
          B: question.option_b,
          C: question.option_c,
          D: question.option_d,
        },

        selectedOption: answer?.selected_option ?? null,
        correctOption: question.correct_option,
        isCorrect: answer?.is_correct ?? false,
        explanation: question.explanation,
      };
    }).filter(Boolean);

    return NextResponse.json(
      {
        success: true,
        totalQuestions: review.length,
        review,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Aptitude review API error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong while retrieving answer review.',
      },
      { status: 500 }
    );
  }
}
