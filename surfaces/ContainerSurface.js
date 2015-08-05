// @author Taehoon Moon 2015

'use strict';

var Surface = require('../core/Surface');
var View = require('../core/View');

function ContainerSurface(options) {
    Surface.apply(this, arguments);

    this._queue = [];
}

ContainerSurface.prototype = Object.create(Surface.prototype);
ContainerSurface.prototype.constructor = ContainerSurface;

ContainerSurface.prototype.add = View.prototype.add;
ContainerSurface.prototype._setNodeFromView = View.prototype._setNode;

ContainerSurface.prototype.setNode = function setNode(node) {
    this._setNode(node);
    this._setNodeFromView(node);
};

module.exports = ContainerSurface;
