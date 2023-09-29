import { assign, pick } from 'min-dash';
import randomString from '../utils';

export default function SagaFactory() {
}

SagaFactory.prototype.BASE_PROPERTIES = {
  Name: '',
  Comment: '',
  Extensions: {},
};

SagaFactory.prototype.TASK_PROPERTIES = {
  Input: [],
  Output: {},
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

  if (type === 'Connection') {
    return businessObject;
  }

  assign(businessObject, this.BASE_PROPERTIES);
  businessObject.name = `${type}-${randomString()}`;
  if (this.isTask(type)) {
    assign(businessObject, this.TASK_PROPERTIES);
  }

  return businessObject;
};

SagaFactory.prototype.isTask = function (type) {
  return type === 'ServiceTask' || type === 'ScriptTask' || type === 'SubStateMachine'
    || type === 'Task';
};
