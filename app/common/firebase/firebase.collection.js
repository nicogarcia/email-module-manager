'use strict';

function FirebaseCollection(collection, refUrl) {
    this.ref = FirebaseDb.ref(refUrl);
    this.storageRef = FirebaseStorage.ref(refUrl);

    this._collection = collection;

    this.init();

    this.loadItems();
}

FirebaseCollection.prototype = {

    init: function () {

        var self = this;

        // Change item collection ID generator to Firebase's
        this._collection.setIdGenerator(function () {
            return self.ref.push().key
        });

        /** Register all listeners for each local collection operation **/

        this._collection.updateItemCallbacks.add(function (item, origin) {
            if (origin != 'firebase') {
                self.updateItem(item);
            }
        });

        this._collection.removeItemCallbacks.add(function (item, origin) {
            if (origin != 'firebase') {
                self.removeItem(item);
            }
        });

        this._collection.updatedMultipleItemsCallbacks.add(function (items, origin) {
            if (origin != 'firebase') {
                self.updateMultipleItems(items);
            }
        });
    },

    updateItem: function (item) {
        var self = this;

        // If item has file
        if (item.file) {

            // Store file in Google Storage
            self.storageRef.child(item.id).put(item.file, {cacheControl: 'max-age=31536000'})

            // And then update the remote item
                .then(function (snapshot) {
                    delete item.file;

                    var itemWithURL = $.extend({}, item, {picture: snapshot.downloadURL});

                    self.ref.child(itemWithURL.id).set(itemWithURL);
                });

            return;
        }

        this.ref.child(item.id).set(item);
    },

    removeItem: function (item) {
        this.ref.child(item.id).remove();
    },

    updateMultipleItems: function (items) {
        var updates = {};

        // Accumulate all updates to make them at once
        for (var i = 0; i < items.length; i++) {
            updates[items[i].id] = items[i];
        }

        this.ref.update(updates);
    },

    loadItems: function () {
        var self = this;

        // Subscribe whole collection value retrieval
        this.ref.once('value').then(function (snapshot) {
            var items = snapshot.val();

            // Download initial data
            for (var key in items) {
                if (Object.prototype.hasOwnProperty.call(items, key)) {
                    var val = items[key];
                    self._collection.updateItem(
                        new stensul.ItemModule.Item(val.description, val.picture, val.id),
                        'firebase'
                    );
                }
            }

            /** Register listeners **/

            // Added item listener
            self.ref.on('child_added', function (data) {
                var item = data.val();
                self._collection.updateItem(
                    new stensul.ItemModule.Item(item.description, item.picture, item.id),
                    'firebase'
                );
            });

            // Updated item listener
            self.ref.on('child_changed', function (data) {
                var item = data.val();
                self._collection.updateItem(
                    new stensul.ItemModule.Item(item.description, item.picture, item.id),
                    'firebase'
                );
            });

            // Removed item listener
            self.ref.on('child_removed', function (data) {
                var item = data.val();
                self._collection.removeItem(item, 'firebase');
            });
        });
    }
};

module.exports = FirebaseCollection;