"use server";

import { supabase } from "@/lib/supabase";

/**
 * BUSCA TODOS OS PRODUTOS ATIVOS
 * Usado na Home para a vitrine principal.
 */
export async function getPublicProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching products:", error.message);
        return [];
    }
    return data;
}

/**
 * BUSCA PRODUTOS POR CATEGORIA (SLUG)
 * Faz o filtro automático para as páginas dinâmicas.
 */
export async function getProductsByCategory(categorySlug: string) {
    const { data, error } = await supabase
        .from("products")
        .select("*, categories!inner(name, slug)") // O !inner força o filtro na relação
        .eq("is_active", true)
        .eq("categories.slug", categorySlug)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Erro ao buscar produtos da categoria:", error.message);
        return [];
    }
    return data;
}