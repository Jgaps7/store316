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
 * BUSCA CATEGORIAS E OS 3 ÚLTIMOS PRODUTOS DE CADA
 * Usado na Home para exibir um grid agrupado por categoria + link Ver Mais
 */
export async function getPublicProductsGrouped() {
    // 1. Buscamos todas as categorias que possuem produtos ativos
    const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    if (catError) {
        console.error("Error fetching categories:", catError.message);
        return [];
    }

    // 2. Para cada categoria, buscamos os 3 produtos mais recentes habilitados
    const grouped = await Promise.all(
        categories.map(async (cat: any) => {
            const { data: products } = await supabase
                .from('products')
                .select('*, categories(name, slug)')
                .eq('category_id', cat.id)
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(3);

            return {
                category: cat,
                products: products || []
            };
        })
    );

    // 3. Retornamos apenas as categorias que tenham pelo menos 1 produto ativo
    return grouped.filter(g => g.products.length > 0);
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

/**
 * BUSCA UM PRODUTO PELO ID
 * Usado na página de detalhes do produto.
 */
export async function getProductById(id: string) {
    const { data, error } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Erro ao buscar produto:", error.message);
        return null;
    }
    return data;
}