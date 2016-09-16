'use strict';

require('./item.scss');

/**
 * Displays an item and triggers update events
 * @param item
 * @constructor
 */
function ItemComponent(item) {
    this._compiled_template = require('./item.hbs');
    this.context = this.item = item;

    this.removeItemCallbacks = $.Callbacks('unique');

    this.updateItemCallbacks = $.Callbacks('unique');
}

ItemComponent.prototype = Object.create(stensul.Component.prototype);

/**
 * Adds behaviour to HTML elements
 * @param element
 */
ItemComponent.prototype.bindCallbacks = function (element) {

    var self = this;

    var thisItemSelector = '#item_' + this.context.id;
    var itemDeleteAction = element.find(thisItemSelector + ' .item__delete-action');
    var imageUploadAction = element.find(thisItemSelector + ' .item__image-upload-action');
    var inputWithUploadedFile = element.find(thisItemSelector + ' .item__uploaded-file');
    var itemDescription = element.find(thisItemSelector + ' .item__description');
    var itemEditDescription = element.find(thisItemSelector + ' .item__edit-description');

    // Bind to delete button click event
    itemDeleteAction.on('click', function () {
        self.removeItemCallbacks.fire(self.context);
    });

    // Bind to image upload button click event
    imageUploadAction.on('click', function () {
        inputWithUploadedFile.click();
    });

    // Initialize image upload service
    var imageUploadService = new stensul.ItemModule.ItemImageUploadService();

    // Bind to file input change event
    inputWithUploadedFile.on('change', function (event) {

        // Validate image and fire item update event
        imageUploadService.validate(
            event.target,
            null,
            function (file) {
                self.item.file = file;
                self.updateItemCallbacks.fire(self.context);
            }
        );
    });

    // Bind to item description input text click event
    itemDescription.on('click', function (event) {

        // Hide item label
        itemDescription.hide();

        // Fill text input with label value
        itemEditDescription.val(self.context.description);

        // Show text input
        itemEditDescription.show();

        // Select text input text
        itemEditDescription.select();
    });

    // TODO: Dirty hack
    var cancelling = false;

    // Bind to text input blur event
    itemEditDescription.on('blur', function (event) {

        if (cancelling) {
            cancelling = false;
            return;
        }

        // Hide text input
        itemEditDescription.hide();

        // Create new item
        var newItem = $.extend({}, self.item, {description: itemEditDescription.val()});

        // Fire update event
        self.updateItemCallbacks.fire(newItem);

        // Show item label
        itemDescription.show();
    });

    // Bind to text input enter press event
    itemEditDescription.on('keyup', function (event) {
        if (event.keyCode == 13) {
            itemEditDescription.blur();
        } else if (event.keyCode == 27) {
            cancelling = true;
            itemEditDescription.hide();
            itemDescription.show();
        }
    });


};

ItemComponent.prototype.getItem = function () {
    return this.item;
};

module.exports = ItemComponent;