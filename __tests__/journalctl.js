const EventEmitter = require('events');

const Journalctl = require('../journalctl.js');

jest.mock('child_process');
const childProcess = require('child_process');

jest.mock('../json-stream.js');
const JSONStream = require('../json-stream.js');

test('start journalctl', () => {
	const j = new Journalctl();
	expect(childProcess.spawn.mock.calls.length).toBe(1);
	expect(childProcess.spawn.mock.calls[0]).toEqual([
		'journalctl',
		['-f', '-o', 'json']
	]);
	expect(j).toBeInstanceOf(EventEmitter);
});

test('decode incoming data', () => {
	const j = new Journalctl();
	const json = '{"TEST": "1"}';
	childProcess.__spawn.stdout.emit('data', Buffer.from(json));
	expect(JSONStream.prototype.decode.mock.calls.length).toBe(1);
	expect(JSONStream.prototype.decode.mock.calls[0][0]).toEqual(json);
	expect(j).toBeInstanceOf(EventEmitter);
});

test('emit events', () => {
	const j = new Journalctl();
	const json = { 'TEST': null };
	const cb = jest.fn();
	j.on('event', cb);
	JSONStream.mock.calls[0][0](json);
	expect(cb.mock.calls[0][0]).toBe(json);
});

test('kill journalctl', () => {
	const j = new Journalctl();
	const cb = jest.fn();
	j.stop(cb);
	expect(childProcess.__spawn.kill.mock.calls.length).toBe(1);
	childProcess.__spawn.emit('exit');
	expect(cb.mock.calls.length).toBe(1);
});
