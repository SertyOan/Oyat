import View from './UI/View.js';
import Helpers from './Helpers.js';

var Label = View.extend({
    __construct: function(text) {
        this.__parent();
        this.addType('oyat-label');
        this.setText(text);
    },
    setText: function(text) {
        if (!Helpers.isString(text)) {
            throw new Error('Invalid arguments (`text` must be a string in Oyat/UI/Label.setText)');
        }

        this.text = text;
        Helpers.Element.setText(this.elements.body, this.text);
    }
});

export default Label;
