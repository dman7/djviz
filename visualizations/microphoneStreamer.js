// Original adaptation of https://stackoverflow.com/questions/27846392/access-microphone-from-a-browser-javascript

window.audioContext = null;
window.gainNode = null;
window.microphoneStream = null;


window.startRecording = function() {
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
}

window.getFrequencyAverage = function(freqRange) {
  if (freqRange == 'high') {
    var total = 0; for(var i=680; i<1020;i++){total += window.frequencyData[i]};
    return (total / 340) / 255;
  } else if (freqRange == 'med') {
    var total = 0; for(var i=340; i<680;i++){total += window.frequencyData[i]};
    return (total / 340) / 255;
  } else if (freqRange == 'low') {
    var total = 0; for(var i=0; i<340;i++){total += window.frequencyData[i]};
    return (total / 340) / 255;
  }
}

window.frequencyData = [];
for (var i=0; i < 1024; i++) {
  window.frequencyData.push(Math.random());
}

document.addEventListener("DOMContentLoaded", function(){
  var newDiv = document.createElement("div");
  newDiv.style.textAlign = "center";

  // NOTE: Only add this if you're comfortable with feedback gain.
  newDiv.appendChild(document.createTextNode("Volume"));
  var volumeControl = document.createElement("input");
  volumeControl.setAttribute("id", "volume")
  volumeControl.setAttribute("type", "range")
  volumeControl.setAttribute("min", "0")
  volumeControl.setAttribute("max", "1")
  volumeControl.setAttribute("step", "0.1")
  volumeControl.setAttribute("value", "0.0")
  newDiv.appendChild(volumeControl)

  // Start recording from mic
  var recordBtn = document.createElement("button");
  recordBtn.appendChild(document.createTextNode("Start recording from mic"));
  newDiv.appendChild(recordBtn)


  // Change shape
  for (var i=0; i < window.shapes.length; i++) {
    var shape = window.shapes[i];
    var inputOption = document.createElement("input");
    inputOption.setAttribute("name", "shape")
    inputOption.setAttribute("value", shape)
    inputOption.setAttribute("type", "radio")

    if (window.currentMaterialID == shape)
      inputOption.setAttribute("checked", true)
    newDiv.appendChild(inputOption)

    var labelOption = document.createElement("label");
    labelOption.appendChild(document.createTextNode(shape));
    newDiv.appendChild(labelOption);

    inputOption.addEventListener('change', (event) => {
      if (event.target.checked) {
        window.materials[window.currentMaterialID].dispose()
        window.scene.remove(window.materials[window.currentMaterialID])
        window.scene.remove(window.meshes[window.currentMaterialID])

        window.currentMaterialID = event.target.value;
        window.initMaterial(window.THREE, window.currentMaterialID);
      } else {
        alert('not checked');
      }
    })
  }


  // Should rotate
  var inputOption = document.createElement("input");
  inputOption.setAttribute("id", "shouldRotate")
  inputOption.setAttribute("checked", window.shouldRotate)
  inputOption.setAttribute("type", "checkbox")
  var labelOption = document.createElement("label");
  labelOption.appendChild(document.createTextNode("Should rotate?"));
  newDiv.appendChild(inputOption);
  newDiv.appendChild(labelOption);
  inputOption.addEventListener('change', (event) => {
    window.shouldRotate = event.target.checked;
  })



  // Append stuff!
  document.body.prepend(newDiv)


  // --- enable volume control for output speakers
  document.getElementById('volume').addEventListener('change', function() {
    var curr_volume = this.value;
    window.gainNode.gain.value = curr_volume;
    console.log("curr_volume ", curr_volume);
  });

  document.querySelector('button').addEventListener('click', function() {
    window.startRecording();
  });

  document.querySelector('button').addEventListener('touchstart', function() {
    window.alert("Touched!")
    window.startRecording();
  });

});
