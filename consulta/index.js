const express = require("express");
const app = express();
app.use(express.json());
const axios = require("axios");

baseConsulta = {};

const funcoes = {
    LembreteCriado: (lembrete) => {
        console.log("Lembrete criado na consulta");
        baseConsulta[lembrete.contador] = lembrete;
    },
    ObservacaoCriada: (observacao) => {
        console.log("Observacao criada na consulta");
        const observacoes = baseConsulta[observacao.lembreteId]["observacoes"] || [];
        observacoes.push(observacao);
        baseConsulta[observacao.lembreteId]["observacoes"] = observacoes;
    },
    ObservacaoAtualizada: (observacao) => {
        console.log("Vou alterar uma observacao");
        const observacoes = baseConsulta[observacao.lembreteId]["observacoes"];
        const indice = observacoes.findIndex((o) => o.id === observacao.id);
        observacoes[indice] = observacao;
    },
};

app.get("/lembretes", (req, res) => {
    res.status(200).send(baseConsulta);
});

app.post("/eventos", (req, res) => {
    console.log(`chegou evento ${req.body.tipo}`)
    try {
        funcoes[req.body.tipo](req.body.dados);
    } catch (err) {console.log(`${err}`)}
    res.status(200).send(baseConsulta);
});

app.listen(6000, async () => {
    console.log("Consultas. Porta 6000");
    const resp = await axios.get('http://localhost:10000/eventos');
    resp.data.forEach((valor, indice, colecao) => {
        try {
            funcoes[valor.tipo](valor.dados);
        } catch (err) {}
    });
});