import View from '../UI/View.js';
import Helpers from '../Helpers.js';

var ComboBox = View.extend({
    __construct: function(options) {
        this.__parent();

        this.options = {
            records: [],
            valueKey: 'value',
            legendKey: 'legend',
            defaultValue: null,
            defaultText: null
        };

        this.setOptions(options);

        this.addType('oyat-combobox');
        this.canHaveChildren = false;
        this.expanded = false;
        this.selectedIndex = null;
        this.collapseCallback = this.collapse.bind(this);

        this.elements.field = this.elements.body.appendChild(Helpers.Element.create('div', {
            className: 'oyat-field'
        }));
        this.elements.field.addEventListener('click', this.expandOrCollapse.bind(this));
        this.elements.action = this.elements.field.appendChild(Helpers.Element.create('div', {
            className: 'oyat-action'
        }));
        this.elements.text = this.elements.field.appendChild(Helpers.Element.create('div', {
            className: 'oyat-text'
        }));
        this.elements.dropdown = this.elements.root.appendChild(Helpers.Element.create('div', {
            className: 'oyat-dropdown'
        }));
        Helpers.Element.hide(this.elements.dropdown);

        if (this.options.defaultValue !== null) {
            for (var i = 0, c = this.options.records.length; i < c; i++) {
                if (this.options.records[i][this.options.valueKey] == this.options.defaultValue) {
                    this.setSelected(i);
                }
            }
        }
    },
    getValue: function() {
        return this.selectedIndex === null ? null : this.options.records[this.selectedIndex][this.options.valueKey];
    },
    setValue: function(value) {
        for (var i = 0, c = this.options.records.length; i < c; i++) {
            if (this.options.records[i][this.options.valueKey] == value) {
                this.selectIndex(i);
                break;
            }
        }
    },
    getRecord: function() {
        return this.selectedIndex === null ? null : this.options.records[this.selectedIndex];
    },
    hasSelection: function() {
        return this.selectedIndex !== null;
    },
    setSelected: function(index) {
        this.selectedIndex = index;
        var legend = Helpers.isFunction(this.options.legendKey) ? this.options.legendKey(this.options.records[this.selectedIndex]) : this.options.records[this.selectedIndex][this.options.legendKey];
        this.elements.text.innerHTML = legend; // TODO sanitize
    },
    setRecords: function(records) {
        this.options.records = records;
    },
    reset: function() {
        this.collapse();
        this.selectedIndex = null;
        this.elements.text.innerHTML = '';
    },
    addRecords: function(records) {
        for (var i = -1, c = records.length; ++i < c;) {
            this.addRecord(records[i]);
        }
    },
    addRecord: function(record) {
        this.options.records.push(record);
    },
    expandOrCollapse: function(event) {
        if (this.expanded) {
            this.collapse(event);
        } else {
            this.expand(event);
        }
    },
    expand: function(event) {
        if(event) {
            event.preventDefault();
            event.stopPropagation();
        }

        document.body.addEventListener('click', this.collapseCallback);

        this.elements.dropdown.innerHTML = '';

        var rows = Helpers.Element.create('div', {
            className: 'oyat-rows'
        });

        if (this.options.records.length > 0) {
            for (var i = 0, c = this.options.records.length; i < c; i++) {
                var legend = Helpers.isFunction(this.options.legendKey) ? this.options.legendKey(this.options.records[i]) : this.options.records[i][this.options.legendKey];
                var row = rows.appendChild(Helpers.Element.create('div', {
                    className: 'oyat-row',
                    text: legend
                })); // TODO find a way to secure HTML
                row.addEventListener('click', function(index, event) {
                    event.preventDefault()
                    event.stopPropagation()
                    this.selectIndex(index)
                }.bind(this, i));
            }
        } else {
            rows.appendChild(Helpers.Element.create('div', {
                className: 'oyat-unselectable oyat-row',
                html: '&nbsp;'
            }));
        }

        this.elements.dropdown.appendChild(rows);
        Helpers.Element.show(this.elements.dropdown);
        this.expanded = true;
    },
    collapse: function() {
        document.body.removeEventListener('click', this.collapseCallback);
        Helpers.Element.hide(this.elements.dropdown);
        this.expanded = false;
    },
    selectIndex: function(index) {
        if (this.expanded) {
            this.collapse();
        }

        this.setSelected(index);
        this.emit('Select', {
            index: index,
            record: this.getRecord(),
            value: this.getValue()
        });
    }
});

export default ComboBox;
