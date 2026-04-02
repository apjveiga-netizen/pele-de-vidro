import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN 
});

const plans = [
    { title: "Pele de Vidro - Básico", price: 47, id: "basico" },
    { title: "Pele de Vidro - Pró", price: 97, id: "pro" },
    { title: "Pele de Vidro - Premium", price: 117, id: "premium" },
    { title: "Pele de Vidro - Pacote de Créditos (3)", price: 29, id: "creditos" },
    // Diamante Ecosystem
    { title: "Diamante: Skincare Personalizada", price: 47, id: "skincare" },
    { title: "Diamante: Corte e Estilo Capilar", price: 47, id: "cabelo" },
    { title: "Diamante: Alimentação Anti-Idade", price: 29, id: "dieta" },
    { title: "Diamante: Maquiagem Rejuvenescida", price: 29, id: "make" },
    { title: "Diamante: Sono e Recuperação", price: 37, id: "sono" }
];

async function generateLinks() {
    console.log("Gerando links de pagamento...");
    for (const plan of plans) {
        try {
            const preference = new Preference(client);
            const result = await preference.create({
                body: {
                    items: [
                        {
                            id: plan.id,
                            title: plan.title,
                            quantity: 1,
                            unit_price: plan.price,
                            currency_id: 'BRL'
                        }
                    ],
                    back_urls: {
                        success: 'https://paravoce.online/dashboard',
                        failure: 'https://paravoce.online/sales',
                        pending: 'https://paravoce.online/sales'
                    },
                    payment_methods: {
                        excluded_payment_types: [
                            { id: 'ticket' }
                        ],
                        installments: 12
                    },
                    auto_return: 'approved',
                }
            });
            console.log(`${plan.title}: ${result.init_point}`);
        } catch (error) {
            console.error(`Erro ao gerar link para ${plan.title}:`, error);
        }
    }
}

generateLinks();
