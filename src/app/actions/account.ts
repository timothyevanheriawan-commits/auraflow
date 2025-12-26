// app/actions/account.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAccount(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const balance = parseFloat(formData.get("balance") as string) || 0;

  const { error } = await supabase.from("accounts").insert({
    user_id: user.id,
    name,
    type,
    balance,
  });

  if (error) throw error;

  revalidatePath("/accounts");
  revalidatePath("/");
}

export async function updateAccount(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const balance = parseFloat(formData.get("balance") as string) || 0;

  const { error } = await supabase
    .from("accounts")
    .update({ name, balance })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;

  revalidatePath("/accounts");
  revalidatePath("/");
}

export async function deleteAccount(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("accounts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;

  revalidatePath("/accounts");
  revalidatePath("/");
}

