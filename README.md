# Journalctl

This is a module for accessing the all mighty Systemd Journal and its handy dandy key-value store hidden behind every log line. In the background it spawns a journalctl process with the output format ```json``` and parses the serialised object stream.

## API

Require the module and create a new instance:

```js
const Journalctl = require('journalctl');
const journalctl = new Journalctl([opts]);
```

The optional object ```opts``` can have the following properties:
 * ```identifier```: Just output logs of the given syslog identifier (cf. man journalctl, option '-t')
 * ```unit```: Just output logs originated from the given unit file (cf. man journalctl, option '-u')
 * ```filter```: An array of matches to filter by (cf. man journalctl, matches)

### Event: 'event'

```js
journalctl.on('event', (event) => {});
```

Is fired on every log event and hands over the object ```event``` describing the event. *(Oh boy ... so many events in one sentence ...)*

### Method: stop

```js
journalctl.stop([callback]);
```

Stops journalctl and calls the optional ```callback``` once everything has been killed.
