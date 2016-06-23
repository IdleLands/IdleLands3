
export class Logger {

  static _formatMessage(tag, message) {
    return `[${new Date()}] {${tag}} ${message}`;
  }

  static error(tag, error, payload) {
    console.error(this._formatMessage(tag, error.message));
    if(error.stack) {
      console.error(error.stack);
    }

    if(payload) {
      console.error('PAYLOAD', payload);
    }
  }

  static info(tag, message) {
    console.info(this._formatMessage(tag, message));
  }
}