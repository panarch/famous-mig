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
    // run it after all nodes are initialized
    if (!this.node) {
        this._pending = true;
        this._views = views;
        return;
    }

    // compare _views and views
    var i;
    if (this._views !== views) {
        for (i = 0; i < this._views.length; i++) {
            var _view = this._views[i];
            if (views.indexOf(_view) === -1) {
                _view.node.hide();
            }
        }
    }

    for (i = 0; i < views.length; i++) {
        var view = views[i];
        if (!view.node)
            this.add(view);

        view.node.show();
    }

    this._views = views;
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
