'use strict';

function ItemModule() {
    this.Item = require('./item.model');
    this.ItemValidator = require('./item.validator');
    this.ItemComponent = require('./item.component');

    this.ItemImageUploadService = require('./image-upload/item.image-upload.service');
    this.ItemCollection = require('./item-collection/item-collection.model');
    this.ItemCollectionComponent = require('./item-collection/item-collection.component');
    this.AddItemComponent = require('./item-collection/add-item/add-item.component');
}

module.exports = ItemModule;