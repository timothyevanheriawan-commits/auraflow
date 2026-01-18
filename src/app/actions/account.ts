"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAccount(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const balanceStr = formData.get("balance") as string;
  const type = formData.get("type") as string;

  // Validasi Input
  if (!name || !type) {
    return { error: "Name and Type are required" };
  }

  // Handle balance (default 0 jika kosong)
  const balance = balanceStr ? parseInt(balanceStr) : 0;

  const { error } = await supabase.from("accounts").insert({
    user_id: user.id,
    name,
    balance,
    type,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/accounts");
  revalidatePath("/");

  // FIX: Pastikan return object sukses
  return { success: true };
}

export async function updateAccount(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const balance = parseInt(formData.get("balance") as string);
  const type = formData.get("type") as string;

  if (!id || !name || !type || isNaN(balance)) {
    return { error: "Invalid data provided" };
  }

  const { error } = await supabase
    .from("accounts")
    .update({ name, balance, type })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/accounts");
  revalidatePath("/");

  // FIX: Pastikan selalu me-return object
  return { success: true };
}

export async function deleteAccount(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string; // Ambil ID dari formData

  if (!id) return { error: "Invalid ID" };

  const { error } = await supabase.from("accounts").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/accounts");
  revalidatePath("/");
  return { success: true };
}
