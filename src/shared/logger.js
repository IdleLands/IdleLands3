
import rollbar from 'rollbar';

const rollbarToken = process.env.ROLLBAR_ACCESS_TOKEN;
const isQuiet = process.env.QUIET;

if(rollbarToken) {
  rollbar.init(rollbarToken);
}

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

    if(rollbarToken) {
      if(payload) {
        rollbar.handleErrorWithPayloadData(error, payload);
      } else {
        rollbar.handleError(error);
      }
    }
  }

  static info(tag, message) {
    if (isQuiet) return;
    console.info(this._formatMessage(tag, message));
  }
}

process.on('uncaughtException', err => {
  Logger.error('PROCESS:BAD', err);
});