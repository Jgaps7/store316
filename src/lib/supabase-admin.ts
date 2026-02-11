import { createClient } from "@supabase/supabase-js";

// ATENÇÃO: Use este cliente EXCLUSIVAMENTE em Server Actions ou API Routes.
// Nunca use no frontend, pois ele tem poderes de 'Service Role' e pode ignorar as regras de segurança do banco.
export function getAdminClient() {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");
    }

    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}
