// @author Taehoon Moon 2015

'use strict';

var FamousEngine = require('famous/core/FamousEngine');

var _node;
function setNode(node) {
    _node = node;
}

function after(fn, numTicks) {
    var component = {
        onUpdate: function() {
            numTicks--;
            if (numTicks <= 0) {
                fn.apply(this, arguments);
                _node.removeComponent(component);
                return;
            }

            _node.requestUpdateOnNextTick(componentId);
        }
    };

    var componentId = _node.addComponent(component);
    _node.requestUpdate(componentId);
}

function setTimeout(fn, duration) {
    var beginTime = FamousEngine.getClock().now();

    var component = {
        onUpdate: function(time) {
            if (time - beginTime > duration) {
                fn.apply(this, arguments);
                _node.removeComponent(component);
                return;
            }

            _node.requestUpdateOnNextTick(componentId);
        }
    };

    var componentId = _node.addComponent(component);
    _node.requestUpdate(componentId);
}

module.exports = {
    setNode: setNode,
    after: after,
    setTimeout: setTimeout
};
