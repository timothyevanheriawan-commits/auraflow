"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// --- CREATE TRANSACTION ---
export async function createTransaction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Ambil data form
  const amountStr = formData.get("amount") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const categoryId = formData.get("categoryId") as string;
  const accountId = formData.get("accountId") as string;

  // Validasi Input Dasar
  if (!amountStr || !date || !categoryId || !accountId) {
    return {
      error: "Please fill in Amount, Date, Category, and Account fields.",
    };
  }

  const amount = parseInt(amountStr.replace(/[^0-9]/g, ""));
  if (isNaN(amount) || amount <= 0) {
    return { error: "Invalid amount." };
  }

  // Ambil info Kategori dari Database
  const { data: category, error: catError } = await supabase
    .from("categories")
    .select("type")
    .eq("id", categoryId)
    .single();

  if (catError || !category) {
    return { error: "Invalid Category selected." };
  }

  const type = category.type; // 'income' atau 'expense'

  // 1. Simpan Transaksi
  const { error: txError } = await supabase.from("transactions").insert({
    user_id: user.id,
    amount: amount,
    description,
    date,
    category_id: categoryId,
    account_id: accountId,
  });

  if (txError) {
    return { error: txError.message };
  }

  // 2. Update Saldo Akun
  const { data: account } = await supabase
    .from("accounts")
    .select("balance")
    .eq("id", accountId)
    .single();

  if (account) {
    const newBalance =
      type === "expense" ? account.balance - amount : account.balance + amount;

    await supabase
      .from("accounts")
      .update({ balance: newBalance })
      .eq("id", accountId);
  }

  revalidatePath("/");
  revalidatePath("/transactions");

  return { success: true };
}

// --- DELETE TRANSACTION ---
export async function deleteTransaction(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  // FIX: Menggunakan string kutip satu ('') di dalam select
  const { data: tx } = await supabase
    .from("transactions")
    .select("amount, account_id, categories (type)")
    .eq("id", id)
    .single();

  if (!tx) return { error: "Transaction not found" };

  // Hapus Transaksi
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) return { error: error.message };

  // Update Saldo Akun (Reversal)
  if (tx.account_id) {
    const { data: account } = await supabase
      .from("accounts")
      .select("balance")
      .eq("id", tx.account_id)
      .single();

    if (account) {
      // TypeScript mungkin bingung dengan tipe nested categories, kita cast manual jika perlu atau biarkan inferred
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const txType = (tx.categories as any)?.type;

      const newBalance =
        txType === "expense"
          ? account.balance + tx.amount
          : account.balance - tx.amount;

      await supabase
        .from("accounts")
        .update({ balance: newBalance })
        .eq("id", tx.account_id);
    }
  }

  revalidatePath("/");
  revalidatePath("/transactions");
  return { success: true };
}

// --- DUPLICATE TRANSACTION ---
export async function duplicateTransaction(id: string) {
  const supabase = await createClient();

  // FIX: Select string diperbaiki
  const { data: original, error } = await supabase
    .from("transactions")
    .select("*, categories(type)")
    .eq("id", id)
    .single();

  if (error || !original) return { error: "Transaction not found" };

  const { error: insertError } = await supabase.from("transactions").insert({
    user_id: original.user_id,
    amount: original.amount,
    description: `${original.description} (Copy)`,
    date: new Date().toISOString(),
    category_id: original.category_id,
    account_id: original.account_id,
  });

  if (insertError) return { error: insertError.message };

  if (original.account_id) {
    const { data: account } = await supabase
      .from("accounts")
      .select("balance")
      .eq("id", original.account_id)
      .single();
    if (account) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const type = (original.categories as any)?.type;
      const newBalance =
        type === "expense"
          ? account.balance - original.amount
          : account.balance + original.amount;

      await supabase
        .from("accounts")
        .update({ balance: newBalance })
        .eq("id", original.account_id);
    }
  }

  revalidatePath("/");
  revalidatePath("/transactions");
  return { success: true };
}

// --- UPDATE TRANSACTION (EDIT) ---
export async function updateTransaction(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const amount = parseInt(formData.get("amount") as string);
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const categoryId = formData.get("categoryId") as string;
  const accountId = formData.get("accountId") as string;

  // FIX: Select string diperbaiki
  const { data: oldTx } = await supabase
    .from("transactions")
    .select("*, categories(type)")
    .eq("id", id)
    .single();

  if (!oldTx) return { error: "Transaction not found" };

  // REVERT Saldo Lama
  if (oldTx.account_id) {
    const { data: oldAccount } = await supabase
      .from("accounts")
      .select("balance")
      .eq("id", oldTx.account_id)
      .single();
    if (oldAccount) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const oldType = (oldTx.categories as any)?.type;
      const revertBalance =
        oldType === "expense"
          ? oldAccount.balance + oldTx.amount
          : oldAccount.balance - oldTx.amount;
      await supabase
        .from("accounts")
        .update({ balance: revertBalance })
        .eq("id", oldTx.account_id);
    }
  }

  // UPDATE Transaksi
  const { error: updateError } = await supabase
    .from("transactions")
    .update({
      amount,
      description,
      date,
      category_id: categoryId,
      account_id: accountId,
    })
    .eq("id", id);

  if (updateError) return { error: updateError.message };

  // APPLY Saldo Baru
  const { data: newCategory } = await supabase
    .from("categories")
    .select("type")
    .eq("id", categoryId)
    .single();
  const { data: targetAccount } = await supabase
    .from("accounts")
    .select("balance")
    .eq("id", accountId)
    .single();

  if (targetAccount && newCategory) {
    const finalBalance =
      newCategory.type === "expense"
        ? targetAccount.balance - amount
        : targetAccount.balance + amount;

    await supabase
      .from("accounts")
      .update({ balance: finalBalance })
      .eq("id", accountId);
  }

  revalidatePath("/");
  revalidatePath("/transactions");
  return { success: true };
}
