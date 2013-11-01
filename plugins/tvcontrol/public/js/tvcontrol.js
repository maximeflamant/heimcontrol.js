require([ "jquery", "/socket.io/socket.io.js" ], function() {

  var socket = io.connect();

  /**
   * TV power status has been changed
   */
  socket.on('tvcontrol-ping', function(data) {
    $('.status[data-id="' + data.id + '"]').addClass('hide');
    if (data.alive) {
      $('.status.online[data-id="' + data.id + '"]').removeClass('hide');
      $('button[data-id="' + data.id + '"]').addClass('disabled');
    } else {
      $('.status.offline[data-id="' + data.id + '"]').removeClass('hide');
      $('button[data-id="' + data.id + '"]').removeClass('disabled');
    }
  });

});
