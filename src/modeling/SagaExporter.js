import { assign } from 'min-dash';
import SagaFactory from './SagaFactory';

export default function SagaExporter(elementRegistry) {
  this.elementRegistry = elementRegistry;
}
SagaExporter.$inject = ['elementRegistry'];

SagaExporter.prototype.export = function () {
  const definitions = {
    States: {},
    Transitions: [],
  };

  const root = this.elementRegistry.find(({ type }) => type === 'StateMachine');
  assign(definitions, root.businessObject.exportJson());

  this.elementRegistry.forEach((element) => {
    const { businessObject } = element;
    if (SagaFactory.prototype.isStateMachine(element.type)) {
      assign(definitions, businessObject.exportJson());
    } else if (SagaFactory.prototype.isStartState(element.type)) {
      assign(definitions, { style: businessObject.style });
    } else {
      const elementJson = {};
      if (businessObject.exportJson) {
        assign(elementJson, businessObject.exportJson());
      }

      const { name } = businessObject;
      if (SagaFactory.prototype.isConnection(element.type)) {
        definitions.Transitions.push(elementJson);
      } else {
        definitions.States[name] = elementJson;
      }
    }
  });
  return definitions;
};
