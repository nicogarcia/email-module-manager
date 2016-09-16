'use strict';

/**
 * Represents an item
 * @param description
 * @param picture
 * @param id
 * @constructor
 */
function Item(description, picture, id) {
    var random = Math.floor(Math.random() * 1000);

    this.description = description || 'Lio messi' + random;
    this.picture = picture || this.defaultPicture;

    this.id = id
}

Item.prototype = {
    defaultPicture: 'https://firebasestorage.googleapis.com/v0/b/email-module-manager.appspot.com/o/placeholder.png?alt=media&token=cd89afe7-2f96-47f5-91f3-9523f9dde71f'
};

module.exports = Item;