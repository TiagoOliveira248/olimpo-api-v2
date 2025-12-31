const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// --- MIDDLEWARES ---
app.use(cors()); // Permite pedidos do teu site publicado
app.use(express.json()); // Consegue ler JSON enviado pelo site
app.use(express.urlencoded({ extended: true })); // Consegue ler formulários normais

// Configuração do Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// --- ROTAS ---

// 1. Rota Home (Apenas para teste)
app.get('/', (req, res) => {
    res.send('API Olimpo Lenhas v2 - Online e pronta para receber orçamentos.');
});

// 2. Rota que o teu site vai chamar (POST)
app.post('/api/orcamento', (req, res) => {
    const { servico, quantidade, cp } = req.body;

    // Lógica simples de cálculo (LAI - Lógica de Automação Inteligente)
    let precoBase = servico === 'lenha' ? 85.00 : 1.50; // Preço m3 ou m2
    let taxaEntrega = cp.startsWith('4') ? 15.00 : 40.00; // Norte vs Resto
    
    const subtotal = (precoBase * parseFloat(quantidade)) + taxaEntrega;
    const totalComComissao = subtotal * 1.15; // 15% para a Olimpo

    // Devolvemos um objeto JSON para o site conseguir ler o preço
    res.json({
        sucesso: true,
        precoFinal: totalComComissao.toFixed(2),
        moeda: "€",
        mensagem: `Orçamento calculado para a zona ${cp}`
    });
});

app.listen(port, () => {
    console.log(`Servidor Olimpo v2 em http://localhost:${port}`);
});