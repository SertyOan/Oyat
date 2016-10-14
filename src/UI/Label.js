var dependencies = [
    'require',
    'Oyat/UI/View',
    'Oyat/Helpers'
];

define('Oyat/UI/Label', dependencies, function(require) {
        View = require('Oyat/UI/View'),
        Helpers = require('Oyat/Helpers');

    return View.extend({
        __construct: function(text) {
            this.__parent();
            this.addType('oyat-label');
            this.setText(text);
        },
        refresh: function() {
            Helpers.Element.setText(this.elements.body, this.text);
        },
        setText: function(text) {
            if(!Helpers.isString(text)) {
                throw new Error('Invalid arguments (`text` must be a string in Oyat/UI/Label.setText)');
            }

            this.text = text;
            this.refresh();
        }
    });
});
