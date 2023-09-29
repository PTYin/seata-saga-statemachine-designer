import inherits from 'inherits-browser';
import { domify } from 'min-dom';
import Diagram from 'diagram-js';

import AlignElementsModule from 'diagram-js/lib/features/align-elements';
import AutoScrollModule from 'diagram-js/lib/features/auto-scroll';
import BendpointsModule from 'diagram-js/lib/features/bendpoints';
import ConnectModule from 'diagram-js/lib/features/connect';
import ContextPadModule from 'diagram-js/lib/features/context-pad';
import ConnectPreviewModule from 'diagram-js/lib/features/connection-preview';
import CreateModule from 'diagram-js/lib/features/create';
import GridSnapping from 'diagram-js/lib/features/grid-snapping/GridSnapping';
import KeyboardMoveModule from 'diagram-js/lib/navigation/keyboard-move';
import KeyboardMoveSelectionModule from 'diagram-js/lib/features/keyboard-move-selection';
import LassoToolModule from 'diagram-js/lib/features/lasso-tool';
import ModelingModule from 'diagram-js/lib/features/modeling';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import MoveModule from 'diagram-js/lib/features/move';
import OutlineModule from 'diagram-js/lib/features/outline';
import PaletteModule from 'diagram-js/lib/features/palette';
import ResizeModule from 'diagram-js/lib/features/resize';
import RulesModule from 'diagram-js/lib/features/rules';
import SelectionModule from 'diagram-js/lib/features/selection';
import SnappingModule from 'diagram-js/lib/features/snapping';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';

import ProvidersModule from './providers';
import RenderModule from './render';
import LayoutModule from './features/layout';

import 'diagram-js/assets/diagram-js.css';
import './index.css';

const ElementStyleModule = {
  __init__: [
    ['defaultRenderer', function (defaultRenderer) {
      // override default styles
      defaultRenderer.SHAPE_STYLE = { fill: 'white', stroke: '#000', strokeWidth: 2 };
    }],
  ],
};
/**
 * Our editor constructor
 *
 * @param { { container: Element, additionalModules?: Array<any> } } options
 *
 * @return {Diagram}
 */
export default function Editor(options) {
  const {
    container,
  } = options;
  this.container = this.createContainer();
  this.init(container, options);
}

inherits(Editor, Diagram);

Editor.prototype.modules = [
  RenderModule,
  ProvidersModule,
  ElementStyleModule,
  LayoutModule,

  AlignElementsModule,
  AutoScrollModule,
  BendpointsModule,
  ConnectModule,
  ConnectPreviewModule,
  ContextPadModule,
  CreateModule,
  GridSnapping,
  KeyboardMoveModule,
  KeyboardMoveSelectionModule,
  LassoToolModule,
  ModelingModule,
  MoveCanvasModule,
  MoveModule,
  OutlineModule,
  PaletteModule,
  ResizeModule,
  RulesModule,
  SelectionModule,
  SnappingModule,
  ZoomScrollModule,
];

Editor.prototype.createContainer = function () {
  return domify(
    '<div class="statemachine-designer-container"></div>',
  );
};

Editor.prototype.emit = function (type, event) {
  return this.get('eventBus')
    .fire(type, event);
};

Editor.prototype.detach = function () {
  const { container } = this;
  const { parentNode } = container;

  if (!parentNode) {
    return;
  }

  this.emit('detach', {});

  parentNode.removeChild(container);
};

Editor.prototype.attachTo = function (parentNode) {
  if (!parentNode) {
    throw new Error('parentNode required');
  }

  // ensure we detach from the
  // previous, old parent
  this.detach();

  parentNode.appendChild(this.container);

  this.emit('attach', {});

  this.get('canvas')
    .resized();
};

Editor.prototype.init = function (container, options) {
  const {
    additionalModules,
    canvas,
    ...additionalOptions
  } = options;

  const baseModules = options.modules || this.modules;

  const modules = [
    ...baseModules,
    ...(additionalModules || []),
  ];

  const diagramOptions = {
    ...additionalOptions,
    canvas: {
      ...canvas,
      container,
    },
    modules,
  };

  // invoke diagram constructor
  Diagram.call(this, diagramOptions);

  if (options && options.container) {
    this.attachTo(options.container);
  }
};
