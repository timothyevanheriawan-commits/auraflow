"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const fullName = formData.get("fullName") as string;

  if (!fullName) {
    return { error: "Name cannot be empty" };
  }

  // Update metadata user di Supabase Auth
  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/settings"); // Update settings juga kalau ada nama disana
  return { success: true };
}
