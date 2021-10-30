const { io } = require('../http');
const { serverState } = require('../RecordingServerState');
const fs = require('fs');

io.on('connect', (socket) => {

  console.log('socket:' + socket.id); 

  const allVideoFiles = fs.readdirSync(serverState.videosDirPath); 

  socket.emit('initialize', {
    recordingStatus: serverState.recordingStatus,
    videoFiles: allVideoFiles
  })
  
  // socket.on('start_recording', () => {
  //   if (!serverState.streamingUrl || serverState.ffmpegRecorderProcess) {
  //     io.emit('recording_status', {
  //       recordingStatus: serverState.recordingStatus,
  //     })

  //     io.emit('error', 
  //     {
  //       message: 
  //       'já existe uma gravação em andamento ou o servidor ainda não foi configurado'
  //     });

  //     return;
  //   }

  //   const result = serverState.createNewFfmpegRecorderProcess(); 

  //   if (!result) {
  //     io.emit('error', {
  //       message: 'o servidor local provavelmente não foi configurado'
  //     })
  //   }


  //   io.emit('recording_status', {
  //     recordingStatus: serverState.recordingStatus,
  //   })
  // }); 

  // socket.on('stop_recording', () => {

  // })

})