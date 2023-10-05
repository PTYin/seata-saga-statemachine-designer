import Transition from '../spec/Transition';
import StateMachine from '../spec/StateMachine';
import ServiceTask from '../spec/ServiceTask';
import StartState from '../spec/StartState';
import SucceedEnd from '../spec/SucceedEnd';
import FailEnd from '../spec/FailEnd';

export default function SagaFactory() {
  const typeToSpec = new Map();
  typeToSpec.set('Transition', Transition);
  typeToSpec.set('StartState', StartState);
  typeToSpec.set('StateMachine', StateMachine);
  typeToSpec.set('ServiceTask', ServiceTask);
  typeToSpec.set('Succeed', SucceedEnd);
  typeToSpec.set('Fail', FailEnd);
  this.typeToSpec = typeToSpec;
}

SagaFactory.prototype.create = function (type) {
  const Spec = this.typeToSpec.get(type);
  return new Spec();
};

SagaFactory.prototype.isStateMachine = function (type) {
  return type === 'StateMachine';
};

SagaFactory.prototype.isTask = function (type) {
  return type === 'ServiceTask' || type === 'ScriptTask' || type === 'SubStateMachine'
    || type === 'Task';
};

SagaFactory.prototype.isStartState = function (type) {
  return type === 'StartState';
};

SagaFactory.prototype.isConnection = function (type) {
  return type === 'Transition';
};

SagaFactory.prototype.getDefaultSize = function (semantic) {
  if (semantic.DEFAULT_SIZE) {
    return semantic.DEFAULT_SIZE;
  }

  return {
    width: 100,
    height: 80,
  };
};
