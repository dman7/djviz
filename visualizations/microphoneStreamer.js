// Original adaptation of https://stackoverflow.com/questions/27846392/access-microphone-from-a-browser-javascript

window.audioContext = null;
window.gainNode = null;
window.microphoneStream = null;


document.addEventListener("DOMContentLoaded", function(){
  var newDiv = document.createElement("div");
  newDiv.style.textAlign = "center";

  newDiv.appendChild(document.createTextNode("Volume"));

  var volumeControl = document.createElement("input");
  volumeControl.setAttribute("id", "volume")
  volumeControl.setAttribute("type", "range")
  volumeControl.setAttribute("min", "0")
  volumeControl.setAttribute("max", "1")
  volumeControl.setAttribute("step", "0.1")
  volumeControl.setAttribute("value", "0.0")

  newDiv.appendChild(volumeControl)

  var recordBtn = document.createElement("button");
  recordBtn.appendChild(document.createTextNode("Start recording from mic"));
  newDiv.appendChild(recordBtn)

  document.body.prepend(newDiv)


  // --- enable volume control for output speakers
  document.getElementById('volume').addEventListener('change', function() {
    var curr_volume = this.value;
    window.gainNode.gain.value = curr_volume;
    console.log("curr_volume ", curr_volume);
  });

  document.querySelector('button').addEventListener('click', function() {
    window.audioContext = new AudioContext();
    console.log("Audio starting...");
    var BUFF_SIZE = 16384;

    var script_processor_node     = null,
      script_processor_fft_node = null,
      analyserNode              = null;

    if (!navigator.getUserMedia)
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (navigator.getUserMedia){
      navigator.getUserMedia({audio:true},
        function(stream) { startMic(stream); },
        function(e) { alert('Error capturing audio.'); }
      );
    } else { alert('getUserMedia not supported in this browser.'); }

    function process_microphone_buffer(event) { // invoked by event loop
      var i, N, inp, microphone_output_buffer;
      microphone_output_buffer = event.inputBuffer.getChannelData(0); // just mono - 1 channel for now
      // microphone_output_buffer  <-- this buffer contains current gulp of data size BUFF_SIZE
      console.log("microphone_output_buffer= ", microphone_output_buffer)
      // show_some_data(microphone_output_buffer, 5, "from getChannelData");
    }

    function startMic(stream){
      window.gainNode = window.audioContext.createGain();
      window.gainNode.connect( window.audioContext.destination );
      window.gainNode.gain.setValueAtTime(0, window.audioContext.currentTime);

      window.microphoneStream = window.audioContext.createMediaStreamSource(stream);
      window.microphoneStream.connect(window.gainNode);
      script_processor_node = window.audioContext.createScriptProcessor(BUFF_SIZE, 1, 1);
      script_processor_node.onaudioprocess = process_microphone_buffer;
      window.microphoneStream.connect(script_processor_node);


      // --- setup FFT
      script_processor_fft_node = window.audioContext.createScriptProcessor(2048, 1, 1);
      script_processor_fft_node.connect(window.gainNode);

      analyserNode = window.audioContext.createAnalyser();
      analyserNode.smoothingTimeConstant = 0;
      analyserNode.fftSize = 2048;

      window.microphoneStream.connect(analyserNode);

      analyserNode.connect(script_processor_fft_node);

      script_processor_fft_node.onaudioprocess = function() {
        // get the average for the first channel
        var array = new Uint8Array(analyserNode.frequencyBinCount);
        window.frequencyData = array;
        analyserNode.getByteFrequencyData(array);


        // draw the spectrogram
        if (window.microphoneStream.playbackState == window.microphoneStream.PLAYING_STATE) {
            // show_some_data(array, 5, "from fft");
        }
      };
    }



  });

});
