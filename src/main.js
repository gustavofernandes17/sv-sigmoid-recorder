const { httpServer } = require('./http'); 
const dotEnv = require('dotenv'); 

require('./websockets/sigmoid-con'); 

dotEnv.config();

const PORT = process.env.PORT || 3333; 
const HOST = "0.0.0.0"; 

httpServer.listen(PORT, HOST, () => console.log(`Servidor Rodando na Porta ${PORT}`)); 

