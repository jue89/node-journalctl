const childProcess = require('child_process');
const EventEmitter = require('events');
const util = require('util');
const JSONStream = require('./json-stream.js');

function Journalctl () {
	EventEmitter.call(this);

	// Start journalctl
	this.journalctl = childProcess.spawn('journalctl', ['-f', '-o', 'json']);

	// Setup decoder
	const decoder = new JSONStream((e) => {
		this.emit('event', e);
	});
	this.journalctl.stdout.on('data', (chunk) => {
		decoder.decode(chunk.toString());
	});
}

util.inherits(Journalctl, EventEmitter);

Journalctl.prototype.stop = function (cb) {
	// Kill the process
	if (cb) this.journalctl.on('exit', cb);
	this.journalctl.kill();
};

module.exports = Journalctl;
