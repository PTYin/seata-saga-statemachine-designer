import {
  reduce,
  keys,
  forEach,
} from 'min-dash';

function getProperties(businessObject, propertyNames) {
  return reduce(propertyNames, (result, key) => {
    result[key] = businessObject[key];
    return result;
  }, {});
}

function setProperties(businessObject, properties) {
  forEach(properties, (value, key) => {
    businessObject[key] = value;
  });
}

export default function UpdatePropertiesHandler() {
}

/**
 * @param {Object} context
 * @param {djs.model.Base} context.element the element to update
 * @param {Object} context.properties a list of properties to set on the element's businessObject.
 *
 * @return {Array<djs.model.Base>} the updated element
 */
UpdatePropertiesHandler.prototype.execute = function (context) {
  const { element } = context;
  const changed = [element];

  if (!element) {
    throw new Error('element required');
  }

  const { businessObject } = element;
  const { properties } = context;
  const oldProperties = context.oldProperties || getProperties(businessObject, keys(properties));

  // update properties
  setProperties(businessObject, properties);

  // store old values
  context.oldProperties = oldProperties;
  context.changed = changed;

  // indicate changed on objects affected by the update
  return changed;
};

/**
 * @param  {Object} context
 *
 * @return {djs.model.Base} the updated element
 */
UpdatePropertiesHandler.prototype.revert = function (context) {
  const { element } = context;
  const { oldProperties } = context;
  const { businessObject } = element;

  // update properties
  setProperties(businessObject, oldProperties);
  return context.changed;
};
