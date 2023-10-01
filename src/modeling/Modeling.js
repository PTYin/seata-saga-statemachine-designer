import inherits from 'inherits-browser';

import BaseModeling from 'diagram-js/lib/features/modeling/Modeling';
import UpdatePropertiesHandler from './cmd/UpdatePropertiesHandler';
import UpdateCompositePropertiesHandler from './cmd/UpdateCompositePropertiesHandler';

export default function Modeling(
  canvas,
  commandStack,
  rules,
  injector,
) {
  this.canvas = canvas;
  this.commandStack = commandStack;
  this.rules = rules;

  injector.invoke(BaseModeling, this);
}

inherits(Modeling, BaseModeling);

Modeling.$inject = [
  'canvas',
  'commandStack',
  'rules',
  'injector',
];

Modeling.prototype.connect = function (source, target, attrs, hints) {
  const { rules } = this;
  const rootElement = this.canvas.getRootElement();

  if (!attrs) {
    attrs = rules.canConnect(source, target);
  }

  return this.createConnection(source, target, attrs, rootElement, hints);
};

Modeling.prototype.getHandlers = function () {
  const handlers = BaseModeling.prototype.getHandlers.call(this);

  handlers['element.updateProperties'] = UpdatePropertiesHandler;
  handlers['element.updateCompositeProperties'] = UpdateCompositePropertiesHandler;

  return handlers;
};

Modeling.prototype.updateProperties = function (element, properties) {
  this.commandStack.execute('element.updateProperties', {
    element,
    properties,
  });
};

Modeling.prototype.updateCompositeProperties = function (
  element,
  compositeProperty,
  subProperties,
) {
  this.commandStack.execute('element.updateCompositeProperties', {
    element,
    compositeProperty,
    subProperties,
  });
};
