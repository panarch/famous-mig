// @author Taehoon Moon 2015

'use strict';

var Size = require('famous/components/Size');

var Layout = require('./Layout');

function GridLayout(options) {
    Layout.apply(this, arguments);

    this.dimensions = options && options.dimensions !== undefined ?
        options.dimensions :
        [1, 1];
}

GridLayout.prototype = Object.create(Layout.prototype);
GridLayout.prototype.constructor = GridLayout;

GridLayout.prototype._sequenceFrom = function _sequenceFrom(views) {
    var size = this.node.getSize();
    var cols = this.dimensions[0];
    var rows = this.dimensions[1];

    var w = size[0] / cols;
    var h = size[1] / rows;
    for (var i = 0; i < views.length; i++) {
        var view = views[i];
        var x = w * (i % cols);
        var y = h * ((i / cols) | 0);

        view.node
            .setSizeMode(Size.ABSOLUTE, Size.ABSOLUTE)
            .setAbsoluteSize(w, h)
            .setMountPoint(0, 0)
            .setPosition(x, y);
    }
};

module.exports = GridLayout;
