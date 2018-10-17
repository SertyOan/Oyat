import View from '../UI/View.js';
import Helpers from '../Helpers.js';
import './CheckBox.css';

var CheckBox = View.extend({
    __construct: function(options) {
        this.__parent();
        this.checked = false;
        this.options = {
            text: false,
            defaultChecked: false
        };
        this.addType('oyat-checkbox');
        this.setOptions(options);
    },
    setOptions: function(options) {
        this.__parent(options);

        this.checked = this.options.defaultChecked === true;

        Helpers.Element.empty(this.elements.root);

        this.elements.input = this.elements.body.appendChild(Helpers.Element.create('div', {
            className: 'oyat-input'
        }));

        this.elements.input.addEventListener('click', function() {
            this.checked = !this.checked;
            this.removeType('oyat-checked');

            if(this.checked) {
                this.addType('oyat-checked');
            }

            this.emit(this.checked ? 'Check' : 'Uncheck');
        }.bind(this));

        if (this.options.text) {
            this.elements.body.appendChild(Helpers.Element.create('div', {
                className: 'oyat-text',
                text: this.options.text
            }));
        }
    },
    isChecked: function() {
        return this.checked;
    },
    check: function() {
        this.checked = true;
        this.emit('Check');
    },
    uncheck: function() {
        this.checked = false;
        this.emit('Uncheck');
    }
});

export default CheckBox;
