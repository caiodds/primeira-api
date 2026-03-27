const express = require('express')
const app = express()
app.use(express.json())
const PORT = process.env.PORT || 3000;
let produto = []
const cors = require('cors');
app.use(cors());



app.get('/',(req,res)=>{
    res.json(produto)
})

app.post('/produto',(req,res)=>{
    const novoproduto = {
        id:produto.length + 1,
        nome: req.body.nome,
        preco:req.body.preco
    }
    produto.push(novoproduto)
    res.status(200).json(novoproduto)
})

app.put('/produto/:id',(req,res)=>{
    const {id} = req.params
    const {nome,preco} = req.body

    const index = produto.findIndex(p => p.id == id)
    if(index !== -1){
        produto[index] = {...produto[index], nome, preco};
        return res.json({mensagem:"Produto Atualizado",produto:produto[index]});
    }
    return res.status(404).json({erro:"produto nao encontrado"});
});

app.delete('/produto/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const index = produto.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  const produtoDeletado = produtos.splice(index, 1)[0];

  res.status(200).json({
    mensagem: 'Produto deletado com sucesso',
    produto: produtoDeletado,
  });
});

app.listen(PORT,() =>{
    console.log('server rodando')
})