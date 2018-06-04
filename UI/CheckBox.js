import View from '../UI/View.js';
import Helpers from '../Helpers.js';
import './CheckBox.css';

var CheckBox = View.extend({
    __construct: function(options) {
        this.__parent();
        this.options = {
            text: false,
            defaultChecked: false
        };
        this.addType('oyat-checkbox');
        this.setOptions(options);
    },
    setOptions: function(options) {
        this.__parent(options);

        Helpers.Element.empty(this.elements.root);

        this.elements.input = this.elements.body.appendChild(Helpers.Element.create('input', {
            type: 'checkbox',
            className: 'oyat-input',
            checked: this.options.defaultChecked
        }));

        this.elements.input.addEventListener('click', function() {
            this.emit(this.elements.input.checked ? 'Check' : 'Uncheck')
        }.bind(this));

        if (this.options.text) {
            this.elements.body.appendChild(Helpers.Element.create('span', {
                className: 'oyat-text',
                text: this.options.text
            }));
        }
    },
    isChecked: function() {
        return this.elements.input.checked;
    },
    check: function() {
        this.elements.input.checked = true;
        this.emit('Check');
    },
    uncheck: function() {
        this.elements.input.checked = false;
        this.emit('Uncheck');
    }
});

export default CheckBox;
