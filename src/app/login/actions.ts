"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login Error:", error.message); // <--- Cek terminal VS Code nanti
    // Kita redirect balik ke login dengan error (cara simpel dulu)
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("Mencoba Sign Up untuk:", email); // <--- Log ini

  const { error } = await supabase.auth.signUp({
    email,
    password,
    // Opsi ini memaksa tidak butuh email confirm (jika setting di dashboard sudah dimatikan)
    options: {
      emailRedirectTo: "http://localhost:3000",
    },
  });

  if (error) {
    console.error("Signup Error:", error.message); // <--- Cek terminal VS Code nanti
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  console.log("Signup Berhasil!");
  revalidatePath("/", "layout");
  redirect("/");
}
