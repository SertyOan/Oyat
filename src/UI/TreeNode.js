import View from './UI/View.js';
import Helpers from './Helpers.js';

var TreeNode = View.extend({
    __construct: function(options) {
        this.__parent();

        this.options = {
            iconClass: '',
            text: false,
            setExpanded: false, // TODO rename
            setLeaf: true // TODO rename
        };

        this.setOptions(options);

        this._expanded = !!this.options.setExpanded;
        this._isLeaf = !!this.options.setLeaf;

        this.addType('oyat-treenode');

        this.elements.wrapper = this.elements.root.appendChild(Helpers.Element.create('div', {
            className: 'oyat-wrapper'
        }));

        this.elements.action = this.elements.wrapper.appendChild(Helpers.Element.create('div', {
            className: 'oyat-action'
        }));
        this.elements.action.addEventListener('click', function() {
            if (this._expanded) {
                this.collapse();
            } else {
                this.expand();
            }
        }.bind(this));

        // TODO check iconClass
        this.elements.icon = this.elements.wrapper.appendChild(Helpers.Element.create('div', {
            className: 'oyat-icon ' + this.options.iconClass
        }));
        this.elements.icon.addEventListener('click', this.emit.bind(this, 'Select'));

        this.elements.text = this.elements.wrapper.appendChild(Helpers.Element.create('div', {
            className: 'oyat-text',
            text: this.options.text
        }));
        this.elements.text.addEventListener('click', this.emit.bind(this, 'Select'));

        this.elements.body = this.elements.root.appendChild(Helpers.Element.create('div', {
            className: 'oyat-children'
        }));

        this.refreshElements();
    },
    add: function(treeNode) {
        this.__parent(treeNode);

        this._isLeaf = false;
        treeNode.addType('oyat-child');
        this.refreshElements();

        return treeNode;
    },
    expand: function() {
        this.emit('Expand');
        this._expanded = true;
        this.refreshElements();
    },
    collapse: function() {
        this.emit('Collapse');
        this._expanded = false;
        this.refreshElements();
    },
    refreshElements: function() {
        this.removeType('oyat-expanded');
        this.removeType('oyat-collapsed');
        this.removeType('oyat-leaf');
        this.removeType('oyat-selected');

        if (this._isLeaf) {
            this.addType('oyat-leaf');
            Helpers.Element.hide(this.elements.body);
        } else {
            this.addType('oyat-parent');

            if (this._expanded) {
                this.addType('oyat-expanded');
                Helpers.Element.show(this.elements.body);
            } else {
                this.addType('oyat-collapsed');
                Helpers.Element.hide(this.elements.body);
            }
        }
    }
});

export default TreeNode;
