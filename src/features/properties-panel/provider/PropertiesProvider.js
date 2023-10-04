import { Group, ListGroup } from '@bpmn-io/properties-panel';

import NameProps from './properties/NameProps';
import CommentProps from './properties/CommentProps';
import VersionProps from './properties/VersionProps';
import SagaFactory from '../../../modeling/SagaFactory';
import IoProps from './properties/task/IoProps';
import ServiceNameProps from './properties/task/service-task/ServiceNameProps';
import ServiceTypeProps from './properties/task/service-task/ServiceTypeProps';
import ServiceMethodProps from './properties/task/service-task/ServiceMethodProps';
import ErrorCodeProps from './properties/end/ErrorCodeProps';
import ErrorMessageProps from './properties/end/ErrorMessageProps';

function GeneralGroup(element) {
  const entries = [
    ...NameProps({ element }),
    ...CommentProps({ element }),
  ];

  if (SagaFactory.prototype.isStateMachine(element.type)) {
    entries.push(...VersionProps({ element }));
  }

  if (SagaFactory.prototype.isConnection(element.type)
    || SagaFactory.prototype.isStartState(element.type)) {
    return null;
  }

  return {
    id: 'general',
    label: 'General',
    entries,
    component: Group,
  };
}

function TaskGroup(element) {
  const items = [
    ...IoProps({ element }),
  ];

  if (!SagaFactory.prototype.isTask(element.type)) {
    return null;
  }

  return {
    id: 'task',
    label: 'Task',
    items,
    component: ListGroup,
  };
}

function ServiceTaskGroup(element) {
  const entries = [
    ...ServiceNameProps({ element }),
    ...ServiceMethodProps({ element }),
    ...ServiceTypeProps({ element }),
  ];

  if (element.type !== 'ServiceTask') {
    return null;
  }

  return {
    id: 'serviceTask',
    label: 'Service Task',
    entries,
    component: Group,
  };
}

function FailEndGroup(element) {
  const entries = [
    ...ErrorCodeProps({ element }),
    ...ErrorMessageProps({ element }),
  ];

  if (element.type !== 'Fail') {
    return null;
  }

  return {
    id: 'failEnd',
    label: 'Fail End',
    entries,
    component: Group,
  };
}

function getGroups(element) {
  const groups = [
    GeneralGroup(element),
    TaskGroup(element),
    ServiceTaskGroup(element),
    FailEndGroup(element),
  ];

  // contract: if a group returns null, it should not be displayed at all
  return groups.filter((group) => group !== null);
}

export default class PropertiesProvider {
  constructor(propertiesPanel) {
    propertiesPanel.registerProvider(this);
  }

  getGroups(element) {
    return (groups) => {
      return [
        ...groups,
        ...getGroups(element),
      ];
    };
  }
}

PropertiesProvider.$inject = ['propertiesPanel'];
