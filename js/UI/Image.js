var dependencies = [
    'require',
    'Oyat/UI/View',
    'Oyat/Helpers'
];

define('Oyat/UI/Image', dependencies, function(require) {
    var View = require('Oyat/UI/View'),
        Helpers = require('Oyat/Helpers');

    return View.extend({
        __construct: function(options) {
            this.__parent();
            this.options = {
                url: false,
                text: false,
                style: false
            };

            this.canHaveChildren = false;
            this.addType('oyat-image');
            this.setOptions(options);
        },
        setOptions: function(options) {
            this.__parent(options);

            Helpers.Element.empty(this.elements.root);

            this.elements.body.appendChild(Helpers.Element.create('img', {
                src: this.options.url,
                alt: this.options.text || '',
                style: this.options.style || ''
            }));
        }
    });
});
