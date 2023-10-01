import { keys } from 'min-dash';
import { getProperties, setProperties } from '../../utils';

export default function UpdateCompositePropertiesHandler() {
}

/**
 * @param {Object} context
 * @param {djs.model.Base} context.element the element to update
 * @param {Object} context.properties a list of properties to set on the element's businessObject.
 *
 * @return {Array<djs.model.Base>} the updated element
 */
UpdateCompositePropertiesHandler.prototype.execute = function (context) {
  // debugger
  const { element, compositeProperty, subProperties } = context;
  const changed = [element];

  if (!compositeProperty) {
    throw new Error('composite property required');
  }

  const oldSubProperties = context.oldSubProperties
    || getProperties(compositeProperty, keys(subProperties));

  // update properties
  setProperties(compositeProperty, subProperties);

  // store old values
  context.oldSubProperties = oldSubProperties;
  context.changed = changed;

  // indicate changed on objects affected by the update
  return changed;
};

/**
 * @param  {Object} context
 *
 * @return {djs.model.Base} the updated element
 */
UpdateCompositePropertiesHandler.prototype.revert = function (context) {
  const { compositeProperty, oldSubProperties } = context;

  // update properties
  setProperties(compositeProperty, oldSubProperties);
  return context.changed;
};
