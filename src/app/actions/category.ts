"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const color = (formData.get("color") as string) || "#64748B";

  // Auto-icon logic
  const icon = type === "income" ? "trending-up" : "shopping-bag";

  if (!name || !type) {
    return { error: "Name and Type are required" };
  }

  const { error } = await supabase.from("categories").insert({
    user_id: user.id,
    name,
    type,
    color,
    icon,
  });

  if (error) return { error: error.message };

  revalidatePath("/categories");
  return { success: true };
}

export async function updateCategory(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const color = formData.get("color") as string;

  if (!id || !name || !type) {
    return { error: "Missing required fields" };
  }

  const { error } = await supabase
    .from("categories")
    .update({ name, type, color })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/categories");
  return { success: true };
}

export async function deleteCategory(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  if (!id) return { error: "ID is missing" };

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/categories");
  return { success: true };
}
