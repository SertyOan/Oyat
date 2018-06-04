import View from '../UI/View.js';
import Helpers from '../Helpers.js';
import './FileField.css';

var FileField = View.extend({
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

export default FileField;
