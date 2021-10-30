const {validationResult} = require('express-validator');


const { serverState } = require('../RecordingServerState');


class ConfigurationController {

  
  reset(request, response) {
    // reseta o estado do servidor
    serverState.resetState();

    // envia uma resposta de 200 OK
    return response
      .json({message: 'estado do servidor resetado'})
      .status(200)
  }

  config(request, response) { 

    // obtem os erros do middleware
    const errors = validationResult(request);

    // caso exista erros no corpo da requisição enviar resposta de ERRO 400 
    // para o cliente
    if (!errors.isEmpty()) 
      return response.json({errors: errors.array()}).status(400);

    // obtem url enviada através do corpo da requisição
    const { url } = request.body;
    console.log(url); 

    // configura a url do estado do servidor
    serverState.configStreamingUrl(url); 

    return response.json({message: 'url alterada com sucesso'}).status(200);

  } 

}

module.exports = { ConfigurationController };