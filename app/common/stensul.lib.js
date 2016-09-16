'use strict';

function StensulLib() {

}

/**
 * Initializes all library components
 */
StensulLib.prototype.initialize = function () {

    // Load Component class
    this.Component = require('../common/component/component.model');

    // Load item module
    var ItemModule = require('../item/item.module');
    this.ItemModule = new ItemModule();

    // Load firebase collection
    this.FirebaseCollection = require('../common/firebase/firebase.collection');
};

StensulLib.prototype.Log = function (payload) {
    console.log(payload);
};

module.exports = new StensulLib();