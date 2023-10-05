import Edge from './style/Edge';

export default class Transition extends Edge {
  exportJson() {
    const json = super.exportJson();
    json.type = this.type;
    return json;
  }
}

Transition.prototype.type = 'Transition';
