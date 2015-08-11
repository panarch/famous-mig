// @author Taehoon Moon 2015

'use strict';

var Size = require('famous/components/Size');

var View = require('../core/View');
var Timer = require('../utilities/Timer');

function GridLayout(options) {
    View.apply(this, arguments);

    this.dimensions = options && options.dimensions !== undefined ?
        options.dimensions :
        [1, 1];
}

GridLayout.prototype = Object.create(View.prototype);
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

GridLayout.prototype.sequenceFrom = function sequenceFrom(views) {
    // run it after all nodes are initialized
    for (var i = 0; i < views.length; i++) {
        var view = views[i];
        if (!view.node)
            this.add(view);
    }

    Timer.after(this._sequenceFrom.bind(this, views), 1);
};

module.exports = GridLayout;
