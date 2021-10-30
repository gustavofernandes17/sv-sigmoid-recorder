// faz as importações necessárias 
const express = require('express');
const cors = require('cors');

const { createServer } = require('http');
const { Server } = require('socket.io');


// importa as rotas http da API
const configurationRoutes = require('./routes/configuration');
const recordingRoutes = require('./routes/recording');
const { join } = require('path');

// inicia o estado do servidor de gravação

// cria um servidor http e um servidor websocket
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {cors: {origins: '*:*'}});

// configura o Cross-Origin-Resource-Sharing
app.use(cors());
app.use(express.json()); 

// configura as rotas http no servidor http
app.use(configurationRoutes); 
app.use(recordingRoutes);


app.get('/', (request, response) => {
  return response.status(200).send("tudo suave");
})


io.on('connection', (socket) => {
  console.log('se conectou: ', socket.id)
})

module.exports = { httpServer, io }