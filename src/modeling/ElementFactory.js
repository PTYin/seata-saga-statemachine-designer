import { assign } from 'min-dash';

import inherits from 'inherits-browser';

import BaseElementFactory from 'diagram-js/lib/core/ElementFactory';

/**
 * A drd-aware factory for diagram-js shapes
 */
export default function ElementFactory(sagaFactory) {
  BaseElementFactory.call(this);

  this.sagaFactory = sagaFactory;
}

inherits(ElementFactory, BaseElementFactory);

ElementFactory.$inject = ['sagaFactory'];

ElementFactory.prototype.baseCreate = BaseElementFactory.prototype.create;

ElementFactory.prototype.create = function (elementType, attrs) {
  const { sagaFactory } = this;

  attrs = attrs || {};

  let { businessObject } = attrs;

  if (!businessObject) {
    if (!attrs.type) {
      throw new Error('no shape type specified');
    }

    businessObject = sagaFactory.create(attrs.type);
  }

  const size = sagaFactory.getDefaultSize(businessObject);

  attrs = assign({
    businessObject,
    id: businessObject.id,
  }, size, attrs);

  return this.baseCreate(elementType, attrs);
};
