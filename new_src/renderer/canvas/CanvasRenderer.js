import { rendererLogger as logger } from '../../configuration/LoggerConfig';
import {
    drawConvertedStrokes,
    drawPendingStrokes,
    drawCurrentStroke
} from './StrokeCanvasRenderer';
import { drawShapePrimitive } from './ShapeCanvasRenderer';

export * from './StrokeCanvasRenderer';

/*export * from './MusicCanvasRenderer';
 export * from './ShapeCanvasRenderer';

 export * from './TextCanvasRenderer';*/

/**
 * Tool to create canvas
 *
 * @private
 * @param {Element} parent
 * @param {String} id
 * @returns {Element}
 */
function createCanvas(renderDomElement, id) {
  // eslint-disable-next-line no-undef
  const browserDocument = document;
  const count = browserDocument.querySelectorAll('canvas[id^=' + id + ']').length;
  const canvas = browserDocument.createElement('canvas');
  logger.debug(renderDomElement.clientWidth);
  canvas.id = id + '-' + count;
  canvas.style.width = renderDomElement.clientWidth + 'px';
  canvas.style.height = renderDomElement.clientHeight + 'px';
  renderDomElement.appendChild(canvas);
  return canvas;
}


function performUpdateCanvasSizeToParentOne(renderDomElement, canvas) {
  logger.info('Updating canvasSize ', canvas.id, ' in ', renderDomElement.id);
  /* eslint-disable no-param-reassign */
  canvas.width = renderDomElement.clientWidth;
  canvas.height = renderDomElement.clientHeight;
  canvas.style.width = renderDomElement.clientWidth + 'px';
  canvas.style.height = renderDomElement.clientHeight + 'px';
  /* eslint-enable no-param-reassign */
  canvas.getContext('2d').scale(1, 1);
  //TODO Manage a ration for retina devices
}

export function updateCanvasSizeToParentOne(renderDomElement, renderStructure, model, stroker) {
  performUpdateCanvasSizeToParentOne(renderDomElement, renderStructure.renderingCanvas);
  performUpdateCanvasSizeToParentOne(renderDomElement, renderStructure.capturingCanvas);
  this.drawModel(renderStructure, model, stroker);
}

/**
 * Populate the dom element
 * @param renderDomElement
 * @returns The structure to give as paramter when a draw model will be call {{renderingCanvas: Element, renderingCanvasContext: CanvasRenderingContext2D, capturingCanvas: Element, capturingCanvasContext: CanvasRenderingContext2D}}
 */
export function populateRenderDomElement(renderDomElement) {
  logger.debug('Populate dom elements for rendering inside  ', renderDomElement.id);
  const renderingCanvas = createCanvas(renderDomElement, 'ms-rendering-canvas');
  performUpdateCanvasSizeToParentOne(renderDomElement, renderingCanvas);
  const capturingCanvas = createCanvas(renderDomElement, 'ms-capture-canvas');
  performUpdateCanvasSizeToParentOne(renderDomElement, capturingCanvas);
  return {
    renderingCanvas,
    renderingCanvasContext: renderingCanvas.getContext('2d'),
    capturingCanvas,
    capturingCanvasContext: capturingCanvas.getContext('2d')
  };
}

/**
 * Clear the recognition context
 *
 * @method clear
 */
export function clear(renderStructure) {
  renderStructure.capturingCanvasContext.clearRect(0, 0, renderStructure.capturingCanvas.width, renderStructure.capturingCanvas.height);
  renderStructure.renderingCanvasContext.clearRect(0, 0, renderStructure.renderingCanvas.width, renderStructure.renderingCanvas.height);
}

export function drawModel(renderStructure, model, stroker) {
  if (renderStructure.capturingCanvasContext) {
    renderStructure.capturingCanvasContext.clearRect(0, 0, renderStructure.capturingCanvas.width, renderStructure.capturingCanvas.height);
  }

  //FIXME We need to manage parameters
  const emptyParamaters = {};
  clear(renderStructure);
  //drawPendingStrokes(renderStructure, model, stroker);

  function drawSymbol(symbol) {
    logger.debug('Attempting to draw symbol', symbol.elementType);
    //Displaying the text lines
    if (symbol.elementType === 'textLine') {
      drawShapeTextLine(symbol, renderStructure.renderingCanvasContext, emptyParamaters);
    }

    //Displaying the primitives
    if (symbol.primitives) {
      switch (symbol.elementType) {
        case 'shape':
          symbol.primitives.forEach(drawShapePrimitive);
          break;
        default:
          logger.info('Unable to draw ', symbol.elementType);
          break;
      }
    }
  }

  //Displaying the pending strokes
  drawPendingStrokes(renderStructure, model, stroker);

  drawConvertedStrokes(renderStructure, model, stroker);

  if (model.recognizedComponents.symbolList) {
    model.recognizedComponents.symbolList.forEach(drawSymbol);
  }
}
