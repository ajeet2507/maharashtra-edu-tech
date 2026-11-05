
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getAptitudeStudent } from '@/lib/aptitudeSession';

export async function POST() {
  try {
    // Verify student's secure browser session.
    const student = await getAptitudeStudent();

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: 'Your session is invalid or expired. Please register again.',
        },
        { status: 401 }
      );
    }

    // Retrieve existing attempt or create a new one.
    const { data: attempts, error: attemptError } =
      await supabaseAdmin.rpc('start_aptitude_attempt', {
        p_student_id: student.id,
      });

    if (attemptError) {
      console.error('Aptitude start error:', attemptError);

      if (attemptError.message.includes('Student not found')) {
        return NextResponse.json(
          { success: false, message: 'Student not found.' },
          { status: 404 }
        );
      }

      if (
        attemptError.message.includes('Insufficient questions') ||
        attemptError.message.includes('Qualification mapping')
      ) {
        return NextResponse.json(
          {
            success: false,
            message: 'Test questions are currently unavailable.',
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: 'Unable to start the aptitude test.',
        },
        { status: 500 }
      );
    }

    const attempt = attempts?.[0];

    if (!attempt) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unable to create or retrieve test attempt.',
        },
        { status: 500 }
      );
    }

    // A submitted or expired attempt cannot be restarted.
    if (attempt.attempt_status !== 'in_progress') {
      return NextResponse.json(
        {
          success: true,
          alreadyAttempted: true,
          status: attempt.attempt_status,
          message: 'Your test attempt is already completed or expired.',
        },
        { status: 200 }
      );
    }

    // Retrieve the exact questions assigned to this attempt.
    const { data: questions, error: questionError } =
      await supabaseAdmin
        .from('aptitude_attempt_questions')
        .select(`
          question_order,
          question:aptitude_questions!inner (
            id,
            question_text,
            section,
            option_a,
            option_b,
            option_c,
            option_d
          )
        `)
        .eq('attempt_id', attempt.attempt_id)
        .order('question_order', { ascending: true });

    if (questionError) {
      console.error('Question retrieval error:', questionError);

      return NextResponse.json(
        {
          success: false,
          message: 'Unable to load test questions.',
        },
        { status: 500 }
      );
    }

    if (!questions || questions.length !== 20) {
      return NextResponse.json(
        {
          success: false,
          message: 'The test could not load all 20 questions.',
        },
        { status: 500 }
      );
    }

    // Retrieve answers already saved for this attempt.
    const { data: savedAnswers, error: answersError } =
      await supabaseAdmin
        .from('aptitude_answers')
        .select('question_id, selected_option')
        .eq('attempt_id', attempt.attempt_id);

    if (answersError) {
      console.error('Saved answers retrieval error:', answersError);

      return NextResponse.json(
        {
          success: false,
          message: 'Unable to restore your saved answers.',
        },
        { status: 500 }
      );
    }

    // Convert saved answers into a questionId: selectedOption object.
    const answers: Record<string, string> = {};

    savedAnswers?.forEach((answer) => {
      if (answer.selected_option) {
        answers[answer.question_id] = answer.selected_option;
      }
    });

    return NextResponse.json(
      {
        success: true,
        alreadyAttempted: false,
        attemptId: attempt.attempt_id,
        status: attempt.attempt_status,
        totalQuestions: 20,
        questions,
        savedAnswers: answers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Aptitude start API error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong. Please try again.',
      },
      { status: 500 }
    );
  }
}
