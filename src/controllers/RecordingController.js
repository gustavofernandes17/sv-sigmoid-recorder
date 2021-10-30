const { serverState } = require('../RecordingServerState');
const { io } = require('../http'); 

class RecordingController {

  start(request, response) {
    // cria um novo processo de gravação
    const processWasStarted = serverState.createNewFfmpegRecorderProcess();

   

    console.log(processWasStarted); 
    // caso o processo não tenha sido iniciado com sucesso avisar o cliente disso 
    if (!processWasStarted) {
      return response.status(400).json({err: 'nenhuma URL de streaming foi configurada ainda'});
    }
    
    // envia uma resposta de sucesso (código 200) para o cliente
    return response.json({message: 'gravação iniciada com sucesso'}).status(200);
  }

  stop(request, response) {

    // io.emit('recording_status', {recordingStatus: serverState.recordingStatus});

    // caso não exista uma gravação em andamento ou caso não exista uma instancia
    // do processo de gravação, não termine envie um ERRO 400
    if (!serverState.ffmpegRecorderProcess || serverState.recordingStatus !== 1) {
      return response
        .json(
          {
            err: 'nenhum processo de gravação está em andamento'
          }
        )
        .status(400);
    }

    // termina o processo de gravação com a flag de interrupção 'CTRL + C'
    process.kill(serverState.ffmpegRecorderProcess.pid, 'SIGINT')

    // envia uma resposta de OK
    return response.json({message: 'gravação sendo finalizada'}).status(200);
  }
}

module.exports = {RecordingController}; 