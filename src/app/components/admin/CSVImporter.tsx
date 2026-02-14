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
        // Iniciamos o log com a mensagem de processamento
        setLog([{ type: 'info', message: "Sincronizando categorias e preparando dados..." }]);

        try {
            // 1. Busca os UUIDs reais das categorias
            const { data: categories } = await supabase.from('categories').select('id, name');
            const categoryMap = new Map();
            categories?.forEach(cat => categoryMap.set(cat.name.toLowerCase().trim(), cat.id));

            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: async (results) => {
                    const rows = results.data as any[];
                    const toInsert = [];
                    const errors = [];

                    for (const [index, row] of rows.entries()) {
                        const rawCat = (row.category_id || row.category || "").toLowerCase().trim();
                        const uuid = categoryMap.get(rawCat);

                        if (!uuid) {
                            errors.push(`Linha ${index + 2}: Categoria '${rawCat}' não encontrada.`);
                            continue;
                        }

                        toInsert.push({
                            name: row.name,
                            price: parseFloat(String(row.price || 0).replace(",", ".")) || 0,
                            category_id: uuid,
                            image_urls: row.images ? row.images.split(",").map((s: string) => s.trim()) : [],
                            sizes: row.sizes ? row.sizes.split(",").map((s: string) => s.trim()) : ["P", "M", "G"],
                            description: row.description || "",
                            discount_percent: parseFloat(row.discount_percent) || 0,
                            is_active: true
                        });
                    }

                    if (toInsert.length > 0) {
                        const { error: insertError } = await supabase.from("products").insert(toInsert);

                        if (insertError) {
                            // Em caso de erro, mostramos o erro mas paramos o loading
                            setLog([{ type: 'error', message: `Erro Supabase: ${insertError.message}` }]);
                        } else {
                            // SUCESSO: Aqui nós LIMPAMOS o log anterior e mostramos apenas a mensagem de sucesso
                            setLog([{ type: 'success', message: `MÁGICA FEITA! ${toInsert.length} itens importados com sucesso.` }]);
                            onImportSuccess();
                        }
                    }

                    if (errors.length > 0 && toInsert.length === 0) {
                        // Se nada foi inserido e houve erros de categoria
                        setLog(errors.map(err => ({ type: 'error' as const, message: err })));
                    } else if (errors.length > 0) {
                        // Se houve sucessos mas alguns erros parciais, adicionamos ao log
                        const errorLogs = errors.map(err => ({ type: 'error' as const, message: err }));
                        setLog(prev => [...errorLogs, ...prev]);
                    }

                    setIsImporting(false);
                }
            });
        } catch (err: any) {
            setLog([{ type: 'error', message: "Falha de conexão: " + err.message }]);
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
                        {isImporting ? "Injetando Dados no Banco..." : "Clique para subir o arquivo .csv"}
                    </p>
                </div>
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" disabled={isImporting} />
            </label>

            {log.length > 0 && (
                <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">Relatório de Processamento</span>
                        {!isImporting && (
                            <button onClick={() => setLog([])} className="text-[9px] text-zinc-700 hover:text-white transition uppercase font-bold">Limpar</button>
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