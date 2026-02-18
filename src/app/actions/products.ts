"use server";

import { getAdminClient } from "@/lib/supabase-admin";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function checkSession() {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    if (!session.isLoggedIn || !session.isAdmin) {
        throw new Error("Unauthorized");
    }
}

export async function getProducts() {
    await checkSession();
    const supabase = getAdminClient();
    const { data, error } = await supabase
        .from("products")
        .select("*, categories(id, name)")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function getCategories() {
    await checkSession();
    const supabase = getAdminClient();
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
}

export async function createProduct(prevState: any, formData: FormData) {
    try {
        await checkSession();
        const supabase = getAdminClient();

        const name = formData.get("name") as string;
        const price = parseFloat(formData.get("price") as string);
        const description = formData.get("description") as string;
        const categoryId = formData.get("categoryId") as string;

        // Tratamento de Dados: O formulário envia os tamanhos como string JSON, aqui convertemos de volta para Array.
        const sizesRaw = formData.get("sizes") as string;
        const sizes = sizesRaw ? JSON.parse(sizesRaw) : [];

        // Processamento de Imagens: Quebramos a string de URLs por linha para salvar no banco como array.
        const imageUrlsRaw = formData.get("imageUrls") as string;
        const image_urls = imageUrlsRaw
            ? imageUrlsRaw.split(/\r?\n/).map(url => url.trim()).filter(url => url !== "")
            : [];

        if (!name || isNaN(price) || !categoryId) {
            return { error: "Preencha todos os campos obrigatórios." };
        }

        const { error } = await supabase.from("products").insert({
            name,
            price,
            description,
            category_id: categoryId,
            image_urls: image_urls,
            sizes: sizes,
            discount_percent: formData.get("discountPercent") ? parseFloat(formData.get("discountPercent") as string) : 0,
        });

        if (error) return { error: `Erro Supabase: ${error.message} - ${error.details || ''}` };

        revalidatePath("/acesso-restrito-316");
        revalidatePath("/");
        return { success: true, error: null };
    } catch (e: any) {
        return { error: `Falha interna: ${e.message || 'Erro desconhecido'}` };
    }
}

export async function updateProduct(id: string, prevState: any, formData: FormData) {
    try {
        await checkSession();
        const supabase = getAdminClient();

        const name = formData.get("name") as string;
        const price = parseFloat(formData.get("price") as string);
        const description = formData.get("description") as string;
        const categoryId = formData.get("categoryId") as string;

        // Tratamento de Dados: O formulário envia os tamanhos como string JSON, aqui convertemos de volta para Array.
        const sizesRaw = formData.get("sizes") as string;
        const sizes = sizesRaw ? JSON.parse(sizesRaw) : [];

        // Processamento de Imagens: Quebramos a string de URLs por linha para salvar no banco como array.
        const imageUrlsRaw = formData.get("imageUrls") as string;
        const image_urls = imageUrlsRaw
            ? imageUrlsRaw.split(/\r?\n/).map(url => url.trim()).filter(url => url !== "")
            : [];

        const { error } = await supabase.from("products").update({
            name,
            price,
            description,
            category_id: categoryId,
            image_urls: image_urls,
            sizes: sizes,
            discount_percent: formData.get("discountPercent") ? parseFloat(formData.get("discountPercent") as string) : 0,
        }).eq("id", id);

        if (error) return { error: "Erro ao atualizar produto." };

        revalidatePath("/acesso-restrito-316");
        revalidatePath("/");
        return { success: true, error: null };
    } catch (e) {
        return { error: "Erro ao processar atualização." };
    }
}

export async function deleteProduct(id: string) {
    try {
        await checkSession();
        const supabase = getAdminClient();
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) return { error: "Erro ao deletar." };
        revalidatePath("/acesso-restrito-316");
        revalidatePath("/");
        return { success: true };
    } catch (e) {
        return { error: "Não autorizado." };
    }
}