'use strict';

/**
 * Validates an item
 * @constructor
 */
function ItemValidator() {
}

ItemValidator.prototype = {
    validate: function (item) {
        var errors = [];

        if (!item.description || item.description.length == 0) {
            errors.push('Item must have description');
        }

        if (item.description && item.description.length > 300) {
            errors.push('Item length must be between 1 and 300 characters');
        }

        if (!item.file && (!item.picture || item.picture.length == 0 || item.picture == item.defaultPicture)) {
            errors.push('Item must have a picture');
        }

        // TODO: Feature. Return errors and act accordingly or trigger event
        if (errors.length) {
            alert(errors.join('\n'));
        }

        return errors.length == 0;
    }
};

module.exports = ItemValidator;