import View from '../UI/View.js';
import Helpers from '../Helpers.js';
import './TabView.css';

var TabView = View.extend({
    __construct: function() {
        this.__parent();

        this.cascadeRendering = false;
        this.tabs = {};
        this.history = []; // NOTE history of opened tabs
        this.titles = {};
        this.index = [];
        this.activeTab = null;

        this.addType('oyat-tabview');

        this.elements.tabs = this.elements.root.appendChild(Helpers.Element.create('div', {
            className: 'oyat-tabs'
        }));

        this.elements.body = this.elements.root.appendChild(Helpers.Element.create('div', {
            className: 'oyat-body'
        }));
    },
    add: function(view, options) {
        options = Helpers.Object.extend({
            id: false,
            title: false,
            closable: false
        }, options);

        if (options.id == false) {
            throw new Error('Error: id is mandatory in options in Oyat/UI/TabView.add()');
        }

        if (options.title == false) {
            throw new Error('Error: title is mandatory in options in Oyat/UI/TabView.add()');
        }

        if (this.tabs[options.id] && this.tabs[options.id] !== null) {
            throw new Error('Error: cannot add two tabs with same id (' + options.id + ') in Oyat/UI/TabView.add()');
        }

        view.hide();

        this.index[options.id] = view;

        this.tabs[options.id] = this.elements.tabs.appendChild(Helpers.Element.create('div', {
            className: 'oyat-tab'
        }));

        this.titles[options.id] = this.tabs[options.id].appendChild(Helpers.Element.create('div', {
            className: 'oyat-title',
            text: options.title
        }));

        this.titles[options.id].addEventListener('click', this.toggleTab.bind(this, options.id));

        if (options.closable) {
            var element = this.tabs[options.id].appendChild(Helpers.Element.create('div', {
                className: 'oyat-close'
            }));
            element.addEventListener('click', this.remove.bind(this, view));
        }

        return this.__parent(view);
    },
    remove: function(view) {
        var id = false;

        for (var i in this.index) {
            if (!this.index.hasOwnProperty(i)) {
                continue;
            }

            if (this.index[i] == view) {
                id = i;
                break;
            }
        }

        if (id == false) {
            throw new Error('Error: cannot remove a not added view in Oyat/UI/TabView.remove()');
        }


        if (id === this.activeTab) {
            this.activeTab = null;
        }

        this.elements.tabs.removeChild(this.tabs[id]);

        delete this.index[id];
        delete this.titles[id];
        delete this.tabs[id];

        this.history = Helpers.Array.without(this.history, id);
        this.toggleTab(Helpers.Array.last(this.history));

        this.__parent(view);
    },
    findTab: function(id) {
        return this.tabs[id];
    },
    toggleTab: function(id) {
        if (id !== this.activeTab) {
            if (!this.tabs[id]) {
                throw new Error('Error: cannot find tab (' + id + ') in Oyat/UI/TabView.toggleTab()');
            }

            this.history = Helpers.Array.without(this.history, id);
            this.history.push(id);

            if (this.activeTab !== null) {
                Helpers.Element.removeClassName(this.tabs[this.activeTab], 'oyat-active');
                this.index[this.activeTab].hide();
            }

            this.activeTab = id;
            Helpers.Element.addClassName(this.tabs[id], 'oyat-active');

            if (!this.index[id].isRendered) {
                this.index[id].render();
            }

            this.index[id].show();
        }
    },
    renameTab: function(id, title) {
        if (!this.tabs[id]) {
            throw new Error('Error: cannot find tab (' + id + ') in Oyat/UI/TabView.renameTab');
        }

        this.titles[id].innerHTML = Helpers.String.escapeHTML(title);
    }
});

export default TabView;
