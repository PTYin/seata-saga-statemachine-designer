import { useContext } from '@bpmn-io/properties-panel/preact/hooks';
import PropertiesPanelContext from '../features/properties-panel/PropertiesPanelContext';

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
