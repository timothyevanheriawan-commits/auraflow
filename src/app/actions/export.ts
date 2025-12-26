"use server";

import { createClient } from "@/utils/supabase/server";

export async function getExportData() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
        date,
        description,
        amount,
        categories (name, type),
        accounts (name)
      `
      )
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (error) {
      console.error("Export Error:", error);
      return { error: error.message };
    }

    return { data };
  } catch (err) {
    console.error("Unexpected Error:", err);
    return { error: "Failed to fetch data" };
  }
}
