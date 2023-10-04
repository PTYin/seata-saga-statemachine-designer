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
import EditorActionsModule from 'diagram-js/lib/features/editor-actions';
import GridSnappingModule from 'diagram-js/lib/features/grid-snapping';
import KeyboardModule from 'diagram-js/lib/features/keyboard';
import KeyboardMoveModule from 'diagram-js/lib/navigation/keyboard-move';
import KeyboardMoveSelectionModule from 'diagram-js/lib/features/keyboard-move-selection';
import LassoToolModule from 'diagram-js/lib/features/lasso-tool';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import MoveModule from 'diagram-js/lib/features/move';
import OutlineModule from 'diagram-js/lib/features/outline';
import PaletteModule from 'diagram-js/lib/features/palette';
import ResizeModule from 'diagram-js/lib/features/resize';
import RulesModule from 'diagram-js/lib/features/rules';
import SelectionModule from 'diagram-js/lib/features/selection';
import SnappingModule from 'diagram-js/lib/features/snapping';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';

import GridModule from 'diagram-js-grid';

import Io from './features/io';
import Layout from './features/layout';
import PropertiesProvider from './features/properties-panel/provider';
import PropertiesPanel from './features/properties-panel';
import Modeling from './modeling';
import Providers from './providers';
import Render from './render';

import 'diagram-js/assets/diagram-js.css';
import '@bpmn-io/properties-panel/assets/properties-panel.css';
import 'bpmn-font/dist/css/bpmn.css';
import './index.css';
import { randomString } from './utils';

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
  Io,
  Layout,
  PropertiesPanel,
  PropertiesProvider,
  Modeling,
  Providers,
  Render,

  AlignElementsModule,
  AutoScrollModule,
  BendpointsModule,
  ConnectModule,
  ConnectPreviewModule,
  ContextPadModule,
  CreateModule,
  GridModule,
  GridSnappingModule,
  EditorActionsModule,
  KeyboardModule,
  KeyboardMoveModule,
  KeyboardMoveSelectionModule,
  LassoToolModule,
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

  // Initialize empty view
  this.get('sagaImporter').import({
    Name: `StateMachine-${randomString()}`,
    Comment: 'This state machine is modeled by designer tools.',
    Version: '0.0.1',
    style: {
      type: 'Node',
      bounds: {
        x: 200,
        y: 200,
        width: 36,
        height: 36,
      },
    },
  });

  if (options && options.container) {
    this.attachTo(options.container);
  }
};

Editor.prototype.export = function () {
  this.get('sagaExporter').export();
};
