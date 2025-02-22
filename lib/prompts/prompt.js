const readline = require('readline');
const { action } = require('./util');
const EventEmitter = require('events');
const { beep, cursor } = require('sisteransi');

/**
 * Base prompt skeleton
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */
module.exports = class Prompt extends EventEmitter {
  constructor(opts={}) {
    super();

    this.firstRender = true;
    this.in = opts.in || process.stdin;
    this.out = opts.out || process.stdout;

    const rl = readline.createInterface(this.in);
    readline.emitKeypressEvents(this.in, rl);

    if (this.in.isTTY) this.in.setRawMode(true);

    const keypress = (str, key) => {
      let a = action(key);
      if (a === false) {
        this._ && this._(str, key);
      } else if (typeof this[a] === 'function') {
        this[a](key);
      } else {
        this.bell();
      }
    };

    this.close = () => {
      this.out.write(cursor.show);
      this.in.removeListener('keypress', keypress);
      if (this.in.isTTY) this.in.setRawMode(false);
      rl.close();
      this.emit(this.aborted ? 'abort' : 'submit', this.value);
      this.closed = true;
    };

    this.in.on('keypress', keypress);
  }

  fire() {
    this.emit('state', {
      value: this.value,
      aborted: !!this.aborted
    });
  }

  bell() {
    this.out.write(beep);
  }

  render() {
    if (this.firstRender) this.firstRender = false;
  }
};
