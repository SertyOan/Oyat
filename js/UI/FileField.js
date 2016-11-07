var dependencies = [
    'require',
    'Oyat/UI/View',
    'Oyat/Helpers'
];

define('Oyat/UI/FileField', dependencies, function(require) {
    var View = require('Oyat/UI/View'),
        Helpers = require('Oyat/Helpers');

    return View.extend({
        __construct: function(options) {
            this.__parent();

            this.options = {
                text: 'Browse',
                uploadURL: false,
                multiple: false
            };

            this.setOptions(options);
            this.withSubViews = false; // TODO
            this.addType('oyat-filefield');
            this.uploads = [];
            this.refresh();
        },
        refresh: function() {
            this.elements.root.innerHTML = '';

            var uploadID = Math.random().toString(36).slice(2);

            var iframeNode = this.elements.root.appendChild(Helpers.Element.create('iframe', {
                src: 'javascript:;',
                name: '__upload' + uploadID,
                style: 'display:none'
            }));

            iframeNode.addEventListener('load', uploadEnd.bind(this));

            this.elements.status = this.elements.root.appendChild(Helpers.Element.create('div', {
                className: 'oyat-status',
                text: 'Uploading...'
            }));
            Helpers.Element.hide(this.elements.status);

            this.elements.browse = this.elements.root.appendChild(Helpers.Element.create('div', {
                className: 'oyat-browse'
            }));
            this.elements.form = this.elements.browse.appendChild(Helpers.Element.create('form', {
                action: this.options.uploadURL,
                enctype: 'multipart/form-data',
                method: 'POST',
                target: '__upload' + uploadID
            }));
            this.elements.input = this.elements.form.appendChild(Helpers.Element.create('input', {
                type: 'file',
                name: uploadID
            }));
            this.elements.cover = this.elements.browse.appendChild(Helpers.Element.create('div', {
                className: 'oyat-cover',
                text: this.options.text
            }));

            this.elements.input.addEventListener('change', (function() {
                Helpers.Element.hide(this.elements.browse);
                Helpers.Element.show(this.elements.submit);
                Helpers.Element.show(this.elements.cancel);
                Helpers.Element.setAttributes(this.elements.submit, {
                    text: 'Upload ' + this.elements.input.value
                });
            }).bind(this));

            this.elements.submit = this.elements.root.appendChild(Helpers.Element.create('div', {
                className: 'oyat-submit',
                text: 'Upload'
            }));
            this.elements.submit.addEventListener('click', uploadStart.bind(this));
            Helpers.Element.hide(this.elements.submit);

            this.elements.cancel = this.elements.root.appendChild(Helpers.Element.create('div', {
                className: 'oyat-cancel',
                text: 'Cancel'
            }));
            this.elements.cancel.addEventListener('click', this.refresh.bind(this));
            Helpers.Element.hide(this.elements.cancel);

            if (this.options.multiple) {
                // TODO display current files
            }

            function uploadStart() {
                Helpers.Element.hide(this.elements.browse);
                Helpers.Element.hide(this.elements.submit);
                Helpers.Element.hide(this.elements.cancel);
                Helpers.Element.show(this.elements.status);
                this.elements.form.submit();
            }

            function uploadEnd() {
                this.uploads.push({
                    uploadID: uploadID,
                    filename: this.elements.input.value
                });

                if (this.options.multiple) {
                    this.refresh();
                } else {
                    Helpers.Element.setText(this.elements.status, 'Uploaded ' + this.elements.input.value);
                }

                this.emit('FileUploaded', uploadID);
            }
        },
        getValue: function() {
            return this.options.multiple ? this.uploads : this.uploads[0];
        }
    });
});
