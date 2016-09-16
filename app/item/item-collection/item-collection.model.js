'use strict';

function ItemCollection(id) {
    this.id = id || Math.floor(Math.random() * 1000);

    this.updateItemCallbacks = $.Callbacks('unique');

    this.removeItemCallbacks = $.Callbacks('unique');

    this.updatedMultipleItemsCallbacks = $.Callbacks('unique');
}

ItemCollection.prototype = {

    /**
     * Stores items by key
     */
    _data_set: {},

    /**
     * Sets id generator
     * @param idGenerator
     */
    setIdGenerator: function (idGenerator) {
        this.idGenerator = idGenerator;
    },

    /**
     * Updates an item
     * @param item
     * @param origin flag to indicate where the update was generated
     */
    updateItem: function (item, origin) {

        var id = item.id || this.idGenerator();

        if (!(new window.stensul.ItemModule.ItemValidator).validate(item)) {
            return;
        }

        // Set generated id and add to dataset
        item.id = id;
        this._data_set[id] = item;

        // Trigger update event
        this.updateItemCallbacks.fire(item, origin);
    },

    /**
     * Get an array of collection items
     * @returns {Array}
     */
    getItems: function () {
        var self = this;

        var items = Object.keys(this._data_set).sort().map(function (key) {
            return self._data_set[key];
        });

        return items;
    },

    /**
     * Removes an item
     * @param item
     * @param origin flag to indicate where the update was generated
     */
    removeItem: function (item, origin) {
        if (!this._data_set[item.id]) {
            return;
        }

        delete this._data_set[item.id];

        this.removeItemCallbacks.fire(item, origin);
    },

    /**
     * Swaps items in a sorted way
     * All items between swapped ones are shifted
     * @param sourceId
     * @param targetId
     */
    swapItems: function (sourceId, targetId) {
        // Get item array from sorted keys
        var itemArray = Object.keys(this._data_set).sort();

        // Get source by id
        var source = this._data_set[sourceId];

        // Compute target and source indices from item array
        var targetIndex = itemArray.indexOf(targetId);
        var sourceIndex = itemArray.indexOf(sourceId);

        // Compute swap direction 
        var dir = sign(targetIndex - sourceIndex);

        var tempDataSet = {};

        // Shift position of all items between source and target 
        for (var i = sourceIndex; i * dir < targetIndex * dir; i += dir) {
            var stepSource = itemArray[i];
            var next = itemArray[i + dir];

            tempDataSet[stepSource] = this._data_set[next];
            tempDataSet[stepSource].id = stepSource;
        }

        // Assign source to target
        tempDataSet[targetId] = source;
        tempDataSet[targetId].id = targetId;

        // Overwrite keys of current data set with temporary data set
        $.extend(this._data_set, tempDataSet);

        var array = [];

        // Generate array from temp data set (updated items)
        for (var key in tempDataSet) {
            if (Object.prototype.hasOwnProperty.call(tempDataSet, key)) {
                array.push(tempDataSet[key]);
            }
        }

        this.updatedMultipleItemsCallbacks.fire(array);
    }
};

// TODO: Move this or use polyfill
function sign(x) {
    x = +x; // convert to a number
    if (x === 0 || isNaN(x)) {
        return x;
    }
    return x > 0 ? 1 : -1;
}

module.exports = ItemCollection;