
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getAptitudeStudent } from '@/lib/aptitudeSession';

const submitSchema = z.object({
  attemptId: z.string().uuid(),
  answers: z.array(
    z.object({
      questionId: z.string().uuid(),
      selectedOption: z.enum(['A', 'B', 'C', 'D']).nullable(),
    })
  ).length(20),
});

export async function POST(request: NextRequest) {
  try {
    // Verify the student's browser session.
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

    const body = await request.json();
    const validation = submitSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please submit all 20 answers correctly.',
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { attemptId, answers } = validation.data;

    // Confirm that this attempt belongs to the logged-in student.
    const { data: attempt, error: attemptError } =
      await supabaseAdmin
        .from('aptitude_attempts')
        .select('id, status')
        .eq('id', attemptId)
        .eq('student_id', student.id)
        .maybeSingle();

    if (attemptError) {
      console.error('Attempt ownership check error:', attemptError);

      return NextResponse.json(
        {
          success: false,
          message: 'Unable to verify your test attempt.',
        },
        { status: 500 }
      );
    }

    if (!attempt) {
      return NextResponse.json(
        {
          success: false,
          message: 'Test attempt not found.',
        },
        { status: 404 }
      );
    }

    if (attempt.status !== 'in_progress') {
      return NextResponse.json(
        {
          success: false,
          message: 'This test has already been submitted or expired.',
        },
        { status: 409 }
      );
    }

    // Calculate and save the score securely on the server.
    const { data, error } = await supabaseAdmin.rpc(
      'submit_aptitude_attempt',
      {
        p_attempt_id: attemptId,
        p_answers: answers,
      }
    );

    if (error) {
      console.error('Aptitude submission error:', error);

      if (error.message.includes('Attempt not found')) {
        return NextResponse.json(
          {
            success: false,
            message: 'Test attempt not found.',
          },
          { status: 404 }
        );
      }

      if (
        error.message.includes('already submitted') ||
        error.message.includes('expired')
      ) {
        return NextResponse.json(
          {
            success: false,
            message: 'This test has already been submitted.',
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: 'Unable to submit your test. Please try again.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your aptitude test has been submitted successfully.',
        result: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Aptitude submission API error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong. Please try again.',
      },
      { status: 500 }
    );
  }
}
