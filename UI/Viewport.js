import Observable from '../Observable.js';
import Helpers from '../Helpers.js';
import './Viewport.css';

var Viewport = Observable.extend({
    __construct: function(id) {
        this.element = !!id ? document.getElementById(id) : document.body;

        if (!this.element) {
            throw new Error('Invalid arguments (`id` is invalid in Oyat/UI/Viewport.__construct)');
        }

        Helpers.Element.addClassName(this.element, 'oyat-viewport');
        this.views = [];
    },
    add: function(view) {
        view.parent = this;
        this.views.push(view);
        this.element.appendChild(view.elements.root);
        view.render();
        return view;
    },
    remove: function(view) {
        this.views = Helpers.Array.without(this.views, view);
        this.element.removeChild(view.elements.root);
    },
    clear: function() {
        this.views = [];
        Helpers.Element.empty(this.element);
    }
});

export default Viewport;
