const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000; // Alterado para aceitar a porta do Render

// --- MIDDLEWARES ---
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// --- PASSO IMPORTANTE: SERVIR FICHEIROS ESTÁTICOS ---
// Isto diz ao servidor para procurar o index.html, imagens e CSS na pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do Pug (podes manter se fores usar mais tarde)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// --- ROTAS ---

// 1. Rota Home - Agora ela vai enviar o teu ficheiro index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 2. Rota que o teu site vai chamar (POST)
app.post('/api/orcamento', (req, res) => {
    const { servico, quantidade, cp } = req.body;

    // Lógica simples de cálculo
    let precoBase = servico === 'lenha' ? 85.00 : 1.50; 
    let taxaEntrega = (cp && cp.startsWith('4')) ? 15.00 : 40.00; 
    
    const quant = parseFloat(quantidade) || 0;
    const subtotal = (precoBase * quant) + taxaEntrega;
    const totalComComissao = subtotal * 1.15; 

    res.json({
        sucesso: true,
        precoFinal: totalComComissao.toFixed(2),
        moeda: "€",
        mensagem: `Orçamento calculado para a zona ${cp}`
    });
});

app.listen(port, () => {
    console.log(`Servidor Olimpo v2 a correr na porta ${port}`);
});