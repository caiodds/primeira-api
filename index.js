const express = require('express')
const cors = require('cors');
const fs = require('fs');
const app = express()
const PORT = process.env.PORT || 3000;
const DB_FILE = 'produtos.json';

app.use(express.json())
app.use(cors());

function carregarProdutos() {
    if (!fs.existsSync(DB_FILE)) return [];
    const conteudo = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(conteudo || '[]');
}

function salvarProdutos(produtos) {
    fs.writeFileSync(DB_FILE, JSON.stringify(produtos, null, 2));
}

app.get('/', (req, res) => {
    let produtos = carregarProdutos();
    const { nome, precoMin, precoMax } = req.query;

    if (nome) {
        produtos = produtos.filter(p =>
            p.nome.toLowerCase().includes(nome.toLowerCase())
        );
    }
    if (precoMin !== undefined) {
        produtos = produtos.filter(p => p.preco >= parseFloat(precoMin));
    }
    if (precoMax !== undefined) {
        produtos = produtos.filter(p => p.preco <= parseFloat(precoMax));
    }

    res.json(produtos);
});

// POST /produto — criar produto
app.post('/produto', (req, res) => {
    const produtos = carregarProdutos();
    const novoProduto = {
        id: produtos.length > 0 ? produtos[produtos.length - 1].id + 1 : 1,
        nome: req.body.nome,
        preco: req.body.preco
    };
    produtos.push(novoProduto);
    salvarProdutos(produtos);
    res.status(201).json(novoProduto);
});

// PUT /produto/:id — atualizar produto
app.put('/produto/:id', (req, res) => {
    const produtos = carregarProdutos();
    const { nome, preco } = req.body;
    const index = produtos.findIndex(p => p.id == req.params.id);

    if (index === -1) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    produtos[index] = { ...produtos[index], nome, preco };
    salvarProdutos(produtos);
    res.json({ mensagem: 'Produto atualizado', produto: produtos[index] });
});

// DELETE /produto/:id — deletar produto
app.delete('/produto/:id', (req, res) => {
    const produtos = carregarProdutos();
    const index = produtos.findIndex(p => p.id === parseInt(req.params.id));

    if (index === -1) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    const produtoDeletado = produtos.splice(index, 1)[0];
    salvarProdutos(produtos);
    res.json({ mensagem: 'Produto deletado com sucesso', produto: produtoDeletado });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
});