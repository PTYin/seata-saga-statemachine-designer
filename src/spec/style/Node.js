import { assign } from 'min-dash';
import BaseSpec from '../BaseSpec';
import NodeStyle from './NodeStyle';

export default class Node extends BaseSpec {
  style = new NodeStyle();

  importJson(json) {
    assign(this.style.bounds, json.style.bounds);
  }

  exportJson() {
    return assign({}, { style: this.style });
  }
}
