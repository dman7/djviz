// https://stackoverflow.com/questions/27846392/access-microphone-from-a-browser-javascript
// https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
// http://ianreah.com/2013/02/28/Real-time-analysis-of-streaming-audio-data-with-Web-Audio-API.html


window.frequencyData = [];
for (var i=0; i < 1024; i++) {
  window.frequencyData.push(Math.random());
}


document.addEventListener("DOMContentLoaded", function(){
  document.querySelector('button').addEventListener('click', function() {

    var webaudio_tooling_obj = function () {
      var audioContext = new AudioContext();
      console.log("audio is starting up ...");
      var BUFF_SIZE = 16384;

      var audioInput              = null,
        microphone_stream         = null,
        gain_node                 = null,
        script_processor_node     = null,
        script_processor_fft_node = null,
        analyserNode              = null;

      if (!navigator.getUserMedia)
              navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia || navigator.msGetUserMedia;

      if (navigator.getUserMedia){
        navigator.getUserMedia({audio:true},
          function(stream) {
              start_microphone(stream);
          },
          function(e) {
            alert('Error capturing audio.');
          }
        );
      } else { alert('getUserMedia not supported in this browser.'); }

      function show_some_data(given_typed_array, num_row_to_display, label) {
        var size_buffer = given_typed_array.length;
        var index = 0;
        var max_index = num_row_to_display;

        console.log("given_typed_array = ", given_typed_array.length)
        // for (; index < max_index && index < size_buffer; index += 1) {
        //     console.log(given_typed_array[index]);
        // }
      }

      function process_microphone_buffer(event) { // invoked by event loop
        var i, N, inp, microphone_output_buffer;
        microphone_output_buffer = event.inputBuffer.getChannelData(0); // just mono - 1 channel for now
        // microphone_output_buffer  <-- this buffer contains current gulp of data size BUFF_SIZE
        show_some_data(microphone_output_buffer, 5, "from getChannelData");
      }

      function start_microphone(stream){
        gain_node = audioContext.createGain();
        gain_node.connect( audioContext.destination );
        microphone_stream = audioContext.createMediaStreamSource(stream);
        microphone_stream.connect(gain_node);
        script_processor_node = audioContext.createScriptProcessor(BUFF_SIZE, 1, 1);
        script_processor_node.onaudioprocess = process_microphone_buffer;
        microphone_stream.connect(script_processor_node);

        // --- enable volume control for output speakers
        document.getElementById('volume').addEventListener('change', function() {
          var curr_volume = this.value;
          gain_node.gain.value = curr_volume;
          console.log("curr_volume ", curr_volume);
        });

        // --- setup FFT
        script_processor_fft_node = audioContext.createScriptProcessor(2048, 1, 1);
        script_processor_fft_node.connect(gain_node);

        analyserNode = audioContext.createAnalyser();
        analyserNode.smoothingTimeConstant = 0;
        analyserNode.fftSize = 2048;

        microphone_stream.connect(analyserNode);

        analyserNode.connect(script_processor_fft_node);

        script_processor_fft_node.onaudioprocess = function() {
          // get the average for the first channel
          var array = new Uint8Array(analyserNode.frequencyBinCount);
          window.frequencyData = array;
          analyserNode.getByteFrequencyData(array);


          // draw the spectrogram
          if (microphone_stream.playbackState == microphone_stream.PLAYING_STATE) {
              show_some_data(array, 5, "from fft");
          }

          // console.log("array = ", array)
        };
      }
    }(); //  webaudio_tooling_obj = function()
  });

});
