// @author Taehoon Moon 2015

'use strict';

var View = require('../core/View');
var Timer = require('../utilities/Timer');
var Utility = require('../utilities/Utility');

function SequentialLayout(options) {
    View.apply(this, arguments);

    this.direction = options.direction !== undefined ?
        options.direction :
        Utility.Direction.Y;
}

SequentialLayout.prototype = Object.create(View.prototype);
SequentialLayout.prototype.constructor = SequentialLayout;

SequentialLayout.prototype._sequenceFrom = function _sequenceFrom(views) {
    var length = 0;

    for (var i = 0; i < views.length; i++) {
        var view = views[i];
        if (!view.node)
            this.add(view);

        var node = view.node;
        var size = node.getAbsoluteSize();

        if (this.direction === Utility.Direction.X) {
            node.setPosition(length, 0);
            length += size[0];
        }
        else {
            node.setPosition(0, length);
            length += size[1];
        }
    }
};

SequentialLayout.prototype.sequenceFrom = function sequenceFrom(views) {
    // run it after all nodes are initialized
    Timer.after(this._sequenceFrom.bind(this, views), 1);
};

module.exports = SequentialLayout;
