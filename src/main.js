const { httpServer } = require('./http'); 
const dotEnv = require('dotenv'); 

require('./websockets/sigmoid-con'); 

dotEnv.config();

const PORT = process.env.PORT || 3333; 

httpServer.listen(PORT, () => console.log(`Servidor Rodando na Porta ${PORT}`)); 

