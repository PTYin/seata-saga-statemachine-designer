import { assign } from 'min-dash';
import BaseSpec from '../BaseSpec';
import EdgeStyle from './EdgeStyle';
import SagaFactory from '../../SagaFactory';

export default class Edge extends BaseSpec {
  style = new EdgeStyle();

  exportJson() {
    const json = assign({ style: new EdgeStyle() }, { style: { waypoints: this.style.waypoints } });
    json.style.source = this.style.source.businessObject.name;
    if (SagaFactory.prototype.isStartState(this.style.source.type)) {
      json.style.source = 'StartState';
    }
    json.style.target = this.style.target.businessObject.name;
    return json;
  }
}
