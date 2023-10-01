import inherits from 'inherits-browser';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';

import { isFrameElement } from 'diagram-js/lib/util/Elements';

export default function SagaRules(injector) {
  injector.invoke(RuleProvider, this);
}

inherits(SagaRules, RuleProvider);

SagaRules.$inject = ['injector'];

function canConnect(source, target) {
  if (!source || !target) {
    return null;
  }

  if (target.parent !== source.parent || source === target) {
    return false;
  }
  return { type: 'Transition' };
}

SagaRules.prototype.canConnect = canConnect;

SagaRules.prototype.init = function () {
  this.addRule('shape.create', (context) => {
    const { target } = context;
    const { shape } = context;

    return target.parent === shape.target;
  });

  this.addRule('connection.create', (context) => {
    const { source } = context;
    const { target } = context;

    return canConnect(source, target);
  });

  this.addRule('connection.reconnect', (context) => {
    const { source } = context;
    const { target } = context;

    return canConnect(source, target);
  });

  this.addRule('shape.resize', (context) => {
    const { shape } = context;

    return isFrameElement(shape);
  });
};
