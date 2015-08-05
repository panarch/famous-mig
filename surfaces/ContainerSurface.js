// @author Taehoon Moon 2015

'use strict';

var Surface = require('../core/Surface');

function ContainerSurface(options) {
    Surface.apply(this, arguments);
}

ContainerSurface.prototype = Object.create(Surface.prototype);
ContainerSurface.prototype.constructor = ContainerSurface;

ContainerSurface.prototype.add = function add(view) {
    var child = this.node.addChild();
    view.setNode(child);

    return view;
};

module.exports = ContainerSurface;
