import View from './UI/View.js';
import Helpers from './Helpers.js';

var DateField = View.extend({
    __construct: function(options) {
        this.__parent();

        this.options = {
            label: false,
            defaultValue: false,
            disabled: false
        };

        this.setOptions(options);
        this.addType('oyat-datefield');

        this.elements.field = this.elements.root.appendChild(Helpers.Element.create('div', {
            className: 'oyat-field'
        }));
        this.elements.field.appendChild(Helpers.Element.create('div', {
            className: 'oyat-icon'
        }));

        this.elements.input = this.elements.field.appendChild(Helpers.Element.create('div', {
                className: 'oyat-input'
            }))
            .appendChild(Helpers.Element.create('input', {
                type: 'text',
                readOnly: true,
                value: (this.options.defaultValue ? this.options.defaultValue : '')
            }));

        this.elements.root.removeEventListener('click', this.handlers.click);

        this.handlers.click = function(event) {
            if (!this.options.disabled) {
                this.showCalendar(event);
            }
        }.bind(this);
        this.elements.field.addEventListener('click', this.handlers.click);

        this.calendar = new Calendar();
        this.calendar.render();
        this.calendar.hide();

        this.elements.root.appendChild(this.calendar.elements.root);

        this.calendar.on('Select', function(selection) {
            this.calendar.hide();
            document.body.removeEventListener('click', this.handlers.calendar);

            this.elements.input.value = selection.date;
            this.emit('Select', selection);
        }.bind(this));
    },
    showCalendar: function(event) {
        event.stopPropagation();
        event.preventDefault();

        this.calendar.show();
        this.handlers.calendar = document.body.addEventListener('click', this.hideCalendar.bind(this));
    },
    hideCalendar: function(event) {
        var target = event.target;

        while (target != this.calendar.elements.root) {
            if (!target.parentNode) {
                break;
            }

            target = target.parentNode;
        }

        if (target != this.calendar.elements.root) {
            this.calendar.hide();
            document.body.removeEventListener('click', this.handlers.calendar);
        }
    },
    getValue: function() {
        return this.elements.input.value;
    }
});

export default DateField;
