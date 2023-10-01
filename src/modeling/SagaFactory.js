import { assign } from 'min-dash';
import { randomString } from '../utils';

export default function SagaFactory() {
}

const NODE_STYLE_TEMPLATE = {
  type: 'Node',
  bounds: {},
};

const EDGE_STYLE_TEMPLATE = {
  type: 'Edge',
  source: '',
  target: '',
  waypoints: [],
};

const TRANSITION_TEMPLATE = {
  Style: EDGE_STYLE_TEMPLATE,
};

const STATE_MACHINE_TEMPLATE = {
  Name: '',
  Type: 'StateMachine',
  Comment: '',
  Extensions: {},
};

const BASE_TEMPLATE = {
  Name: '',
  Type: '',
  Comment: '',
  Extensions: {},
  Style: NODE_STYLE_TEMPLATE,
};

const TASK_TEMPLATE = {
  ...BASE_TEMPLATE,
  Input: [],
  Output: [],
  Retry: {
    Exceptions: [],
    IntervalSeconds: null,
    MaxAttempts: null,
    BackoffRate: null,
  },
  // TODO
};

SagaFactory.prototype.create = function (type) {
  const businessObject = {};

  if (type === 'Transition') {
    assign(businessObject, TRANSITION_TEMPLATE);
    return businessObject;
  }

  if (this.isStateMachine(type)) {
    assign(businessObject, STATE_MACHINE_TEMPLATE);
  } else if (this.isTask(type)) {
    assign(businessObject, TASK_TEMPLATE);
  } else {
    assign(businessObject, BASE_TEMPLATE);
  }

  if (!businessObject.Type) {
    businessObject.Type = type;
  }

  if (!businessObject.Name) {
    businessObject.Name = `${type}-${randomString()}`;
  }

  return businessObject;
};

SagaFactory.prototype.isStateMachine = function (type) {
  return type === 'StateMachine';
};

SagaFactory.prototype.isTask = function (type) {
  return type === 'ServiceTask' || type === 'ScriptTask' || type === 'SubStateMachine'
    || type === 'Task';
};

const SERVICE_TASK_SIZE = { width: 180, height: 80 };

SagaFactory.prototype.getDefaultSize = function (semantic) {
  if (semantic.type === 'ServiceTask') {
    return SERVICE_TASK_SIZE;
  }

  return { width: 100, height: 80 };
};
