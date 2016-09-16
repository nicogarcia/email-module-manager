'use strict';

/**
 * Provides image uploading services for items
 * @constructor
 */
function ItemImageUploadService() {
}

ItemImageUploadService.prototype = {

    /**
     * Validates image dimensions and extension
     *
     * @param input
     * @param item
     * @param target
     * @param successCallback
     */
    validate: function (input, target, successCallback) {

        if (input.files && input.files[0]) {

            // Validate extension
            var type = input.files[0].type;
            if (!(type == 'image/png' || type == 'image/gif' || type == 'image/jpeg')) {

                // TODO: Feature. Add error callback instead of using alert.
                alert('Image extension must be gif, png or jpg');
                return;
            }

            // Validate dimensions

            var reader = new FileReader();

            // Subscribe load event
            reader.onload = function (e) {

                // Create invisible image holder
                var image = $('<img style="visibility:hidden; position:absolute;top:0;left:0;z-index:-1000000"/>')
                    .attr({src: e.target.result});

                // Add to DOM to have its attributes defined
                $('body').append(image).show();

                // Subscribe image load
                image.on('load', function () {
                    var width = image.width();
                    var height = image.height();

                    if (width == 320 && height == 320) {

                        if (target) {
                            target.attr('src', e.target.result);
                        }

                        if (successCallback) {
                            successCallback(input.files[0]);
                        }
                    } else {
                        // TODO: Feature. Add error callback instead of using alert.
                        alert('Uploaded image\'s dimensions should be exactly 320px height and 320px width');
                    }

                    $(image).remove();
                });

            };

            reader.readAsDataURL(input.files[0]);
        }
    }
};

module.exports = ItemImageUploadService;