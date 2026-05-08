import { createServerClient_Instance } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = createServerClient_Instance();
    await supabase.auth.exchangeCodeForSession(code);

    // Fetch or create profile
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) {
        const username = user.email?.split('@')[0] + Math.random().toString(36).substr(2, 5);

        await supabase.from('profiles').insert({
          id: user.id,
          username,
          full_name: user.user_metadata?.full_name || '',
          avatar_url: user.user_metadata?.avatar_url,
          role: 'student',
        });
      }
    }
  }

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
