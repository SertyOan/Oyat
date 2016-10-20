var dependencies = [
    'require',
    'Oyat/Observable',
    'Oyat/Helpers'
];

define('Oyat/UI/Window', dependencies, function(require) {
    var Observable = require('Oyat/Observable'),
        Helpers = require('Oyat/Helpers');

    var zIndex = 0;
    var mask = document.body.appendChild(Helpers.Element.create('div', {
        className: 'oyat-mask oyat-hidden'
    }));

    return Observable.extend({
        __construct: function(options) {
            this.__parent();
            this.children = [];
            this.isRendered = false;

            this.options = {
                over: false,
                closable: false,
                modal: false,
                draggable: false,
                resizable: false,
                autoCenter: true,
                title: '',
                top: '20px',
                left: '20px',
                width: 'auto',
                height: 'auto'
            };

            this.setOptions(options);

            this.elements = {};
            this.elements.root = Helpers.Element.create('div', {
                className: 'oyat-window',
                style: 'top:10px;left:10px'
            });

            this.elements.bar = this.elements.root.appendChild(Helpers.Element.create('div', {
                className: 'oyat-bar'
            }));

            this.elements.title = this.elements.bar.appendChild(Helpers.Element.create('div', {
                className: 'oyat-title',
                text: this.options.title
            }));

            if (this.options.closable) {
                this.elements.buttons = this.elements.bar.appendChild(Helpers.Element.create('div', {
                    className: 'oyat-buttons'
                }));
                this.elements.buttons.appendChild(Helpers.Element.create('div', {
                    className: 'oyat-close'
                }));
                this.elements.buttons.addEventListener('click', this.close.bind(this));
            }

            if (this.options.draggable) {
                // TODO
            }

            this.elements.wrapper = this.elements.root.appendChild(Helpers.Element.create('div', {
                className: 'oyat-wrapper'
            }));

            this.elements.wrapper.style.width = this.options.width;
            this.elements.wrapper.style.height = this.options.height;

            this.elements.body = this.elements.wrapper.appendChild(Helpers.Element.create('div', {
                className: 'oyat-body'
            }));
        },
        setOptions: function(options) {
            this.options = Helpers.Object.extend(this.options, options);
        },
        render: function() {
            if (this.isRendered) {
                throw new Error('Error: cannot render a window twice in Oyat/UI/Window.render()');
            }

            for (var i = 0, c = this.children.length; i < c; i++) {
                this.elements.body.appendChild(this.children[i].elements.root);
                this.children[i].render();
            }

            this.isRendered = true;
            this.emit('Render');

            if (this.options.autoCenter) {
                // TODO
                /*
					 var deltaX = this.elements.root.getWidth() / 2;
                var deltaY = this.elements.root.getHeight() / 2;
                this.elements.root.setStyle({
                    top: '50%',
                    left: '50%',
                    marginLeft: deltaX + 'px',
                    marginTop: deltaY + 'px'
                });
					 */
            } else {
                Helpers.Element.setAttributes({
                    style: 'top:' + this.options.top + ';left:' + this.options.left
                });
            }
        },
        add: function(view) {
            view.parent = this;
            this.children.push(view);

            if (this.isRendered) {
                this.elements.body.appendChild(view.elements.root);
                view.render();
            }

            return view;
        },
        remove: function(view) { // TODO review
            if (view.isRendered) {
                this.elements.body.removeChild(view.elements.root);
            }

            this.children = HArray.without(this.children, component);
        },
        clear: function() { // TODO ensure to call remove
            this.elements.body.innerHTML = '';
            this.children = [];
        },
        open: function() { // TODO add a viewport as optionnal parameter and open in document.body if not specified
            if (this.options.modal) {
                zIndex++;
                mask.style.zIndex = zIndex;
                Helpers.Element.removeClassName(mask, 'oyat-hidden');
            }

            zIndex++;
            document.body.appendChild(this.elements.root);
            this.elements.root.style.zIndex = zIndex;
            this.render();
        },
        close: function() {
            zIndex--;

            if (this.options.modal) {
                zIndex--;
                mask.style.zIndex = zIndex;

                if (zIndex == 0) {
                    Helpers.Element.addClassName(mask, 'oyat-hidden');
                }
            }

            document.body.removeChild(this.elements.root);
            this.emit('WindowClose');
        },
        setText: function(text) {
            this.elements.body.innerHTML = Helpers.String.escapeHTML(text);
        },
        setHTML: function(html) {
            this.elements.body.innerHTML = html;
        }
    });
});