// @author Taehoon Moon 2015

'use strict';

function Transform() {
    this._position = [0, 0, 0];
    this._rotation = [0, 0, 0];
    this._scale = [1, 1, 1];
}

Transform.prototype.getPosition = function getPosition() {
    return this._position;
};

Transform.prototype.getRotation = function getRotation() {
    return this._rotation;
};

Transform.prototype.getScale = function getScale() {
    return this._scale;
};

Transform.prototype.getValue = function getValue() {
    return {
        position: this._position.slice(),
        rotation: this._rotation.slice(),
        scale: this._scale.slice()
    };
};

Transform.identity = new Transform();

Transform._fill = function _fill(arr, defaultVal) {
    for (var i = 0; i < arr.length; i++) {
        var val = arr[i];
        if (typeof val !== 'number' || isNaN(val))
            arr[i] = defaultVal;
    }
};

Transform.translate = function translate(x, y, z) {
    var transform = new Transform();
    transform._position = [x, y, z];
    Transform._fill(transform._position, 0);
    return transform;
};

Transform.scale = function scale(x, y, z) {
    var transform = new Transform();
    transform._scale = [x, y, z];
    Transform._fill(transform._scale, 1);
    return transform;
};

Transform.rotateX = function rotateX(theta) {
    var transform = new Transform();
    transform._rotation = [theta, 0, 0];
    Transform._fill(transform._rotation, 0);
    return transform;
};

Transform.rotateY = function rotateY(theta) {
    var transform = new Transform();
    transform._rotation = [0, theta, 0];
    Transform._fill(transform._rotation, 0);
    return transform;
};

Transform.rotateZ = function rotateZ(theta) {
    var transform = new Transform();
    transform._rotation = [0, 0, theta];
    Transform._fill(transform._rotation, 0);
    return transform;
};

Transform.thenMove = function thenMove(transform, position) {
    transform._position = position;
    Transform._fill(transform._position, 0);
    return transform;
};

Transform.thenScale = function thenScale(transform, scale) {
    transform._scale = scale;
    Transform._fill(transform._scale, 1);
    return transform;
};

module.exports = Transform;
