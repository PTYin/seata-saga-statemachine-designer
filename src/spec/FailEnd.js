import State from './State';

export default class FailEnd extends State {
  /**
   * @type {string}
   */
  errorCode;

  /**
   * @type {string}
   */
  message;

  importJson(json) {
    super.importJson(json);
    this.errorCode = json.ErrorCode;
    this.message = json.Message;
  }
}

FailEnd.prototype.type = 'Fail';

FailEnd.prototype.DEFAULT_SIZE = {
  width: 36,
  height: 36,
};
