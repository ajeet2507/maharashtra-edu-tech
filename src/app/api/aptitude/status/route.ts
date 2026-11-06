
import { connection, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getAptitudeStudent } from '@/lib/aptitudeSession';

export async function GET() {
  await connection();

  try {
    // Verify the student's secure browser session.
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

    // Find this student's existing attempt.
    const { data: attempt, error: attemptError } =
      await supabaseAdmin
        .from('aptitude_attempts')
        .select('id, status, total_questions, total_score, percentage')
        .eq('student_id', student.id)
        .maybeSingle();

    if (attemptError) {
      console.error('Aptitude status error:', attemptError);

      return NextResponse.json(
        {
          success: false,
          message: 'Unable to retrieve your test status.',
        },
        { status: 500 }
      );
    }

    // Student has registered but has not started the test.
    if (!attempt) {
      return NextResponse.json(
        {
          success: true,
          status: 'not_started',
        },
        { status: 200 }
      );
    }

    // Test is still in progress.
    if (attempt.status === 'in_progress') {
      return NextResponse.json(
        {
          success: true,
          status: 'in_progress',
          attemptId: attempt.id,
        },
        { status: 200 }
      );
    }

    // Do not allow a retest after submission or expiry.
    if (attempt.status === 'submitted') {
      const { data: result, error: resultError } =
        await supabaseAdmin
          .from('aptitude_results')
          .select(`
            numerical_score,
            logical_score,
            verbal_score,
            computer_score
          `)
          .eq('attempt_id', attempt.id)
          .maybeSingle();

      if (resultError || !result) {
        console.error('Aptitude result retrieval error:', resultError);

        return NextResponse.json(
          {
            success: false,
            message: 'Your test result could not be retrieved.',
          },
          { status: 500 }
        );
      }

      const sectionScores = {
        numerical: result.numerical_score,
        logical: result.logical_score,
        verbal: result.verbal_score,
        computer: result.computer_score,
      };

      const totalScore =
        sectionScores.numerical +
        sectionScores.logical +
        sectionScores.verbal +
        sectionScores.computer;

      const totalQuestions = attempt.total_questions || 20;

      const percentage =
        attempt.percentage ??
        Math.round((totalScore / totalQuestions) * 100);

      return NextResponse.json(
        {
          success: true,
          status: 'submitted',
          result: {
            percentage: Number(percentage),
            totalScore,
            totalQuestions,
            sectionScores,
          },
        },
        { status: 200 }
      );
    }

    // Expired attempts cannot be restarted.
    return NextResponse.json(
      {
        success: true,
        status: 'expired',
        message: 'Your test attempt has expired. Retest is not allowed.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Aptitude status API error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong. Please try again.',
      },
      { status: 500 }
    );
  }
}
