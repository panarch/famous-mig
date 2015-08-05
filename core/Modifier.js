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
    if (!this.node) return;

    var position = this.transform.getPosition();
    var rotation = this.transform.getRotation();
    var scale = this.transform.getScale();

    if (position) this.node.setPosition.apply(this.node, position);
    if (rotation) this.node.setRotation.apply(this.node, rotation);
    if (scale) this.node.setScale.apply(this.node, scale);
};

Modifier.prototype.opacityFrom = function opacityFrom(opacity) {
    this.opacity = opacity;
    if (!this.node) return;

    this.node.setOpacity(opacity);
};

Modifier.prototype.originFrom = function originFrom(origin) {
    this.origin = origin;
    if (!this.node) return;

    this.node.setOrigin.apply(this.node, origin);
    this.node.setMountPoint.apply(this.node, origin);
};

Modifier.prototype.alignFrom = function alignFrom(align) {
    this.align = align;
    if (!this.node) return;

    this.node.setAlign.apply(this.node, align);
};

Modifier.prototype.sizeFrom = Surface.prototype.setSize;

Modifier.prototype.proportionsFrom = function proportionsFrom(proportions) {
    this.proportions = proportions;
    if (!this.node) return;

    this.node.setProportionalSize.apply(this.node, proportions);
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
    if (this.proportions) this.proportionsFrom(this.proportions);
};

module.exports = Modifier;
