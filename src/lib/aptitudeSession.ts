
import 'server-only';

import { cookies } from 'next/headers';
import { createHash } from 'crypto';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function getAptitudeStudent() {
  try {
    // Read the secure browser cookie.
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('aptitude_session')?.value;

    if (!accessToken) {
      return null;
    }

    // Hash the token before checking the database.
    const tokenHash = createHash('sha256')
      .update(accessToken)
      .digest('hex');

    // Find the student with a valid, unexpired session.
    const { data: student, error } = await supabaseAdmin
      .from('aptitude_students')
      .select('id, full_name, mobile, highest_qualification')
      .eq('access_token_hash', tokenHash)
      .gt('access_token_expires_at', new Date().toISOString())
      .maybeSingle();

    if (error) {
      console.error('Aptitude session verification error:', error);
      return null;
    }

    return student;
  } catch (error) {
    console.error('Aptitude session error:', error);
    return null;
  }
}
