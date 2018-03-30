import View from '../UI/View.js';
import Helpers from '../Helpers.js';

var Textarea = View.extend({
    __construct: function(options) {
        this.__parent();

        this.canHaveChildren = false;

        this.options = {
            rows: 3,
            defaultValue: false
        };

        this.setOptions(options);

        this.addType('oyat-textarea');
        this.elements.input = this.elements.root.appendChild(Helpers.Element.create('textarea', {
            rows: this.options.rows
        }));

        this.elements.input.addEventListener('keydown', function(event) {
            this.emit('KeyDown', {
                value: this.elements.input.value,
                key: event.keyCode
            });
        }.bind(this));

        this.elements.input.addEventListener('keyup', function(event) {
            this.emit('KeyUp', {
                value: this.elements.input.value,
                key: event.keyCode
            });
        }.bind(this));

        this.elements.input.addEventListener('keypress', function(event) {
            this.emit('KeyPress', {
                value: this.elements.input.value,
                key: event.keyCode
            });
        }.bind(this));

        if (this.options.defaultValue) {
            this.setValue(this.options.defaultValue);
        }
    },
    getValue: function() {
        return this.elements.input.value;
    },
    setValue: function(value) {
        this.elements.input.value = value;
    },
    reset: function() {
        this.elements.input.value = '';
    },
    focus: function() {
        if (!this.isRendered) {
            throw new Error('cannot be called before render in Oyat/UI/Textarea.focus');
        }

        this.elements.input.focus();
    },
    getSelection: function() {
        var start = this.elements.input.selectionStart;
        var end = this.elements.input.selectionEnd;
        return this.elements.input.value.substring(start, end);
    },
    hasSelection: function() {
        var start = this.elements.input.selectionStart;
        var end = this.elements.input.selectionEnd;
        return start != end;
    },
    replaceSelection: function(string) {
        var start = this.elements.input.selectionStart;
        var end = this.elements.input.selectionEnd;
        var text = this.elements.input.value;
        this.elements.input.value = text.substring(0, start) + string + text.substring(end, text.length);
    },
    insertAtCaret: function(string) {
        var start = this.elements.input.selectionStart;
        var text = this.elements.input.value;
        this.elements.input.value = text.substring(0, start) + string + text.substring(start, text.length);
    }
});

export default Textarea;
