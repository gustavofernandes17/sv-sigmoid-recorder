const { Router, request } = require('express'); 
const {RecordingController} = require('../controllers/RecordingController')
const {body, validationResult} = require('express-validator'); 
const { serverState } = require('../RecordingServerState');

const { join } = require('path');

// cria um 'Roteador'
const router = Router();

// cria um controlador de gravação
const recordingController = new RecordingController();

// cria uma rota para iniciar uma gravação
router.post('/start', recordingController.start);

// cria uma rota para parar uma gravação
router.post('/stop', recordingController.stop);

router.get('/download/:filename', 
(request, response) => {

  const { filename } = request.params; 

  const videoLoc = join(serverState.videosDirPath, filename);  
  console.log(videoLoc)
  return response.download(videoLoc);

})

module.exports = router; 