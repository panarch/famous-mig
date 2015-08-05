// @author Taehoon Moon 2015

'use strict';

var Surface = require('./Surface');

function Modifier(options) {
    this.node = null;

    this.transform = null;
    this.opacity = null;
    this.origin = null;
    this.align = null;
    this.size = null;
    this.proportions = null;

    if (options) {
        if (options.transform) this.transformFrom(options.transform);
        if (options.opacity !== null) this.opacityFrom(options.opacity);
        if (options.origin) this.originFrom(options.origin);
        if (options.align) this.alignFrom(options.align);
        if (options.size) this.sizeFrom(options.size);
        if (options.proportions) this.proportionsFrom(options.proportions);
    }
}

Modifier.prototype.transformFrom = function transformFrom(transform) {
    this.transform = transform;
};

Modifier.prototype.opacityFrom = function opacityFrom(opacity) {
    this.opacity = opacity;
    if (!this.node) return;

    this.node.setOpacity(opacity);
};

Modifier.prototype.originFrom = function originFrom(origin) {
    this.origin = origin;
    if (!this.node) return;

    this.node.setOrigin(origin[0], origin[1]);
    this.node.setMountPoint(origin[0], origin[1]);
};

Modifier.prototype.alignFrom = function alignFrom(align) {
    this.align = align;
    if (!this.node) return;

    this.node.setAlign(align[0], align[1]);
};

Modifier.prototype.sizeFrom = Surface.prototype.setSize;

Modifier.prototype.proportionsFrom = function proportionsFrom(proportions) {
    this.proportions = proportions;
};

Modifier.prototype.setTransform = Modifier.prototype.transformFrom;
Modifier.prototype.setOpacity = Modifier.prototype.opacifyFrom;
Modifier.prototype.setOrigin = Modifier.prototype.originFrom;
Modifier.prototype.setSize = Surface.prototype.setSize;
Modifier.prototype.setProportions = Modifier.prototype.proportionsFrom;

Modifier.prototype.add = function add(view) {
    var child = this.node.addChild();
    view.setNode(child);

    return child;
};

Modifier.prototype.setNode = function setNode(node) {
    this.node = node;

    if (this.size) this.sizeFrom(this.size);
    if (this.origin) this.originFrom(this.origin);
    if (this.align) this.alignFrom(this.align);
    if (this.opacity !== null) this.opacityFrom(this.opacity);
    if (this.transform) this.transformFrom(this.transform);
    // do something; applying size, origin, align, opacity and transform...
};

module.exports = Modifier;
