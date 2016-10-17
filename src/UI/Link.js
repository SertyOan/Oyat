var dependencies = [
    'require',
    'Oyat/UI/View',
    'Oyat/Helpers'
];

define('Oyat/UI/Link', dependencies, function(require) {
    var View = require('Oyat/UI/View'),
        Helpers = require('Oyat/Helpers');

    return View.extend({
        __construct: function(options) {
            this.__parent();

            this.canHaveChildren = false;

            this.options = {
                url: false,
                isExternal: false,
                text: false
            };

            this.addType('oyat-link');
            this.elements.root.removeEventListener('click', this.handlers.click);
            this.setOptions(options);
        },
        setOptions: function(options) {
            this.__parent(options);

            Helpers.Element.empty(this.elements.root);

            this.elements.anchor = this.elements.root.appendChild(Helpers.Element.create('a', {
                href: (this.options.url ? this.options.url : 'javascript:;'),
                text: this.options.text,
                target: (this.options.isExternal ? '_blank' : '')
            }));

            this.elements.anchor.addEventListener('click', this.emit.bind(this, 'Click'));
        }
    });
});
