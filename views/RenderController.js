// @author Taehoon Moon 2015

'use strict';

var View = require('../core/View');

function RenderController(options) {
    View.apply(this, arguments);
    this.options = options ?
        options :
        {};

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
    if (!this._currentView || !this._currentView.node) return;

    this._currentView.node.setScale(0, 0);
    this._currentView = null;
};

RenderController.prototype.inTransformFrom = function inTransformFrom() {};
RenderController.prototype.outTransformFrom = function outTransformFrom() {};
RenderController.prototype.inOpacityFrom = function inOpacityFrom() {};
RenderController.prototype.outOpacityFrom = function outOpacityFrom() {};

module.exports = RenderController;
