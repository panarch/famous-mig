// @author Taehoon Moon 2015

'use strict';

var Size = require('famous/components/Size');

var View = require('../core/View');
var Timer = require('../utilities/Timer');
var Utility = require('../utilities/Utility');

function SequentialLayout(options) {
    View.apply(this, arguments);

    this.direction = options && options.direction !== undefined ?
        options.direction :
        Utility.Direction.Y;
}

SequentialLayout.prototype = Object.create(View.prototype);
SequentialLayout.prototype.constructor = SequentialLayout;

SequentialLayout.prototype._sequenceFrom = function _sequenceFrom(views) {
    var length = 0;

    for (var i = 0; i < views.length; i++) {
        var view = views[i];
        var node = view.node;
        var sizeMode = node.getSizeMode();
        var size = node.getAbsoluteSize();

        if (this.direction === Utility.Direction.X) {
            node.setPosition(length, 0);
            if (sizeMode[0] === Size.ABSOLUTE)
                length += size[0];
        }
        else {
            node.setPosition(0, length);
            if (sizeMode[1] === Size.ABSOLUTE)
                length += size[1];
        }
    }
};

SequentialLayout.prototype.sequenceFrom = function sequenceFrom(views) {
    // run it after all nodes are initialized
    for (var i = 0; i < views.length; i++) {
        var view = views[i];
        if (!view.node)
            this.add(view);
    }

    Timer.after(this._sequenceFrom.bind(this, views), 1);
};

module.exports = SequentialLayout;
