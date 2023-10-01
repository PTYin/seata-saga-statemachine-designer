import { Group } from '@bpmn-io/properties-panel';

import NameProps from './properties/NameProps';

function GeneralGroup(element) {
  const entries = [
    ...NameProps({ element }),
  ];

  return {
    id: 'general',
    label: 'General',
    entries,
    component: Group,
  };
}

function getGroups(element) {
  const groups = [
    GeneralGroup(element),
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
