const { spawn } = require('child_process');
const { join } = require('path');
const fs = require('fs'); 


class RecordingServerState {
  ffmpegRecorderProcess = null; 
  ffmpegConverterProcess = null;
  streamingUrl;
  recordingStatus = 0; 
  videoFilename = ''; 
  videoPath = '';
  videosDirPath = '';
  
  constructor(_videosDirPath) {
    this.videosDirPath = _videosDirPath;
  }

  /**
   * Gera um nome para o arquivo de vídeo
   */
  generateFilename() {
    // gera o nome
    const filename = `video-${Date.now()}.flv`

    // salva o nome do arquivo sendo escrito no momento
    this.videoFilename = filename; 

    // salva o caminho completo para o arquivo
    this.videoPath = join(this.videosDirPath, this.videoFilename);

    // retorn um objeto com o caminho completo e simplesmente o nome
    return {filename, videoPath: this.videoPath};
  }

  /**
   * cria um novo processo de gravação através do ffmpeg
   * retorna Falso se o processo falhar por algum motivo
   */
  createNewFfmpegRecorderProcess() {

    // atualiza o estado da gravação
    this.recordingStatus = 1; 
    
    console.log('iniciando processo de gravação');
    console.log(this); 

    // impede de criar um novo processo caso ainda haja um processo rodando
    if (
      !this.streamingUrl || 
      this.ffmpegRecorderProcess !== null 
    ) return false;

    // gera o nome do arquivo
    const { videoPath } = this.generateFilename();
    
    console.log(videoPath)

    // inicia o processo de gravação
    this.ffmpegRecorderProcess = spawn(
      'ffmpeg', [
        '-i',
        this.streamingUrl,
        '-an',
        '-vcodec',
        'flv',
        this.videoPath
      ]
    );

    // ouve pelos eventos que o processo possa emitir

    this.ffmpegRecorderProcess.stdout.on('data', (data) => {
      console.log(`child stdout:\n${data}`);
    });
    
    this.ffmpegRecorderProcess.stderr.on('data', (data) => {
      console.error(`child stderr:\n${data}`);
    });
  
    this.ffmpegRecorderProcess.on('close', () => {

      console.log('terminando processo de gravação')
      
      // se livra do objeto que armazena o processo
      this.ffmpegRecorderProcess = null; 
      
      // cria um processo para converter o vídeo de flv -> mp4
      this.createNewFfmpegConverterProcess();

    });

    return true

  }
  /**
   * Inicia o processo de conversão de flv -> mp4 e
   * realiza a limpeza.
   * retorna false se algum erro ocorrer e true se tudo ocorrer como deve
   */
  createNewFfmpegConverterProcess() {


    console.log('iniciando processo de conversão flv -> mp4');
    // cria o processo de conversão
    this.ffmpegConverterProcess = spawn(
      'ffmpeg', 
      [
        '-i', 
        this.videoPath, 
        '-c:v', 
        'libx264', 
        '-crf', 
        '19', 
        '-strict', 
        'experimental', 
        join(this.videosDirPath,this.videoFilename.replace('.flv', '.mp4')),
      ]
    );

    this.ffmpegConverterProcess.stdout.on('data', (data) => {
      console.log(`child stdout:\n${data}`);
    });

    this.ffmpegConverterProcess.stderr.on('data', (data) => {
      console.error(`child stderr:\n${data}`);
    });

    // realiza a limpeza dos arquivos temporareos quando o processo acabar
    this.ffmpegConverterProcess.on('close', () => {
      console.log('iniciando processo de limpeza');
      fs.unlink(this.videoPath, (err) => {
      
        if (err) {
          console.log(err);
          return;
        }
        console.log('limpeza finalizada com sucesso...');
      });

      this.recordingStatus = 0;

      return true;
    })

    
    
  }

  /**
   * Reseta o estado como em um reboot (para toda vez que o servidor local for desligado)
   * esse servidor ser resetado e assim evitar problemas
   */
  resetState() {

    // para o processo de conversão se estiver acontecendo
    if (this.ffmpegRecorderProcess)
      process.kill(
        this.ffmpegRecorderProcess.pid, 
        'SIGINT'
      );
    
    // para o processo de gravação se estiver acontecendo
  
    // remove a referencia aos processos que foram desligados  
    this.ffmpegConverterProcess = null; 
    this.ffmpegRecorderProcess = null; 
    
    // retorna tudo para o valor padrão (antes de qualquer configuração)
    this.streamingUrl = null; 
    this.recordingStatus = 0; 
    this.videoPath = null; 
    this.videoFilename = null; 
    
  }

  /**
   * Configura o estado da para que possa entrar em operação
   * seta as urls alteradas
   */
  configStreamingUrl(streamingUrl) {

    this.streamingUrl = streamingUrl;

  }
}

const serverState = new RecordingServerState(join(__dirname, 'videos')); 


module.exports = {RecordingServerState, serverState};