// @author Taehoon Moon 2015

'use strict';

var EventHandler = require('./EventHandler');

function View() {
    this.node = null;
    this._eventInput = new EventHandler();
    this._eventOutput = new EventHandler();
    EventHandler.setInputHandler(this, this._eventInput);
    EventHandler.setOutputHandler(this, this._eventOutput);

    this._queue = [];
    this._children = [];
}

View.prototype._setNode = function _setNode(node) {
    this.node = node;

    for (var i = 0; i < this._queue.length; i++) {
        this._queue[i].setNode(this.node.addChild());
    }

    this._queue = [];
};

View.prototype.setNode = function setNode(node) {
    this._setNode(node);
};

View.prototype.add = function add(view) {
    this._children.push(view);

    if (!this.node) {
        this._queue.push(view);
        return view;
    }

    var child = this.node.addChild();
    view.setNode(child);

    return view;
};

View.prototype.getSizedNode = function getSizedNode() {
    if (!this.node || this._children.length === 0)
        return null;

    return this._children[0].getSizedNode();
};

module.exports = View;
