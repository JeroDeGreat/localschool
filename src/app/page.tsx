import { createServerClient_Instance } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const supabase = createServerClient_Instance();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
