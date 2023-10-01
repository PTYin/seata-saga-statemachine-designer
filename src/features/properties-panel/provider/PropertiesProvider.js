import { Group, ListGroup } from '@bpmn-io/properties-panel';

import NameProps from './properties/NameProps';
import CommentProps from './properties/CommentProps';
import VersionProps from './properties/VersionProps';
import SagaFactory from '../../../modeling/SagaFactory';
import IoProps from './properties/task/IoProps';

function GeneralGroup(element) {
  const entries = [
    ...NameProps({ element }),
    ...CommentProps({ element }),
  ];

  if (SagaFactory.prototype.isStateMachine(element.type)) {
    entries.push(...VersionProps({ element }));
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

  return {
    id: 'task',
    label: 'Task',
    items,
    component: ListGroup,
  };
}

function getGroups(element) {
  const groups = [
    GeneralGroup(element),
  ];

  if (SagaFactory.prototype.isTask(element.type)) {
    groups.push(TaskGroup(element));
  }

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
