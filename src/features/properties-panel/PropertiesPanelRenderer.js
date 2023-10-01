import {
  isUndo,
  isRedo,
} from 'diagram-js/lib/features/keyboard/KeyboardUtil';

import {
  render,
} from '@bpmn-io/properties-panel/preact';

import {
  domify,
  query as domQuery,
  event as domEvent,
} from 'min-dom';
import PropertiesPanel from './PropertiesPanel';

// helpers ///////////////////////

function isImplicitRoot(element) {
  // Backwards compatibility for diagram-js<7.4.0, see https://github.com/bpmn-io/bpmn-properties-panel/pull/102
  return element && (element.isImplicit || element.id === '__implicitroot');
}

/**
 * Setup keyboard bindings (undo, redo) on the given container.
 *
 * @param {Element} container
 * @param {EventBus} eventBus
 * @param {CommandStack} commandStack
 */
function setupKeyboard(container, eventBus, commandStack) {
  function cancel(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  function handleKeys(event) {
    if (isUndo(event)) {
      commandStack.undo();

      return cancel(event);
    }

    if (isRedo(event)) {
      commandStack.redo();

      return cancel(event);
    }

    return null;
  }

  eventBus.on('keyboard.bind', () => {
    domEvent.bind(container, 'keydown', handleKeys);
  });

  eventBus.on('keyboard.unbind', () => {
    domEvent.unbind(container, 'keydown', handleKeys);
  });
}

const DEFAULT_PRIORITY = 1000;

export default class PropertiesPanelRenderer {
  constructor(config, injector, eventBus) {
    const {
      parent,
      layout: layoutConfig,
      description: descriptionConfig,
    } = config || {};

    this.eventBus = eventBus;
    this.injector = injector;
    this.layoutConfig = layoutConfig;
    this.descriptionConfig = descriptionConfig;

    this.container = domify(
      '<div style="height: 100%" class="bio-properties-panel-container"></div>',
    );

    const commandStack = injector.get('commandStack', false);

    if (commandStack) {
      setupKeyboard(this.container, eventBus, commandStack);
    }
    eventBus.on('diagram.destroy', () => {
      this.detach();
    });

    eventBus.on('diagram.init', (event) => {
      const { element } = event;

      if (parent) {
        this.attachTo(parent);
      }
      this.render(element);
    });

    eventBus.on('detach', () => {
      this.detach();
    });
  }

  /**
   * Attach the properties panel to a parent node.
   *
   * @param {HTMLElement} container
   */
  attachTo(container) {
    if (!container) {
      throw new Error('container required');
    }

    // unwrap jQuery if provided
    if (container.get && container.constructor.prototype.jquery) {
      container = container.get(0);
    }

    if (typeof container === 'string') {
      container = domQuery(container);
    }

    // (1) detach from old parent
    this.detach();

    // (2) append to parent container
    container.appendChild(this.container);

    // (3) notify interested parties
    this.eventBus.fire('propertiesPanel.attach');
  }

  /**
   * Detach the properties panel from its parent node.
   */
  detach() {
    const { parentNode } = this.container;

    if (parentNode) {
      parentNode.removeChild(this.container);

      this.eventBus.fire('propertiesPanel.detach');
    }
  }

  /**
   * Register a new properties provider to the properties panel.
   *
   * @param {Number} [priority]
   * @param {PropertiesProvider} provider
   */
  registerProvider(priority, provider) {
    if (!provider) {
      provider = priority;
      priority = DEFAULT_PRIORITY;
    }

    if (typeof provider.getGroups !== 'function') {
      console.error(
        'Properties provider does not implement #getGroups(element) API',
      );

      return;
    }

    this.eventBus.on('propertiesPanel.getProviders', priority, (event) => {
      event.providers.push(provider);
    });

    this.eventBus.fire('propertiesPanel.providersChanged');
  }

  getProviders() {
    const event = this.eventBus.createEvent({
      type: 'propertiesPanel.getProviders',
      providers: [],
    });

    this.eventBus.fire(event);

    return event.providers;
  }

  render(element) {
    const canvas = this.injector.get('canvas');

    if (!element) {
      element = canvas.getRootElement();
    }

    if (isImplicitRoot(element)) {
      // TODO
    }

    console.log('hello, world', this.container);
    render(
      // eslint-disable-next-line react/react-in-jsx-scope
      <PropertiesPanel
        element={element}
        injector={this.injector}
        getProviders={this.getProviders.bind(this)}
        layoutConfig={this.layoutConfig}
        descriptionConfig={this.descriptionConfig}
      />,
      this.container,
    );

    this.eventBus.fire('propertiesPanel.rendered');
  }

  destroy() {
    if (this.container) {
      render(null, this.container);

      this.eventBus.fire('propertiesPanel.destroyed');
    }
  }
}

PropertiesPanelRenderer.$inject = ['config.propertiesPanel', 'injector', 'eventBus'];