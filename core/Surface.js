// @author Taehoon Moon 2015

'use strict';

var Size = require('famous/components/Size');
var DOMElement = require('famous/dom-renderables/DOMElement');

function Surface(options) {
    this.node = null;
    this.el = null;

    this.options = {};

    this.properties = {};
    this.attributes = {};
    this.content = '';
    this.classList = [];
    this.size = null;

    if (options) this.setOptions(options);

    this._currentTarget = null;
}

Surface.prototype.constructor = Surface;
Surface.prototype.elementType = 'div';
Surface.prototype.elementClass = 'famous-surface';

Surface.prototype.setAttributes = function setAttributes(attributes) {

};

Surface.prototype.getAttributes = function getAttributes() {

};

Surface.prototype.setProperties = function setProperties(properties) {
    for (var n in properties) {
        this.properties[n] = properties[n];
        if (this.el) this.el.setProperty(n, properties[n]);
    }

    return this;
};

Surface.prototype.getProperties = function getProperties() {
    return this.properties;
};

Surface.prototype.addClass = function addClass(className) {
    if (this.classList.indexOf(className) < 0) {
        this.classList.push(className);
        if (this.el) this.el.addClass(className);
    }

    return this;
};

Surface.prototype.removeClass = function removeClass(className) {
    var i = this.classList.indexOf(className);
    if (i >= 0) {
        this.classList.splice(i, 1);
        if (this.el) this.el.removeClass(className);
    }

    return this;
};

Surface.prototype.toggleClass = function toggleClass(className) {
    var i = this.classList.indexOf(className);
    if (i >= 0) {
        this.removeClass(className);
    }
    else {
        this.addClass(className);
    }

    return this;
};

Surface.prototype.setClasses = function setClasses(classList) {
    for (var i = 0; i < classList.length; i++) {
        var className = classList[i];
        if (this.classList.indexOf(className) < 0) {
            if (this.el) this.el.addClass(className);
            this.classList.push(className);
        }
    }

    return this;
};

Surface.prototype.getClassList = function getClasses() {
    return this.classList;
};

Surface.prototype.setContent = function setContent(content) {
    // if it is not string...
    this.content = content;
    if (this.el) this.el.setContent(this.content);
};

Surface.prototype.setOptions = function setOptions(options) {
    if (options.size) this.setSize(options.size);
    if (options.classes) this.setClasses(options.classes);
    if (options.properties) this.setProperties(options.properties);
    if (options.attributes) this.setAttributes(options.attributes);
    if (options.content) this.setContent(options.content);
    return this;
};

Surface.prototype.getSize = function getSize() {
    return this.size;
};

Surface.prototype.setSize = function setSize(size) {
    this.size = size;
    if (!this.node) return;

    var sizeMode = [
        Size.ABSOLUTE,
        Size.ABSOLUTE
    ];

    var absoluteSize = [null, null];
    var proportionalSize = [null, null];
    var absoluteDirty = false;
    var proportionalDirty = false;

    for (var i = 0; i < 2; i++) {
        if (this.size[i] === undefined) {
            sizeMode[i] = Size.RELATIVE;
            proportionalSize[i] = 1;
            proportionalDirty = true;
        }
        else if (this.size[i] === true) {
            sizeMode[i] = Size.RENDER;
        }
        else {
            absoluteSize[i] = this.size[i];
            absoluteDirty = true;
        }
    }

    this.node.setSizeMode(sizeMode[0], sizeMode[1]);
    if (absoluteDirty)
        this.node.setAbsoluteSize(absoluteSize[0], absoluteSize[1]);

    if (proportionalDirty)
        this.node.setProportionalSize(proportionalSize[0], proportionalSize[1]);

};

Surface.prototype.setNode = function setNode(node) {
    this.node = node;
    // content, size, classes, properties and attributes
    this.el = new DOMElement(this.node, {
        tagName: this.elementType,
        attributes: this.attributes,
        classes: this.classList,
        properties: this.properties,
        content: this.content
    });

    if (this.size) this.setSize(this.size);
};

module.exports = Surface;
