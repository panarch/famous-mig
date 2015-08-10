// @author Taehoon Moon 2015

'use strict';

function Transform() {
    this._position = null;
    this._rotation = null;
    this._scale = null;
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

Transform.identity = new Transform();

Transform.translate = function(x, y, z) {
    var transform = new Transform();
    transform._position = [x, y, z];
    return transform;
};

Transform.scale = function scale(x, y, z) {
    var transform = new Transform();
    transform._scale = [x, y, z];
    return transform;
};

Transform.rotateX = function rotateX(theta) {
    var transform = new Transform();
    transform._rotation = [theta, undefined, undefined];
    return transform;
};

Transform.rotateY = function rotateY(theta) {
    var transform = new Transform();
    transform._rotation = [undefined, theta, undefined];
    return transform;
};

Transform.rotateZ = function rotateZ(theta) {
    var transform = new Transform();
    transform._rotation = [undefined, undefined, theta];
    return transform;
};

Transform.thenMove = function thenMove(transform, position) {
    transform._position = position;
    return transform;
};

Transform.thenScale = function thenScale(transform, scale) {
    transform._scale = scale;
    return transform;
};

module.exports = Transform;
