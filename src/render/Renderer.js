import inherits from 'inherits-browser';

import {
  isObject,
  assign,
} from 'min-dash';

import {
  attr as domAttr,
  query as domQuery,
} from 'min-dom';

import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
} from 'tiny-svg';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  createLine,
} from 'diagram-js/lib/util/RenderUtil';

const black = 'hsl(225, 10%, 15%)';

// helper functions //////////////////////

function getSemantic(element) {
  return element.businessObject;
}

function colorEscape(str) {
  // only allow characters and numbers
  return str.replace(/[^0-9a-zA-z]+/g, '_');
}

function getStrokeColor(element, defaultColor) {
  return defaultColor;
}

function getFillColor(element, defaultColor) {
  return defaultColor;
}

function getLabelColor(element, defaultColor, defaultStrokeColor) {
  return defaultColor || getStrokeColor(element, defaultStrokeColor);
}

export default function Renderer(config, eventBus, pathMap, styles, textRenderer, canvas) {
  BaseRenderer.call(this, eventBus);

  const { computeStyle } = styles;

  const markers = {};

  const defaultFillColor = (config && config.defaultFillColor) || 'white';
  const defaultStrokeColor = (config && config.defaultStrokeColor) || black;
  const defaultLabelColor = (config && config.defaultLabelColor);

  function addMarker(id, options) {
    const attrs = assign({
      strokeWidth: 1,
      strokeLinecap: 'round',
      strokeDasharray: 'none',
    }, options.attrs);

    const ref = options.ref || { x: 0, y: 0 };

    const scale = options.scale || 1;

    // fix for safari / chrome / firefox bug not correctly
    // resetting stroke dash array
    if (attrs.strokeDasharray === 'none') {
      attrs.strokeDasharray = [10000, 1];
    }

    const markerElement = svgCreate('marker');

    svgAttr(options.element, attrs);

    svgAppend(markerElement, options.element);

    svgAttr(markerElement, {
      id,
      viewBox: '0 0 20 20',
      refX: ref.x,
      refY: ref.y,
      markerWidth: 20 * scale,
      markerHeight: 20 * scale,
      orient: 'auto',
    });

    // eslint-disable-next-line no-underscore-dangle
    let defs = domQuery('defs', canvas._svg);

    if (!defs) {
      defs = svgCreate('defs');

      // eslint-disable-next-line no-underscore-dangle
      svgAppend(canvas._svg, defs);
    }

    svgAppend(defs, markerElement);

    markers[id] = markerElement;
  }

  function createMarker(id, type, fill, stroke) {
    if (type === 'association-start') {
      const associationStart = svgCreate('path');
      svgAttr(associationStart, { d: 'M 11 5 L 1 10 L 11 15' });

      addMarker(id, {
        element: associationStart,
        attrs: {
          fill: 'none',
          stroke,
          strokeWidth: 1.5,
        },
        ref: { x: 1, y: 10 },
        scale: 0.5,
      });
    } else if (type === 'association-end') {
      const associationEnd = svgCreate('path');
      svgAttr(associationEnd, { d: 'M 1 5 L 11 10 L 1 15' });

      addMarker(id, {
        element: associationEnd,
        attrs: {
          fill: 'none',
          stroke,
          strokeWidth: 1.5,
        },
        ref: { x: 12, y: 10 },
        scale: 0.5,
      });
    } else if (type === 'information-requirement-end') {
      const informationRequirementEnd = svgCreate('path');
      svgAttr(informationRequirementEnd, { d: 'M 1 5 L 11 10 L 1 15 Z' });

      addMarker(id, {
        element: informationRequirementEnd,
        attrs: {
          fill: stroke,
          stroke: 'none',
        },
        ref: { x: 11, y: 10 },
        scale: 1,
      });
    } else if (type === 'knowledge-requirement-end') {
      const knowledgeRequirementEnd = svgCreate('path');
      svgAttr(knowledgeRequirementEnd, { d: 'M 1 3 L 11 10 L 1 17' });

      addMarker(id, {
        element: knowledgeRequirementEnd,
        attrs: {
          fill: 'none',
          stroke,
          strokeWidth: 2,
        },
        ref: { x: 11, y: 10 },
        scale: 0.8,
      });
    } else if (type === 'authority-requirement-end') {
      const authorityRequirementEnd = svgCreate('circle');
      svgAttr(authorityRequirementEnd, { cx: 3, cy: 3, r: 3 });

      addMarker(id, {
        element: authorityRequirementEnd,
        attrs: {
          fill: stroke,
          stroke: 'none',
        },
        ref: { x: 3, y: 3 },
        scale: 0.9,
      });
    }
  }

  function marker(type, fill, stroke) {
    const id = `${type}-${colorEscape(fill)
    }-${colorEscape(stroke)}`;

    if (!markers[id]) {
      createMarker(id, type, fill, stroke);
    }

    return `url(#${id})`;
  }

  function drawRect(p, width, height, r, offset, attrs) {
    if (isObject(offset)) {
      attrs = offset;
      offset = 0;
    }

    offset = offset || 0;

    attrs = computeStyle(attrs, {
      stroke: black,
      strokeWidth: 2,
      fill: 'white',
    });

    const rect = svgCreate('rect');
    svgAttr(rect, {
      x: offset,
      y: offset,
      width: width - offset * 2,
      height: height - offset * 2,
      rx: r,
      ry: r,
    });
    svgAttr(rect, attrs);

    svgAppend(p, rect);

    return rect;
  }

  function renderLabel(p, label, options) {
    const text = textRenderer.createText(label || '', options);

    domAttr(text, 'class', 'djs-label');

    svgAppend(p, text);

    return text;
  }

  function renderEmbeddedLabel(p, element, align, options) {
    const name = 'TODO';

    options = assign({
      box: element,
      align,
      padding: 5,
      style: {
        fill: getLabelColor(element, defaultLabelColor, defaultStrokeColor),
      },
    }, options);

    return renderLabel(p, name, options);
  }

  function drawPath(p, d, attrs) {
    attrs = computeStyle(attrs, ['no-fill'], {
      strokeWidth: 2,
      stroke: black,
    });

    const path = svgCreate('path');
    svgAttr(path, { d });
    svgAttr(path, attrs);

    svgAppend(p, path);

    return path;
  }

  function drawLine(p, waypoints, attrs) {
    attrs = computeStyle(attrs, ['no-fill'], {
      stroke: black,
      strokeWidth: 2,
      fill: 'none',
    });

    const line = createLine(waypoints, attrs);

    svgAppend(p, line);

    return line;
  }
  const handlers = {
    line(p, element) {
      const fill = getFillColor(element, defaultFillColor);
      const stroke = getStrokeColor(element, defaultStrokeColor);
      const attrs = {
        stroke,
        strokeWidth: 1,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        markerEnd: marker('information-requirement-end', fill, stroke),
      };

      return drawLine(p, element.waypoints, attrs);
    },
    'dmn:Decision': function (p, element) {
      const rect = drawRect(p, element.width, element.height, 0, {
        stroke: getStrokeColor(element, defaultStrokeColor),
        fill: getFillColor(element, defaultFillColor),
      });

      renderEmbeddedLabel(p, element, 'center-middle');

      return rect;
    },
    'dmn:KnowledgeSource': function (p, element) {
      const pathData = pathMap.getScaledPath('KNOWLEDGE_SOURCE', {
        xScaleFactor: 1.021,
        yScaleFactor: 1,
        containerWidth: element.width,
        containerHeight: element.height,
        position: {
          mx: 0.0,
          my: 0.075,
        },
      });

      const knowledgeSource = drawPath(p, pathData, {
        strokeWidth: 2,
        fill: getFillColor(element, defaultFillColor),
        stroke: getStrokeColor(element, defaultStrokeColor),
      });

      renderEmbeddedLabel(p, element, 'center-middle');

      return knowledgeSource;
    },
    'dmn:BusinessKnowledgeModel': function (p, element) {
      const pathData = pathMap.getScaledPath('BUSINESS_KNOWLEDGE_MODEL', {
        xScaleFactor: 1,
        yScaleFactor: 1,
        containerWidth: element.width,
        containerHeight: element.height,
        position: {
          mx: 0.0,
          my: 0.3,
        },
      });

      const businessKnowledge = drawPath(p, pathData, {
        strokeWidth: 2,
        fill: getFillColor(element, defaultFillColor),
        stroke: getStrokeColor(element, defaultStrokeColor),
      });

      renderEmbeddedLabel(p, element, 'center-middle');

      return businessKnowledge;
    },
    'dmn:InputData': function (p, element) {
      const rect = drawRect(p, element.width, element.height, 22, {
        stroke: getStrokeColor(element, defaultStrokeColor),
        fill: getFillColor(element, defaultFillColor),
      });

      renderEmbeddedLabel(p, element, 'center-middle');

      return rect;
    },
    'dmn:TextAnnotation': function (p, element) {
      const style = {
        fill: 'none',
        stroke: 'none',
      };

      const textElement = drawRect(p, element.width, element.height, 0, 0, style);

      const textPathData = pathMap.getScaledPath('TEXT_ANNOTATION', {
        xScaleFactor: 1,
        yScaleFactor: 1,
        containerWidth: element.width,
        containerHeight: element.height,
        position: {
          mx: 0.0,
          my: 0.0,
        },
      });

      drawPath(p, textPathData, {
        stroke: getStrokeColor(element, defaultStrokeColor),
      });

      const text = getSemantic(element).text || '';

      renderLabel(p, text, {
        style: {
          fill: getLabelColor(element, defaultLabelColor, defaultStrokeColor),
        },
        box: element,
        align: 'left-top',
        padding: 5,
      });

      return textElement;
    },
    'dmn:Association': function (p, element) {
      const semantic = getSemantic(element);

      const fill = getFillColor(element, defaultFillColor);
      const stroke = getStrokeColor(element, defaultStrokeColor);
      const attrs = {
        stroke,
        strokeDasharray: '0.5, 5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        fill: 'none',
      };

      if (semantic.associationDirection === 'One'
          || semantic.associationDirection === 'Both') {
        attrs.markerEnd = marker('association-end', fill, stroke);
      }

      if (semantic.associationDirection === 'Both') {
        attrs.markerStart = marker('association-start', fill, stroke);
      }

      return drawLine(p, element.waypoints, attrs);
    },
    'dmn:InformationRequirement': function (p, element) {
      const fill = getFillColor(element, defaultFillColor);
      const stroke = getStrokeColor(element, defaultStrokeColor);
      const attrs = {
        stroke,
        strokeWidth: 1,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        markerEnd: marker('information-requirement-end', fill, stroke),
      };

      return drawLine(p, element.waypoints, attrs);
    },
    'dmn:KnowledgeRequirement': function (p, element) {
      const fill = getFillColor(element, defaultFillColor);
      const stroke = getStrokeColor(element, defaultStrokeColor);
      const attrs = {
        stroke,
        strokeWidth: 1,
        strokeDasharray: 5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        markerEnd: marker('knowledge-requirement-end', fill, stroke),
      };

      return drawLine(p, element.waypoints, attrs);
    },
    'dmn:AuthorityRequirement': function (p, element) {
      const fill = getFillColor(element, defaultFillColor);
      const stroke = getStrokeColor(element, defaultStrokeColor);
      const attrs = {
        stroke,
        strokeWidth: 1.5,
        strokeDasharray: 5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        markerEnd: marker('authority-requirement-end', fill, stroke),
      };

      return drawLine(p, element.waypoints, attrs);
    },
  };
  function drawShape(parent, element) {
    const h = handlers[element.type];

    if (!h) {
      return BaseRenderer.prototype.drawShape.apply(this, [parent, element]);
    }
    return h(parent, element);
  }

  function drawConnection(parent, element) {
    const { type } = element;
    const h = handlers[type] || handlers.line;

    if (!h) {
      return BaseRenderer.prototype.drawConnection.apply(this, [parent, element]);
    }
    return h(parent, element);
  }

  // eslint-disable-next-line no-unused-vars
  this.canRender = function (element) {
    return true;
  };

  this.drawShape = drawShape;
  this.drawConnection = drawConnection;
}

inherits(Renderer, BaseRenderer);

Renderer.$inject = [
  'config.Renderer',
  'eventBus',
  'pathMap',
  'styles',
  'textRenderer',
  'canvas',
];
