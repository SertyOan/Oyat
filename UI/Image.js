import View from '../UI/View.js';
import Helpers from '../Helpers.js';
import './Image.css';

var Image = View.extend({
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

export default Image;
