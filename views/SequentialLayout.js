// @author Taehoon Moon 2015

'use strict';

var Size = require('famous/components/Size');

var Layout = require('./Layout');
var Utility = require('../utilities/Utility');

function SequentialLayout(options) {
    Layout.apply(this, arguments);

    this.direction = options && options.direction !== undefined ?
        options.direction :
        Utility.Direction.Y;
}

SequentialLayout.prototype = Object.create(Layout.prototype);
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

module.exports = SequentialLayout;
