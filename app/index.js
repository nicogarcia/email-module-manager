'use strict';

// Include basic scss
require('./index.scss');

// Load third party libraries
window.$ = require('jquery');
window.Handlebars = require('handlebars');

// Load own libraries
window.stensul = require('./common/stensul.lib.js');
window.stensul.initialize();

// Web app initialization
$(document).ready(function () {

    // Select elements for container and item collection
    var container = $('#container');
    var itemCollectionElement = $('item-collection');

    // Initialize item collection
    var itemCollection = new stensul.ItemModule.ItemCollection();

    // Link item collection to Firebase collection
    new stensul.FirebaseCollection(itemCollection, 'item_collection');

    // Create item collection display component
    new stensul.ItemModule.ItemCollectionComponent(itemCollection, itemCollectionElement).display();
});