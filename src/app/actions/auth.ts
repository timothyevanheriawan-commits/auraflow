"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// Fitur Tambahan: Reset Semua Transaksi (Danger Zone)
export async function resetData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  // Hapus semua transaksi user ini
  await supabase.from("transactions").delete().eq("user_id", user.id);

  // Reset saldo semua akun jadi 0
  await supabase.from("accounts").update({ balance: 0 }).eq("user_id", user.id);

  revalidatePath("/dashboard");
  return { success: true };
}
