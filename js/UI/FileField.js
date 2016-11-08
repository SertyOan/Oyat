var dependencies = [
    'require',
    'Oyat/UI/View',
    'Oyat/Helpers'
];

define('Oyat/UI/FileField', dependencies, function(require) {
    var View = require('Oyat/UI/View'),
        Helpers = require('Oyat/Helpers');

    return View.extend({
        __construct: function(options) {
            this.__parent();

            this.options = {
                html: 'Choose file',
                disabled: false
            };

            this.setOptions(options);

            this.canHaveChildren = false;
            this.addType('oyat-filefield');

            this.elements.input = this.elements.root.appendChild(Helpers.Element.create('input', {
                type: 'file'
            }));

            this.elements.input.addEventListener('change', function() {
                this.emit('FileSelected', this.elements.input.files[0]);
            }.bind(this));

            this.elements.over = this.elements.root.appendChild(Helpers.Element.create('div', {
                className: 'oyat-over',
                html: this.options.html
            }));

            if (this.options.disabled) {
                this.elements.input.disabled = 'disabled';
            }
        },
        reset: function() {
            this.elements.input.value = '';
        },
        getValue: function() {
            return this.elements.input.value;
        },
        enable: function() {
            this.elements.input.disabled = false;
        },
        disable: function() {
            this.elements.input.setAttributes({
                disabled: 'disabled'
            });
        }
    });
});
