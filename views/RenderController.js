// @author Taehoon Moon 2015

'use strict';

var View = require('../core/View');

function RenderController() {
    View.apply(this, arguments);

    this._currentView = null;
}

RenderController.prototype = Object.create(View.prototype);
RenderController.prototype.constructor = RenderController;

RenderController.prototype.show = function show(view) {
    if (view === this._currentView)
        return;

    this.hide();
    this._currentView = view;

    if (!view.node)
        this.add(view);
    else if (this.node)
        view.node.setScale(1, 1);
};

RenderController.prototype.hide = function hide() {
    if (!this._currentView) return;

    this._currentView.node.setScale(0, 0);
    this._currentView = null;
};

module.exports = RenderController;
