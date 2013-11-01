if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

/**
 * TVControl Plugin. This plugin is able to control TV via CEC commands
 *
 * @class TVControl
 * @constructor 
 */

define([ 'sys' ], function(sys) {

  var TVControl = function(app) {

    this.name = 'TV-Control';
    this.id = 'tvcontrol';
    this.collection = 'TvControl';
    this.icon = 'icon-off';

    this.app = app;
    this.pluginHelper = app.get('plugin helper');

    this.tvstatus = 'unknown';

    var that = this;

    // Ping interval
    setInterval(function() {
      that.ping();
    }, 10000);

    app.get('sockets').on('connection', function(socket) {
      // TV Control command
      socket.on('tvcontrol-cmd', function(data) {
        that.cmd(data);
      });
    });
  };

  /**
   * Ping TV hosts and send changes to sockets
   * 
   * @method ping
   */
  TVControl.prototype.ping = function() {
    var that = this;
    if (that.app.get('clients').length > 0) {
		var exec = require('child_process').exec;
		exec("echo pow 0 | cec-client -s | grep 'power status changed' | grep 'TV' | awk '{ print $NF }' | sed \"s/^\([\"']\)\(.*\)\1\$/\2/g\"", function(error, stdout, stderr){
			that.tvstatus = stdout;
			that.app.get('sockets').emit('tvcontrol-ping', {
	            id: 'tvcontrol',
	            alive: that.tvstatus
	        });
		});

      }
  };

  /**
   * Send TV command
   * 
   * @method wake
   * @param {Object} data The websocket data
   * @param {String} data.id The ID of the database entry
   */
  TVControl.prototype.cmd = function(data) {
    this.pluginHelper.findItem(this.collection, data.id, function(err, item, collection) {	
      	callback = function(error, stdout, stderr){
			console.log('output : ' + stdout);
			if (error !== null) {
				console.log('exec error: ' + error);
			}
		};
		TVControl.prototype.sendCommand(item.cmd,callback);
    });
  };

  /**
   * Send a cec command to TV.
   * Restarts the cec-client to let XBMC
   *
   * @method sendCommand
   * @param {String} commeand to be send
   */
  TVControl.prototype.sendCommand = function(cmd, callback) {
	exec(util.format("echo %s | cec-client -s",cmd), callback);
  }

  var exports = TVControl;

  return TVControl;

});
