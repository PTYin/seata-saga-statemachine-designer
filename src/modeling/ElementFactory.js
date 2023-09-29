import { assign, } from 'min-dash';

import inherits from 'inherits-browser';

import BaseElementFactory from 'diagram-js/lib/core/ElementFactory';

export const SERVICE_TASK_SIZE = { width: 180, height: 80 };

/**
 * A drd-aware factory for diagram-js shapes
 */
export default function ElementFactory(sagaFactory) {
  BaseElementFactory.call(this);

  this.sagaFactory = sagaFactory;
}

inherits(ElementFactory, BaseElementFactory);

ElementFactory.$inject = ['sagaFactory'];

ElementFactory.prototype.getDefaultSize = function (semantic) {
  if (semantic.type === 'ServiceTask') {
    return SERVICE_TASK_SIZE;
  }

  return { width: 100, height: 80 };
};

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

  const size = this.getDefaultSize(businessObject);

  attrs = assign({
    businessObject,
    id: businessObject.id,
  }, size, attrs);

  return this.baseCreate(elementType, attrs);
};
