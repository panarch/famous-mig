// @author Taehoon Moon 2015

'use strict';

var View = require('../core/View');

function Layout(options) {
    View.apply(this, arguments);

    this._views = null;
    this._pending = false;
}

Layout.prototype = Object.create(View.prototype);
Layout.prototype.constructor = Layout;

Layout.prototype.sequenceFrom = function sequenceFrom(views) {
    this._views = views;

    // run it after all nodes are initialized
    if (!this.node) {
        this._pending = true;
        return;
    }

    for (var i = 0; i < views.length; i++) {
        var view = views[i];
        if (!view.node)
            this.add(view);
    }

    this._sequenceFrom(views);
};

Layout.prototype.setNode = function setNode(node) {
    this._setNode(node);

    if (this._pending) {
        this._pending = false;
        this.sequenceFrom(this._views);
    }

    this.node.addComponent({
        onSizeChange: (function() {
            this._sequenceFrom(this._views);
        }).bind(this)
    });
};

module.exports = Layout;
