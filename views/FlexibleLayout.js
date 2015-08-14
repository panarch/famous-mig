// @author Taehoon Moon 2015

'use strict';

var Size = require('famous/components/Size');

var Layout = require('./Layout');

function FlexibleLayout(options) {
    Layout.apply(this, arguments);

    this.direction = options && options.direction ?
        options.direction :
        FlexibleLayout.DIRECTION_X;

    this.ratios = options && options.ratios ?
        options.ratios :
        [];
}

FlexibleLayout.DIRECTION_X = 0;
FlexibleLayout.DIRECTION_Y = 1;

FlexibleLayout.prototype = Object.create(Layout.prototype);
FlexibleLayout.prototype.constructor = FlexibleLayout;

FlexibleLayout.prototype._calculateSum = function _calculateSum() {
    var sum = 0;
    for (var i = 0; i < this.ratios.length; i++) {
        var ratio = this.ratios[i];
        if (typeof ratio !== 'number')
            continue;

        sum += ratio;
    }

    return sum;
};

FlexibleLayout.prototype._calculateAbsoluteLength = function _calculateAbsoluteLength(views) {
    var length = 0;
    for (var i = 0; i < views.length; i++) {
        if (this.ratios[i] !== true)
            continue;

        var sizedNode = views[i].getSizedNode();
        var size = sizedNode.getAbsoluteSize();
        if (this.direction === FlexibleLayout.DIRECTION_X)
            length += size[0];
        else
            length += size[1];
    }

    return length;
};

FlexibleLayout.prototype._sequenceFrom = function _sequenceFrom(views) {
    var size = this.node.getSize();
    var sum = this._calculateSum();
    var length = this._calculateAbsoluteLength(views);
    var pos = 0;

    var isHorizontal = this.direction === FlexibleLayout.DIRECTION_X;

    for (var i = 0; i < views.length; i++) {
        var view = views[i];
        var node = view.node;
        var sizedNode = view.getSizedNode();
        var ratio = this.ratios[i];

        // setting position first
        node.setPosition.apply(node, (isHorizontal ? [pos, 0] : [0, pos]));

        if (ratio === true) {
            pos += sizedNode.getAbsoluteSize()[(isHorizontal ? 0 : 1)];
            continue;
        }

        var _length;
        if (isHorizontal) {
            _length = 1.0 * ratio / sum * (size[0] - length);

            node
                .setSizeMode(Size.ABSOLUTE, Size.RELATIVE)
                .setProportionalSize(null, 1)
                .setAbsoluteSize(_length, null);
        }
        else {
            _length = 1.0 * ratio / sum * (size[1] - length);

            node
                .setSizeMode(Size.RELATIVE, Size.ABSOLUTE)
                .setProportionalSize(1, null)
                .setAbsoluteSize(null, _length);
        }

        pos += _length;
    }
};

module.exports = FlexibleLayout;
