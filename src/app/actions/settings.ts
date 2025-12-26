"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updatePreferences(formData: FormData) {
  const supabase = await createClient();

  const currency = formData.get("currency") as string;
  const budgetLimit = parseInt(formData.get("budgetLimit") as string);
  const startDate = parseInt(formData.get("startDate") as string);

  const { error } = await supabase.auth.updateUser({
    data: {
      currency: currency || "IDR",
      budget_limit: budgetLimit || 0,
      start_date: startDate || 1,
    },
  });

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/settings");
  return { success: true };
}
