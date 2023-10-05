import { assign } from 'min-dash';
import Edge from '../spec/style/Edge';
import StateMachine from '../spec/StateMachine';
import StartState from '../spec/StartState';
import State from '../spec/State';

export default function SagaExporter(elementRegistry) {
  this.elementRegistry = elementRegistry;
}
SagaExporter.$inject = ['elementRegistry'];

SagaExporter.prototype.parseRoot = function (definitions, root) {
  const { businessObject } = root;
  assign(definitions, businessObject.exportJson());
};

SagaExporter.prototype.parseState = function (definitions, node) {
  const { businessObject } = node;
  const elementJson = businessObject.exportJson();

  const { name } = businessObject;
  definitions.States[name] = elementJson;
};

SagaExporter.prototype.parseEdge = function (definitions, edge) {
  const { businessObject } = edge;
  const elementJson = businessObject.exportJson();
  const { source, target } = elementJson.style;
  if (!source) {
    if (definitions.StartState) {
      throw new Error(`Two or more start states, ${target} and ${definitions.StartState}`);
    } else {
      definitions.StartState = target;
      if (definitions.edge === undefined) {
        definitions.edge = {};
      }
      assign(definitions.edge, elementJson);
    }
  } else {
    const stateRef = definitions.States[source];
    stateRef.Next = target;

    if (stateRef.edge === undefined) {
      stateRef.edge = {};
    }
    assign(stateRef.edge, { [target]: elementJson });
  }
};

SagaExporter.prototype.export = function () {
  const definitions = {};

  const elements = this.elementRegistry.getAll();
  const root = elements.filter(({ businessObject }) => businessObject instanceof StateMachine)[0];
  const start = elements.filter(({ businessObject }) => businessObject instanceof StartState)[0];
  const states = elements.filter(({ businessObject }) => businessObject instanceof State);
  const edges = elements.filter(({ businessObject }) => businessObject instanceof Edge);

  this.parseRoot(definitions, root);
  this.parseRoot(definitions, start);
  assign(definitions, { States: {} });
  states.forEach((state) => this.parseState(definitions, state));
  edges.forEach((edge) => this.parseEdge(definitions, edge));

  return definitions;
};
