'use strict';

require('./add-item.scss');

/**
 * Component used as a form to add new items
 * @constructor
 */
function AddItemComponent() {

    this._compiled_template = require('./add-item.hbs');

    this.initializeItem();
}

AddItemComponent.prototype = Object.create(stensul.Component.prototype);

/**
 * Callbacks holder and firable to generate events
 */
AddItemComponent.prototype.itemAddedCallbacks = $.Callbacks('unique');

/**
 * Item initialization
 */
AddItemComponent.prototype.initializeItem = function () {
    this.item = new stensul.ItemModule.Item();

    this.context = this.item;
};

/**
 * HTML events binding
 * @param element
 */
AddItemComponent.prototype.bindCallbacks = function (element) {
    var self = this;

    // Bind to "Add item" button click event
    element.find('.add-item-form .add-item').on('click', function () {

        // Load item description from text input element
        self.item.description = $('.add-item__description').val();

        // Load file from file input element
        var file = element.find('.item__uploaded-file')[0].files[0];

        self.item.file = file;

        // Fire "item added" event
        self.itemAddedCallbacks.fire(self.item);

        // Reinitialize item
        self.initializeItem();
    });

    // Bind to image upload button click event
    element.find('.add-item-form .item__image-upload-action').on('click', function () {

        // Call file input click event to show file choose dialog
        element.find('.add-item-form .item__uploaded-file').click();
    });

    var imageUploadService = new stensul.ItemModule.ItemImageUploadService();

    element.find('.add-item-form .item__uploaded-file').on('change', function (event) {

        // Validate image and then assign to item
        imageUploadService.validate(
            event.target,
            element.find('.add-item-form .item__uploaded-picture'),
            function (file) {
                self.item.file = file;
            }
        );
    });
};

module.exports = AddItemComponent;