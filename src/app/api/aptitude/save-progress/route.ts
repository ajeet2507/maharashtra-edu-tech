
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getAptitudeStudent } from '@/lib/aptitudeSession';

export async function POST(request: NextRequest) {
  try {
    const student = await getAptitudeStudent();

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Your session is invalid or expired.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { attemptId, questionId, selectedOption } = body;

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (
      typeof attemptId !== 'string' ||
      !uuidRegex.test(attemptId) ||
      typeof questionId !== 'string' ||
      !uuidRegex.test(questionId)
    ) {
      return NextResponse.json(
        { success: false, message: 'Invalid attempt or question.' },
        { status: 400 }
      );
    }

    if (
      selectedOption !== null &&
      !['A', 'B', 'C', 'D'].includes(selectedOption)
    ) {
      return NextResponse.json(
        { success: false, message: 'Invalid answer option.' },
        { status: 400 }
      );
    }

    // Verify attempt belongs to the logged-in student.
    const { data: attempt, error: attemptError } =
      await supabaseAdmin
        .from('aptitude_attempts')
        .select('id, status')
        .eq('id', attemptId)
        .eq('student_id', student.id)
        .maybeSingle();

    if (attemptError || !attempt) {
      return NextResponse.json(
        { success: false, message: 'Test attempt not found.' },
        { status: 404 }
      );
    }

    if (attempt.status !== 'in_progress') {
      return NextResponse.json(
        { success: false, message: 'This test is no longer active.' },
        { status: 409 }
      );
    }

    // Verify question belongs to this attempt.
    const { data: assignedQuestion, error: assignedError } =
      await supabaseAdmin
        .from('aptitude_attempt_questions')
        .select('question_id')
        .eq('attempt_id', attemptId)
        .eq('question_id', questionId)
        .maybeSingle();

    if (assignedError || !assignedQuestion) {
      return NextResponse.json(
        { success: false, message: 'Question does not belong to this test.' },
        { status: 403 }
      );
    }

    // Check whether an answer already exists.
    const { data: existingAnswer, error: existingError } =
      await supabaseAdmin
        .from('aptitude_answers')
        .select('id')
        .eq('attempt_id', attemptId)
        .eq('question_id', questionId)
        .maybeSingle();

    if (existingError) {
      console.error('Answer lookup error:', existingError);

      return NextResponse.json(
        { success: false, message: 'Unable to save your answer.' },
        { status: 500 }
      );
    }

    // Remove answer if the student deselects an option.
    if (selectedOption === null) {
      if (existingAnswer) {
        const { error: deleteError } = await supabaseAdmin
          .from('aptitude_answers')
          .delete()
          .eq('id', existingAnswer.id);

        if (deleteError) {
          console.error('Answer delete error:', deleteError);

          return NextResponse.json(
            { success: false, message: 'Unable to update your answer.' },
            { status: 500 }
          );
        }
      }
    } else if (existingAnswer) {
      // Update previously saved answer.
      const { error: updateError } = await supabaseAdmin
        .from('aptitude_answers')
        .update({
          selected_option: selectedOption,
          is_correct: null,
          answered_at: new Date().toISOString(),
        })
        .eq('id', existingAnswer.id);

      if (updateError) {
        console.error('Answer update error:', updateError);

        return NextResponse.json(
          { success: false, message: 'Unable to save your answer.' },
          { status: 500 }
        );
      }
    } else {
      // Insert a new answer.
      const { error: insertError } = await supabaseAdmin
        .from('aptitude_answers')
        .insert({
          attempt_id: attemptId,
          question_id: questionId,
          selected_option: selectedOption,
          is_correct: null,
        });

      if (insertError) {
        console.error('Answer insert error:', insertError);

        return NextResponse.json(
          { success: false, message: 'Unable to save your answer.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Answer saved successfully.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Save progress API error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong while saving your answer.',
      },
      { status: 500 }
    );
  }
}
