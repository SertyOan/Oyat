var dependencies = [
    'require',
    'Oyat/UI/View',
    'Oyat/Helpers'
];

define('Oyat/UI/ChoicesView', dependencies, function(require) {
    var View = require('Oyat/UI/View'),
        Helpers = require('Oyat/Helpers');

    return View.extend({
        __construct: function(options) {
            this.__parent();

            this.options = {
                choices: [],
                maxChoices: 0,
                defaultValues: []
            };

            this.setOptions(options);
            this.canHaveChildren = false;
            this.addType('oyat-choices');
            this.values = this.options.defaultValues;
            // TODO check default values are valid one
            this.refresh();
        },
        getValues: function() {
            return this.values;
        },
        setValue: function(value) {
            throw new Error('Not implemented');
            // TODO check value is a valid one
            // this._value = value;
            this.refresh();
        },
        refresh: function() {
            this.elements.root.innerHTML = '';

            for(var i = 0, c = this.options.choices.length; i < c; i++) {
                var choice = this.options.choices[i];

                switch(typeof choice) {
                    case 'string':
                        var html = choice;
                        var value = choice;
                        break;
                    case 'object':
                        var html = choice.html;
                        var value = choice.value;
                        break;
                    default:
                        throw new Error('Type error: choices should be objects or strings');
                }

                var element = this.elements.root.appendChild(Helpers.Element.create('div', { className: 'oyat-choice', html: html }));
                element.addEventListener('click', function(clicked) {
                    if(this.values.indexOf(clicked) === -1) {
                        if(this.options.maxChoices !== 0 && this.values.length >= this.options.maxChoices) {
                            this.values.splice(0, 1);
                        }

                        this.values.push(clicked);
                    }
                    else {
                        this.values = HArray.without(this.values, clicked);
                    }

                    this.refresh();
                }.bind(this, value));

                if(this.values.indexOf(value) !== -1) {
                    Helpers.Element.addClassName(element, 'oyat-selected');
                }
            }
        }
    });
});
