
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { randomBytes, createHash } from 'crypto';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const registrationSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/),

  highestQualification: z.enum([
    '10th',
    '12th',
    'diploma',
    'graduate',
    'post_graduate',
    'other',
  ]),

  stream: z.enum([
    'arts',
    'commerce',
    'science',
    'it_computer_science',
    'engineering',
    'management',
    'other',
  ]),

  currentStatus: z.enum([
    'student',
    'fresher',
    'employee',
    'working_professional',
    'business_self_employed',
    'other',
  ]),

  careerInterest: z.string().trim().min(2).max(150),
  preferredBranch: z.string().trim().max(100).optional(),
  consentGiven: z.literal(true),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = registrationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please check your registration details.',
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const student = validation.data;

    // Generate a cryptographically secure session token.
    const accessToken = randomBytes(32).toString('hex');

    // Store only the SHA-256 hash in the database.
    const tokenHash = createHash('sha256')
      .update(accessToken)
      .digest('hex');

    // Session validity: 7 days.
    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    const { error } = await supabaseAdmin
      .from('aptitude_students')
      .insert({
        full_name: student.fullName,
        mobile: student.mobile,
        highest_qualification: student.highestQualification,
        stream: student.stream,
        current_status: student.currentStatus,
        career_interest: student.careerInterest,
        preferred_branch: student.preferredBranch || null,
        consent_given: student.consentGiven,
        access_token_hash: tokenHash,
        access_token_expires_at: expiresAt,
      });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          {
            success: false,
            duplicate: true,
            message:
              'You have already registered for the aptitude test using this mobile number.',
          },
          { status: 409 }
        );
      }

      console.error('Aptitude registration error:', error);

      return NextResponse.json(
        {
          success: false,
          message: 'Unable to complete registration. Please try again.',
        },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        message: 'Registration completed successfully.',
      },
      { status: 201 }
    );

    response.cookies.set('aptitude_session', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Aptitude registration API error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong. Please try again.',
      },
      { status: 500 }
    );
  }
}
