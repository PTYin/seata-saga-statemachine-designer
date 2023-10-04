import { assign } from 'min-dash';
import { randomString } from '../../utils';
import Node from './style/Node';

export default class State extends Node {
  /**
   * @type {string}
   */
  name;

  /**
   * @type {string}
   */
  comment;

  constructor() {
    super();
    this.name = `${this.type}-${randomString()}`;
  }

  importJson(json) {
    this.name = json.Name;
    this.comment = json.Comment;
  }

  exportJson() {
    const json = super.exportJson();
    return assign(json, {
      Name: this.name,
      Comment: this.comment,
    });
  }
}
