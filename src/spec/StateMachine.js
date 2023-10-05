import { randomString } from '../utils';
import BaseSpec from './BaseSpec';

export default class StateMachine extends BaseSpec {
  /**
   * @type {string}
   */
  name;

  /**
   * @type {string}
   */
  comment;

  /**
   * @type {string}
   */
  version;

  constructor() {
    super();
    this.name = `${this.type}-${randomString()}`;
  }

  importJson(json) {
    this.name = json.Name;
    this.comment = json.Comment;
    this.version = json.Version;
  }

  exportJson() {
    return {
      Name: this.name,
      Comment: this.comment,
      Version: this.version,
    };
  }
}

StateMachine.prototype.type = 'StateMachine';
