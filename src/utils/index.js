import { useContext } from '@bpmn-io/properties-panel/preact/hooks';
import PropertiesPanelContext from '../features/properties-panel/PropertiesPanelContext';
import { forEach, reduce } from 'min-dash';

/**
 * Returns a random generated string for initial decision definition id.
 * @returns {string}
 */
export function randomString() {
  // noinspection SpellCheckingInspection
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  const maxPos = chars.length;
  let str = '';
  for (let i = 0; i < 7; i++) {
    str += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
}

export function useService(type, strict) {
  const { getService } = useContext(PropertiesPanelContext);

  return getService(type, strict);
}

export function getProperties(businessObject, propertyNames) {
  return reduce(propertyNames, (result, key) => {
    result[key] = businessObject[key];
    return result;
  }, {});
}

export function setProperties(businessObject, properties) {
  forEach(properties, (value, key) => {
    businessObject[key] = value;
  });
}
