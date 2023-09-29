import DiagramCommand from 'diagram-js/lib/command';
import DiagramChangeSupport from 'diagram-js/lib/features/change-support';
import DiagramRulesModule from 'diagram-js/lib/features/rules';
import DiagramSelection from 'diagram-js/lib/features/selection';

import ElementFactory from './ElementFactory';
import Modeling from './Modeling';
import SagaFactory from './SagaFactory';
import SagaRules from './SagaRules';

export default {
  __init__: [
    'modeling',
    'sagaFactory',
    'sagaRules',
  ],
  __depends__: [
    DiagramCommand,
    DiagramChangeSupport,
    DiagramRulesModule,
    DiagramSelection,
  ],
  elementFactory: ['type', ElementFactory],
  modeling: ['type', Modeling],
  sagaFactory: ['type', SagaFactory],
  sagaRules: ['type', SagaRules],
};
