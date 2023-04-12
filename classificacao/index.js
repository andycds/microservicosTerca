const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const palavraChave = "importante";
const funcoes = {
    ObservacaoCriada: (observacao) => {
        observacao.status = observacao.texto.includes(palavraChave) ? "importante" : "comum";
        axios.post('http://localhost:10000/eventos', {
            tipo: "ObservacaoClassificada",
            dados: observacao,
        });
        console.log("dentro da função");
    },
};

app.post("/eventos", (req, res) => {
    try {
        funcoes[req.body.tipo](req.body.dados);
    } catch (err) {
        console.log(`${err} + Evento do tipo ${req.body.tipo} não processado!!!`);
    }
    res.send({msg: "ok"});
});

app.listen(7000, () => console.log("Classificação. Porta 7000"));