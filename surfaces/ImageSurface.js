// @author Taehoon Moon 2015

'use strict';

var Surface = require('../core/Surface');
var DOMElement = require('famous/dom-renderables/DOMElement');

function ImageSurface(options) {
    Surface.apply(this, arguments);
}

ImageSurface.prototype = Object.create(Surface.prototype);
ImageSurface.prototype.constructor = ImageSurface;

ImageSurface.prototype.elementType = 'img';

ImageSurface.prototype.setContent = function setContent(content) {
    this.content = content;
    if (this.el) this.el.setAttribute('src', content);
};

ImageSurface.prototype.setNode = function setNode(node) {
    this.node = node;
    this.attributes.src = this.content;

    this.el = new DOMElement(this.node, {
        tagName: this.elementType,
        attributes: this.attributes,
        classes: this.classList,
        properties: this.properties
    });

    if (this.size) this.setSize(this.size);
};

module.exports = ImageSurface;
