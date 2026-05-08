import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { createServerClient_Instance } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient_Instance();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="bg-bg-base min-h-screen">
      <Sidebar />
      <BottomNav />
      <main className="lg:ml-64 pb-16 lg:pb-0">
        {children}
      </main>
    </div>
  );
}
