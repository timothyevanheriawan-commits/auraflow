"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**

Clean Utility: Extracts numeric value from formatted currency strings
*/
const parseAmount = (value: string): number => {
return parseInt(value.replace(/[^0-9]/g, "")) || 0;
};

/**

CREATE TRANSACTION

Handles transaction insertion and atomic balance updates
*/
export async function createTransaction(formData: FormData) {
const supabase = await createClient();

// 1. Authorization Check
const { data: { user } } = await supabase.auth.getUser();
if (!user) return { success: false, error: "Unauthorized access" };

// 2. Data Extraction
const amountInput = formData.get("amount") as string;
const description = (formData.get("description") as string) || "No description";
const date = formData.get("date") as string;
const categoryId = formData.get("categoryId") as string;
const accountId = formData.get("accountId") as string;

// 3. Validation
if (!amountInput || !date || !categoryId || !accountId) {
return { success: false, error: "Please complete all required fields." };
}

const amount = parseAmount(amountInput);
if (amount <= 0) return { success: false, error: "Amount must be greater than 0." };

try {
// 4. Resolve Category Metadata
const { data: category, error: catError } = await supabase
.from("categories")
.select("type")
.eq("id", categoryId)
.single();

if (catError || !category) throw new Error("Category resolution failed.");

// 5. Execute Transaction Insert
const { error: txError } = await supabase.from("transactions").insert({
  user_id: user.id,
  amount,
  description,
  date,
  category_id: categoryId,
  account_id: accountId,
});

if (txError) throw txError;

// 6. Atomic Balance Update
const { data: account } = await supabase
  .from("accounts")
  .select("balance")
  .eq("id", accountId)
  .single();

if (account) {
  const newBalance = category.type === "expense" 
    ? account.balance - amount 
    : account.balance + amount;

  await supabase
    .from("accounts")
    .update({ balance: newBalance })
    .eq("id", accountId);
}

// 7. Cache Invalidation
revalidatePath("/");
revalidatePath("/transactions");

return { success: true };


} catch (err: any) {
console.error("[ACTION_CREATE_TX_ERROR]", err.message);
return { success: false, error: err.message || "A server error occurred." };
}
}

/**

DELETE TRANSACTION

Reverses the balance impact before deleting the record
*/
export async function deleteTransaction(formData: FormData) {
const supabase = await createClient();
const id = formData.get("id") as string;

if (!id) return { success: false, error: "Transaction ID is required." };

try {
// 1. Fetch record for reversal logic
const { data: tx, error: fetchError } = await supabase
.from("transactions")
.select(amount, account_id, categories (type))
.eq("id", id)
.single();

if (fetchError || !tx) throw new Error("Transaction not found.");

// 2. Perform Deletion
const { error: deleteError } = await supabase
  .from("transactions")
  .delete()
  .eq("id", id);

if (deleteError) throw deleteError;

// 3. Reverse Balance Impact
if (tx.account_id) {
  const { data: account } = await supabase
    .from("accounts")
    .select("balance")
    .eq("id", tx.account_id)
    .single();

  if (account) {
    // Reverse logic: if it was an expense, add it back; if income, subtract it
    const newBalance = tx.categories?.type === "expense"
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


} catch (err: any) {
console.error("[ACTION_DELETE_TX_ERROR]", err.message);
return { success: false, error: err.message };
}
}

export async function duplicateTransaction(id: string) {
  const supabase = await createClient();

  // 1. Ambil data asli
  const { data: original, error } = await supabase
    .from("transactions")
    .select(`*, categories(type)`)
    .eq("id", id)
    .single();

  if (error || !original) return { error: "Transaction not found" };

  // 2. Insert data baru (Copy)
  const { error: insertError } = await supabase.from("transactions").insert({
    user_id: original.user_id,
    amount: original.amount,
    description: `${original.description} (Copy)`,
    date: new Date().toISOString(), // Pakai tanggal hari ini
    category_id: original.category_id,
    account_id: original.account_id,
  });

  if (insertError) return { error: insertError.message };

  // 3. Update Saldo Akun (Sama seperti Create)
  if (original.account_id) {
    const { data: account } = await supabase
      .from("accounts")
      .select("balance")
      .eq("id", original.account_id)
      .single();
    if (account) {
      // Cek tipe dari kategori original
      const type = original.categories?.type;
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

  // 1. Ambil Transaksi LAMA (untuk revert saldo)
  const { data: oldTx } = await supabase
    .from("transactions")
    .select(`*, categories(type)`)
    .eq("id", id)
    .single();

  if (!oldTx) return { error: "Transaction not found" };

  // 2. REVERT Saldo Lama (Kembalikan uangnya dulu)
  const { data: oldAccount } = await supabase
    .from("accounts")
    .select("balance")
    .eq("id", oldTx.account_id)
    .single();
  if (oldAccount) {
    const revertBalance =
      oldTx.categories?.type === "expense"
        ? oldAccount.balance + oldTx.amount // Balikin expense
        : oldAccount.balance - oldTx.amount; // Tarik income
    await supabase
      .from("accounts")
      .update({ balance: revertBalance })
      .eq("id", oldTx.account_id);
  }

  // 3. UPDATE Transaksi
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

  // 4. APPLY Saldo Baru (Hitung ulang dengan data baru)
  // Kita perlu ambil tipe kategori BARU (siapa tahu user ganti kategori dari Expense ke Income)
  const { data: newCategory } = await supabase
    .from("categories")
    .select("type")
    .eq("id", categoryId)
    .single();
  const { data: targetAccount } = await supabase
    .from("accounts")
    .select("balance")
    .eq("id", accountId)
    .single(); // Ambil akun target baru

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