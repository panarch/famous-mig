// @author Taehoon Moon 2015

'use strict';

var Surface = require('../core/Surface');

/**
 * A surface containing an HTML5 Canvas element.
 *   This extends the Surface class.
 *
 * @class CanvasSurface
 * @extends Surface
 * @constructor
 * @param {Object} [options] overrides of default options
 * @param {Array.Number} [options.canvasSize] [width, height] for document element
 */
function CanvasSurface(options) {
    if (options)
        options.useTarget = true;
    else
        options = { useTarget: true };

    if (options.canvasSize) this._canvasSize = options.canvasSize;
    Surface.apply(this, arguments);
    if (!this._canvasSize) this._canvasSize = this.getSize();
    this._backBuffer = document.createElement('canvas');
    if (this._canvasSize) {
        this._backBuffer.width = this._canvasSize[0];
        this._backBuffer.height = this._canvasSize[1];
    }
    this._contextId = undefined;
}

CanvasSurface.prototype = Object.create(Surface.prototype);
CanvasSurface.prototype.constructor = CanvasSurface;
CanvasSurface.prototype.elementType = 'canvas';

/**
 * Set inner document content.  Note that this is a noop for CanvasSurface.
 *
 * @method setContent
 *
 */
CanvasSurface.prototype.setContent = function setContent() {};

/**
 * Place the document element this component manages into the document.
 *    This will draw the content to the document.
 *
 * @private
 * @method deploy
 * @param {Node} target document parent of this container
 */
CanvasSurface.prototype.deploy = function deploy() {
    if (this._canvasSize) {
        this._currentTarget.width = this._canvasSize[0];
        this._currentTarget.height = this._canvasSize[1];
    }

    if (this._contextId === '2d') {
        this._currentTarget.getContext(this._contextId).drawImage(this._backBuffer, 0, 0);
        this._backBuffer.width = 0;
        this._backBuffer.height = 0;
    }

    this._eventOutput.emit('deploy');
};

/**
 * Returns the canvas element's context
 *
 * @method getContext
 * @param {string} contextId context identifier
 */
CanvasSurface.prototype.getContext = function getContext(contextId) {
    this._contextId = contextId;
    return this._currentTarget ? this._currentTarget.getContext(contextId) : this._backBuffer.getContext(contextId);
};

/**
 *  Set the size of the surface and canvas element.
 *
 *  @method setSize
 *  @param {Array.number} size [width, height] of surface
 *  @param {Array.number} canvasSize [width, height] of canvas surface
 */
CanvasSurface.prototype.setSize = function setSize(size, canvasSize) {
    Surface.prototype.setSize.apply(this, arguments);
    if (canvasSize) this._canvasSize = [canvasSize[0], canvasSize[1]];
    if (this._currentTarget) {
        this._currentTarget.width = this._canvasSize[0];
        this._currentTarget.height = this._canvasSize[1];
    }
};

module.exports = CanvasSurface;
