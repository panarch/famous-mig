// @author Taehoon Moon 2015

'use strict';

function Modifier(options) {
    this.node = null;
}

Modifier.prototype.add = function add() {
};

Modifier.prototype.setNode = function setNode(view) {
    var child = this.node.addChild();
    view.setNode(child);

    // do something; applying size, origin, align, opacity and transform...
};

module.exports = Modifier;
