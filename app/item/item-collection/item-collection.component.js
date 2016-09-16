'use strict';

require('./item-collection.scss');

/**
 * Displays an item colection using item components and
 * an add item component. It also keeps itself synchronized
 * with collection model.
 *
 * @param itemCollection Item collection model
 * @param element
 * @constructor
 */
function ItemCollectionComponent(itemCollection, element) {
    stensul.Component.call(this, element);

    this._collection = itemCollection;

    var self = this;

    // Create component to add items
    this.createAddItemComponent(self);

    // Subscribe to item collection model events
    this.subscribeToCollectionEvents(self);

    // Initialize Sortable library properties
    this.initializeSortableProperties(self);
}

ItemCollectionComponent.prototype = Object.create(stensul.Component.prototype);

/**
 * Custom template
 */
ItemCollectionComponent.prototype._compiled_template = require('./item-collection.hbs');

/**
 * Item component list
 * @type {Array}
 */
ItemCollectionComponent.prototype.itemComponents = [];

/**
 * Sortable instance
 * @type {null}
 */
ItemCollectionComponent.prototype.sortable = null;

/**
 * Add item form creation
 * @param self
 */
ItemCollectionComponent.prototype.createAddItemComponent = function (self) {
    self.addItemFormComponent = new stensul.ItemModule.AddItemComponent();

    // Subscribe to added item event
    self.addItemFormComponent.itemAddedCallbacks.add(function (item) {
        self._collection.updateItem(item);
    });
};

/**
 * Subscribes to collection model events
 * @param self
 */
ItemCollectionComponent.prototype.subscribeToCollectionEvents = function (self) {

    // Updated item
    self._collection.updateItemCallbacks.add(function (item, origin) {
        self.itemUpdated(item);
    });

    // Removed item
    self._collection.removeItemCallbacks.add(function (item) {
        self.itemRemoved(item);
    });

    // Multiple items update
    self._collection.updatedMultipleItemsCallbacks.add(function (item) {
        self.itemUpdated(item);
    });
};

/**
 * Sortable properties initialization
 * @param self
 */
ItemCollectionComponent.prototype.initializeSortableProperties = function (self) {
    self.sortableOptions = {
        animation: 250,
        forceFallback: true,
        handle: '.item__drag-handle',
        draggable: '.item',
        onEnd: function (event) {
            if (!event.oldIndex || !event.newIndex || (event.oldIndex == event.newIndex)) {
                return;
            }

            event.oldIndex -= 1;
            event.newIndex -= 1;

            self.onSwap(event);
        }
    };
};

/**
 * Customized rendering by rendering sub components
 * @returns {*}
 */
ItemCollectionComponent.prototype.render = function () {
    var self = this;

    var renderedItems = [];
    self.itemComponents = [];

    var items = this._collection.getItems();

    // Render all items as ItemComponents
    $.each(items, function (i, item) {
        var itemComponent = new stensul.ItemModule.ItemComponent(item);

        itemComponent.removeItemCallbacks.add(function (item) {
            self._collection.removeItem(item, 'item-collection');
        });

        itemComponent.updateItemCallbacks.add(function (item) {
            self._collection.updateItem(item, 'item-collection');
        });

        renderedItems.push(itemComponent.render());
        self.itemComponents.push(itemComponent);
    });

    var renderedForm = this.addItemFormComponent.render();

    this.context = {items: renderedItems.join(''), count: items.length, addItemForm: renderedForm};

    return stensul.Component.prototype.render.call(this);
};

/**
 * Hook called after display generates new items
 * to be able to bind callbacks to them
 */
ItemCollectionComponent.prototype.afterDisplay = function () {
    var self = this;

    // Bind each ItemComponent's callbacks
    $.each(this.itemComponents, function (index, itemComponent) {
        itemComponent.bindCallbacks(self.element);
    });

    // Bind AddItemForm callbacks
    this.addItemFormComponent.bindCallbacks(self.element);

    // Destroy sortable
    if (this.sortable) {
        this.sortable.destroy();
    }

    // Re-create sortable
    this.sortable = Sortable.create(this.element.find('.item-collection')[0], this.sortableOptions)
};

/**
 * Item updated event handler
 * @param item
 */
ItemCollectionComponent.prototype.itemUpdated = function (item) {

    // TODO: Feature. Update just necessary components
    this.display();
};

/**
 * Item removed event handler
 * @param item
 */
ItemCollectionComponent.prototype.itemRemoved = function (item) {
    var self = this;

    // Animate item removal
    $('#item_' + item.id).fadeOut(300, function () {
        $(this).remove();
        self.display();
    });
};

/**
 * Sortable swap event handler
 * @param event
 */
ItemCollectionComponent.prototype.onSwap = function (event) {

    // Compute source and target components
    var source = this.itemComponents[event.oldIndex].getItem();
    var target = this.itemComponents[event.newIndex].getItem();

    // Make collection model swap items
    this._collection.swapItems(source.id, target.id);

    // Reload display
    this.display();
};

module.exports = ItemCollectionComponent;

