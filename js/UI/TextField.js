var dependencies = [
    'require',
    'Oyat/UI/View',
    'Oyat/Helpers'
];

define('Oyat/UI/TextField', dependencies, function(require) {
    var View = require('Oyat/UI/View'),
        Helpers = require('Oyat/Helpers');

    return View.extend({
        __construct: function(options) {
            this.__parent();
            this.options = {
                defaultValue: '',
                placeholder: '',
                type: 'text',
                size: false
            };

            this.setOptions(options);

            switch (this.options.type) {
                case 'text':
                case 'password':
                case 'search':
                    break;
                default:
                    this.options.type = 'text';
            }

            this.canHaveChildren = false;
            this.addType('oyat-textfield');

            this.elements.input = this.elements.root.appendChild(Helpers.Element.create('input', {
                type: this.options.type
            }));

            if (this.options.defaultValue !== false) {
                this.elements.input.value = this.options.defaultValue;
            }

            if (this.options.size) {
                this.elements.input.size = this.options.size;
            }

            if (this.options.placeholder) {
                this.elements.input.placeholder = this.options.placeholder;
            }

            this.elements.input.addEventListener('keydown', function(event) {
                this.emit('KeyDown', {
                    value: this.elements.input.value,
                    key: event.keyCode
                });
            }.bind(this))

            this.elements.input.addEventListener('keyup', function(event) {
                this.emit('KeyUp', {
                    value: this.elements.input.value,
                    key: event.keyCode
                });
            }.bind(this))

            this.elements.input.addEventListener('keypress', function(event) {
                this.emit('KeyPress', {
                    value: this.elements.input.value,
                    key: event.keyCode
                });
            }.bind(this))
        },
        getValue: function() {
            return this.elements.input.value;
        },
        getValueAsInt: function() {
            return parseInt(this.getValue(), 10);
        },
        getValueAsFloat: function() {
            return parseFloat(this.getValue());
        },
        setValue: function(value) {
            this.elements.input.value = value;
        },
        reset: function() {
            this.elements.input.value = '';
        }
    });
});
