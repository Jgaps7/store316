import { CartItem } from "@/types/store";

export class WhatsAppService {
    // Número oficial de atendimento da Store 316
    private static readonly PHONE_NUMBER = "5561984611083";

    /**
     * Gera o link do WhatsApp com a mensagem formatada do pedido.
     */
    static getCheckoutLink(items: CartItem[], total: number): string {
        // 1. Cabeçalho do Pedido
        const header = encodeURIComponent("🛒 *NOVO PEDIDO - STORE 316*\n\n");

        // 2. Lista de Itens Formatada
        const itemsList = items.map(item => {
            const itemTotal = (item.product.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
            return encodeURIComponent(
                `• *${item.product.name}*\n` +
                `  *Tamanho: ${item.selectedSize}*\n` +
                `  Qtd: ${item.quantity} | Subtotal: R$ ${itemTotal}\n\n`
            );
        }).join("");

        // 3. Rodapé com Total e Campos de Dados
        const footer = encodeURIComponent(
            `*TOTAL DO PEDIDO: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}*\n` +
            `----------------------------------\n` +
            `👤 *NOME:* \n` +
            `📍 *ENDEREÇO:* `
        );

        return `https://wa.me/${this.PHONE_NUMBER}?text=${header}${itemsList}${footer}`;
    }
}
