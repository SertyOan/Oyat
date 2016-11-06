var dependencies = [
    'require',
    'Oyat/UI/View',
    'Oyat/Helpers'
];

define('Oyat/UI/Panel', dependencies, function(require) {
    var View = require('Oyat/UI/View'),
        Helpers = require('Oyat/Helpers');

    return View.extend({
        __construct: function(options) {
            this.__parent();

            this.options = {
                title: false,
                collapsible: false,
                collapsed: false
            };

            this.addType('oyat-panel');

            this.elements.bar = this.elements.root.appendChild(Helpers.Element.create('div', {
                className: 'oyat-bar'
            }));
            this.elements.body = this.elements.root.appendChild(Helpers.Element.create('div', {
                className: 'oyat-body'
            }));

            this.setOptions(options);
        },
        setOptions: function(options) {
            this.__parent(options);

            Helpers.Element.empty(this.elements.bar);

            if (this.options.collapsible) {
                this.elements.collapser = this.elements.bar.appendChild(Helpers.Element.create('div', {
                    className: 'oyat-collapser'
                }));
                this.elements.collapser.addEventListener('click', function() {
                    Helpers.Element.toggleClassName(this.elements.root, 'oyat-collapsed');
                }.bind(this));
            }

            if (this.options.title) {
                this.elements.title = this.elements.bar.appendChild(Helpers.Element.create('div', {
                    className: 'oyat-title'
                }));
                this.elements.title.innerHTML = this.options.title;
            }

            if (this.options.collapsed) {
                Helpers.Element.toggleClassName(this.elements.root, 'oyat-collapsed');
            }
        }
    });
});
