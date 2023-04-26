const express = require('express');
const bodyParser = require('body-parser');
//para enviar eventos para os demais microsserviços
const axios = require('axios');
const app = express();
app.use(bodyParser.json());
const eventos = [];

app.post('/eventos', async (req, res) => {
    const evento = req.body;
    eventos.push(evento);
    try {
        //envia o evento para o microsserviço de lembretes
        await axios.post('http://localhost:4000/eventos', evento);
        //envia o evento para o microsserviço de observações
        await axios.post('http://localhost:5000/eventos', evento);
        //envia o evento para o microsserviço de consulta
        await axios.post('http://localhost:6000/eventos', evento);
        //envia o evento para o microsserviço de classificação
        await axios.post('http://localhost:7000/eventos', evento);
    } catch (error) {
        console.log("Algum serviço está morto.")
    }
    res.status(200).send({ msg: "ok" });
});

app.get('/eventos', (req, res) => {
    res.send(eventos);
})

app.listen(10000, () => {
    console.log('Barramento de eventos. Porta 10000.')
})