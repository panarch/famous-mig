// @author Taehoon Moon 2015

/*
 * [CAUTION]
 * Because of _currentTarget support, worker mode is not available.
 */

'use strict';

var Size = require('famous/components/Size');
var DOMElement = require('famous/dom-renderables/DOMElement');
var EventMap = require('famous/dom-renderers/events/EventMap');

var EventHandler = require('./EventHandler');
var Timer = require('../utilities/Timer');

function Surface(options) {
    this.node = null;
    this.el = null;
    this._uiEvent = {};
    this._eventInput = new EventHandler();
    this._eventOutput = new EventHandler();
    EventHandler.setInputHandler(this, this._eventInput);
    EventHandler.setOutputHandler(this, this._eventOutput);

    this.properties = {};
    this.attributes = {};
    this.content = '';
    this.classList = [];
    this.size = null;
    this.useTarget = false;
    this._currentTarget = null;

    if (options) this.setOptions(options);

    this._on = this.on;
    this.on = (function(type, handler) {
        if (EventMap[type]) {
            this._uiEvent[type] = handler;
            if (this.node) this.node.addUIEvent(type);
        }

        this._on(type, handler);
    }).bind(this);
}

Surface.prototype.constructor = Surface;
Surface.prototype.elementType = 'div';
Surface.prototype.elementClass = 'famous-surface';

Surface.prototype.setAttributes = function setAttributes(attributes) {
    for (var n in attributes) {
        this.attributes[n] = attributes[n];
        if (this.el) this.el.setAttribute(n, attributes[n]);
    }

    return this;
};

Surface.prototype.getAttributes = function getAttributes() {
    return this.attributes;
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
    this.content = content;
    if (!this.el) return;

    if (typeof content === 'string') {
        this.el.setContent(content);
        return;
    }

    if (!this._currentTarget) return;

    // dom object
    if (this.content instanceof Node) {
        var target = this._currentTarget;
        while (target.hasChildNodes()) target.removeChild(target.firstChild);
        target.appendChild(content);
    }
};

Surface.prototype.setOptions = function setOptions(options) {
    if (options.size) this.setSize(options.size);
    if (options.classes) this.setClasses(options.classes);
    if (options.properties) this.setProperties(options.properties);
    if (options.attributes) this.setAttributes(options.attributes);
    if (options.content) this.setContent(options.content);
    if (options.useTarget) this.useTarget = true;
    return this;
};

Surface.prototype.getSize = function getSize() {
    if (this.node)
        return this.node.getSize();

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

Surface.prototype._initTarget = function() {
    var query = '[data-fa-path=\'' + this.node.getLocation() + '\']';
    var elem = document.querySelector(query);
    if (elem) {
        this._currentTarget = elem;
        this.deploy(elem);
        return;
    }

    Timer.after(this._initTarget.bind(this), 1);
};

Surface.prototype._setNode = function _setNode(node) {
    if (this.el) return;

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

    // ui events
    var eventNames = Object.keys(this._uiEvent);
    for (var i = 0; i < eventNames.length; i++) {
        this.node.addUIEvent(eventNames[i]);
    }

    this.node.onReceive = (function(event, payload) {
        if (!this._uiEvent[event]) return;

        // not supported
        payload.preventDefault = function() {};
        payload.stopPropagation = function() {};

        this._uiEvent[event](payload);
    }).bind(this);

    if (this.useTarget)
        Timer.after(this._initTarget.bind(this), 2);
};

Surface.prototype.setNode = function setNode(node) {
    this._setNode(node);
};

Surface.prototype.deploy = function deploy() {
    if (this.content && this.content instanceof Node)
        this.setContent(this.content);

    this._eventOutput.emit('deploy');
};

Surface.prototype.getSizedNode = function getSizedNode() {
    return this.node;
};

module.exports = Surface;
