"use client";

import { useState } from "react";
import Papa from "papaparse";
import { supabase } from "@/lib/supabase";
import { Upload, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export function CSVImporter({ onImportSuccess }: { onImportSuccess: () => void }) {
    const [isImporting, setIsImporting] = useState(false);
    const [log, setLog] = useState<{ type: 'success' | 'error' | 'info', message: string }[]>([]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        // Iniciamos o log limpando o estado anterior
        setLog([{ type: 'info', message: "Sincronizando categorias e validando colunas..." }]);

        try {
            // 1. Busca os UUIDs das categorias para o "Tradutor"
            const { data: categories } = await supabase.from('categories').select('id, name');
            const categoryMap = new Map();
            categories?.forEach(cat => categoryMap.set(cat.name.toLowerCase().trim(), cat.id));

            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                // Transforma os cabeçalhos para minúsculo e remove espaços
                transformHeader: (h) => h.toLowerCase().trim().replace(/\s+/g, '_'),
                complete: async (results) => {
                    const rows = results.data as any[];
                    const toInsert = [];
                    const errors = [];

                    for (const [index, row] of rows.entries()) {
                        // Mapeamento flexível (aceita 'category', 'categoria' ou 'category_id')
                        const rawCat = (row.category || row.categoria || row.category_id || "").toLowerCase().trim();
                        const uuid = categoryMap.get(rawCat);

                        if (!uuid) {
                            errors.push(`Linha ${index + 2}: Categoria '${rawCat}' não encontrada.`);
                            continue;
                        }

                        // Sanitização e formatação
                        toInsert.push({
                            name: row.name || row.nome || row.produto,
                            price: parseFloat(String(row.price || row.preco || 0).replace(",", ".")) || 0,
                            category_id: uuid,
                            image_urls: (row.images || row.imagens || row.image_urls)
                                ? String(row.images || row.imagens || row.image_urls).split(",").map((s: string) => s.trim())
                                : [],
                            sizes: (row.sizes || row.tamanhos)
                                ? String(row.sizes || row.tamanhos).split(",").map((s: string) => s.trim())
                                : ["P", "M", "G"],
                            description: row.description || row.descricao || "",
                            discount_percent: parseFloat(row.discount_percent || row.desconto) || 0,
                            is_active: true
                        });
                    }

                    if (toInsert.length > 0) {
                        const { error: insertError } = await supabase.from("products").insert(toInsert);

                        if (insertError) {
                            setLog([{ type: 'error', message: `Erro Supabase: ${insertError.message}` }]);
                        } else {
                            // SUCESSO: Substituímos o log inteiro para remover o spinner de 'info'
                            setLog([{ type: 'success', message: `MÁGICA CONCLUÍDA! ${toInsert.length} produtos importados.` }]);
                            onImportSuccess();
                        }
                    }

                    // Se houveram erros de categoria, adicionamos ao log sem resetar o sucesso
                    if (errors.length > 0) {
                        const errorLogs = errors.map(err => ({ type: 'error' as const, message: err }));
                        setLog(prev => [...prev, ...errorLogs]);
                    }

                    setIsImporting(false);
                }
            });
        } catch (err: any) {
            setLog([{ type: 'error', message: "Falha crítica: " + err.message }]);
            setIsImporting(false);
        }
    };

    return (
        <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/5 shadow-2xl mb-10">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-[#D4AF37] text-sm font-black uppercase tracking-[0.3em]">Importação em Massa</h3>
                    <p className="text-[9px] text-zinc-500 mt-1 uppercase tracking-widest font-medium">Store 316 - Sistema de Inventário</p>
                </div>
                {isImporting && <Loader2 className="animate-spin text-[#D4AF37]" size={20} />}
            </div>

            <label className={`
                relative flex flex-col items-center justify-center w-full h-36 
                border-2 border-dashed rounded-xl transition-all cursor-pointer
                ${isImporting ? 'border-zinc-800 bg-zinc-900/20' : 'border-zinc-800 hover:border-[#D4AF37]/40 bg-black/40'}
            `}>
                <div className="flex flex-col items-center justify-center">
                    <Upload className={`w-8 h-8 mb-3 ${isImporting ? 'text-zinc-700' : 'text-zinc-500'}`} />
                    <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest text-center px-4">
                        {isImporting ? "Gravando no Banco de Dados..." : "Solte seu arquivo CSV aqui"}
                    </p>
                </div>
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" disabled={isImporting} />
            </label>

            {log.length > 0 && (
                <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">Relatório</span>
                        {!isImporting && (
                            <button onClick={() => setLog([])} className="text-[9px] text-zinc-700 hover:text-white transition uppercase font-bold">Limpar Logs</button>
                        )}
                    </div>
                    <div className="max-h-48 overflow-y-auto bg-black border border-white/5 rounded-lg p-4 space-y-2 custom-scrollbar">
                        {log.map((entry, idx) => (
                            <div key={idx} className="flex items-start gap-3 border-b border-white/5 pb-2 last:border-0">
                                {entry.type === 'error' ? (
                                    <AlertCircle size={12} className="text-red-600 mt-0.5" />
                                ) : entry.type === 'success' ? (
                                    <CheckCircle2 size={12} className="text-green-600 mt-0.5" />
                                ) : (
                                    <Loader2 size={12} className="text-[#D4AF37] animate-spin mt-0.5" />
                                )}
                                <p className={`text-[10px] font-mono leading-relaxed tracking-tight ${entry.type === 'error' ? 'text-red-400/90' :
                                        entry.type === 'success' ? 'text-green-400/90' : 'text-zinc-400'
                                    }`}>
                                    {entry.message}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}