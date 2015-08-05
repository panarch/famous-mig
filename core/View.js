// @author Taehoon Moon 2015

'use strict';

function View() {
    this.node = null;
}

View.prototype.setNode = function setNode(node) {
    this.node = node;
};

View.prototype.add = function add(view) {
    var child = this.node.addChild();
    view.setNode(child);

    return this;
};

module.exports = View;
