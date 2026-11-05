
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, {
    message: 'Enter a valid 10-digit mobile number',
  }),
  email: z.union([
    z.literal(''),
    z.string().trim().email().max(255),
  ]).optional(),
  subject: z.string().trim().min(3).max(150),
  message: z.string().trim().max(3000).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please check your form details.',
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, mobile, email, subject, message } = validation.data;

    // Call database function for duplicate checking and insertion
    const { data, error } = await supabaseAdmin.rpc(
      'submit_contact_enquiry',
      {
        p_name: name,
        p_mobile: mobile,
        p_email: email || '',
        p_subject: subject,
        p_message: message || '',
      }
    );

    if (error) {
      console.error('Contact submission error:', error);

      return NextResponse.json(
        {
          success: false,
          message: 'Unable to submit your enquiry. Please try again.',
        },
        { status: 500 }
      );
    }

    // Duplicate enquiry found within 10 minutes
    if (!data) {
      return NextResponse.json(
        {
          success: false,
          duplicate: true,
          message: 'This enquiry was already submitted. Please try again after 10 minutes.',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your enquiry has been submitted successfully.',
        id: data,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Contact API error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong. Please try again.',
      },
      { status: 500 }
    );
  }
}
