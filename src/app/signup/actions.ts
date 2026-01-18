"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // 1. Validasi Password Match
  if (password !== confirmPassword) {
    return redirect("/signup?error=Passwords do not match");
  }

  // 2. Proses Sign Up ke Supabase
  const { error } = await supabase.auth.signUp({
    email,
    password,
    // Opsi ini agar user langsung login jika "Confirm Email" di Supabase dimatikan
    options: {
      emailRedirectTo: "http://localhost:3000",
    },
  });

  if (error) {
    return redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  // 3. Sukses
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}
