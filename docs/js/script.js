var blockTypes = {
  signed: {
    id: 'signed',
    title: 'NFe Assinada',
    message: 'Uma nova NFe foi assinada',
  }
}
const getBlocks = function() {
  var socket = new WebSocket('ws://localhost:3001');

  console.log('Connecting to WebSocket host...');

  socket.onopen = function() {
    $('#status').html('Connected');
  };

  socket.onclose = function() {
    $('#status').html('Disconnected');
  };

  socket.onmessage = function(message) {
    // console.log(message.data);
    const event = JSON.parse(message.data);
    console.log(event);
    if(event.topic == 'NFeSigned') {
      $('#result').html('NFe Assinada');
      $('#qrcode').attr('src', 'img/checkmark.gif');
      $('#qrcode').show().delay(2000).fadeOut();
    }
  };

}
