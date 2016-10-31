var dependencies = [
    'require',
    'Oyat/Class',
    'Oyat/UI/View',
    'Oyat/Helpers'
]

define('Oyat/UI/Button', dependencies, function(require) {
    var Class = require('Oyat/Class'),
        View = require('Oyat/UI/View'),
        Helpers = require('Oyat/Helpers');

    return View.extend({
        __construct: function(options) {
            this.__parent();

            this.options = {
                iconClass: false,
                text: false,
                disabled: false
            };

            this.canHaveChildren = false;
            this.addType('oyat-button');

            this.elements.root.removeEventListener('click', this.handlers.click);
            this.handlers.click = function(event) {
                if (!this.options.disabled) {
                    this.emit('Click', event);
                }
            }.bind(this);
            this.elements.root.addEventListener('click', this.handlers.click);

            this.setOptions(options);
        },
        setOptions: function(options) {
            this.__parent(options);

            Helpers.Element.empty(this.elements.root);

            if (this.options.disabled) {
                Helpers.Element.addClassName(this.elements.root, 'oyat-disabled');
            } else {
                Helpers.Element.removeClassName(this.elements.root, 'oyat-disabled');
            }

            if (Helpers.isString(this.options.iconClass)) {
                this.elements.root.appendChild(Helpers.Element.create('div', {
                    className: 'oyat-icon ' + this.options.iconClass
                }));
            }

            if (Helpers.isString(this.options.text)) {
                var textNode = this.elements.root.appendChild(Helpers.Element.create('div', {
                    className: 'oyat-text',
                    html: this.options.text
                }));
            }
        }
    });
});
