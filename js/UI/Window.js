var dependencies = [
    'require',
    'Oyat/UI/View',
    'Oyat/Helpers'
];

define('Oyat/UI/Window', dependencies, function(require) {
    var View = require('Oyat/UI/View'),
        Helpers = require('Oyat/Helpers');

    var zIndex = 50;

    // TODO set zIndex on show instead of __construct
    // TODO decrement zIndex on hide

    return View.extend({
        __construct: function(options) {
            this.__parent();

            zIndex++;

            this.options = {
                closable: false,
                modal: false,
                draggable: false,
                resizable: false,
                autoCenter: true,
                title: '',
                top: '0',
                left: '0',
                width: 'auto',
                height: 'auto'
            };

            this.setOptions(options);

            this.elements = {};

            if(this.options.modal) {
                this.elements.root = Helpers.Element.create('div', {
                    className: 'oyat-window-modal',
                    style: 'z-index:' + zIndex
                });

                zIndex++;

                this.elements.mask = this.elements.root.appendChild(Helpers.Element.create('div', {
                    className: 'oyat-window-mask',
                    style: 'z-index:' + zIndex
                }));

                zIndex++;

                this.elements.window = this.elements.root.appendChild(Helpers.Element.create('div', {
                    className: 'oyat-window',
                    style: 'z-index:' + zIndex
                }));
            }
            else {
                this.elements.root = Helpers.Element.create('div', {
                    className: 'oyat-window',
                    style: 'z-index:' + zIndex
                });
                this.elements.window = this.elements.root;
            }

            this.elements.window.style.top = this.options.top;
            this.elements.window.style.left = this.options.left;

            var hasTopBar = !!this.options.closable || !!this.options.title;

            if(hasTopBar) {
                this.elements.bar = this.elements.window.appendChild(Helpers.Element.create('div', {
                    className: 'oyat-bar'
                }));
            }

            if(this.options.title) {
                this.elements.title = this.elements.bar.appendChild(Helpers.Element.create('div', {
                    className: 'oyat-title',
                    text: this.options.title
                }));
            }

            if (this.options.closable) {
                this.elements.buttons = this.elements.bar.appendChild(Helpers.Element.create('div', {
                    className: 'oyat-buttons'
                }));
                this.elements.buttons.appendChild(Helpers.Element.create('div', {
                    className: 'oyat-close'
                }));
                this.elements.buttons.addEventListener('click', this.hide.bind(this));
            }

            if (this.options.draggable) {
                // TODO
            }

            this.elements.wrapper = this.elements.window.appendChild(Helpers.Element.create('div', {
                className: 'oyat-wrapper'
            }));

            this.elements.window.style.width = this.options.width;
            this.elements.wrapper.style.height = this.options.height;

            this.elements.body = this.elements.wrapper.appendChild(Helpers.Element.create('div', {
                className: 'oyat-body'
            }));

            this.elements.root.style.display = 'none';
        }
    });
});
