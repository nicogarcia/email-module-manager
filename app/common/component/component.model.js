'use strict';

function Component(element) {
    this.element = element;
}

Component.prototype = {
    _compiled_template: null,

    compile: function () {
        this._compiled_template = Handlebars.compile(this.template);
    },

    context: null,

    display: function () {
        this.element.html(this.render());

        this.afterDisplay();
    },

    afterDisplay: function () {

    },

    render: function () {

        // If template is not compiled, compile it
        if (!this._compiled_template) {
            this.compile();
        }

        return this._compiled_template(this.context);
    },

    template: null
};

module.exports = Component;