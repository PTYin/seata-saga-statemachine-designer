import inherits from 'inherits-browser';

import BaseModeling from 'diagram-js/lib/features/modeling/Modeling';

export default function Modeling(
  canvas,
  rules,
  injector,
) {
  this.canvas = canvas;
  this.rules = rules;

  injector.invoke(BaseModeling, this);
}

inherits(Modeling, BaseModeling);

Modeling.$inject = [
  'canvas',
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
