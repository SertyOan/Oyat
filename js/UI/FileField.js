define('OJS/UI/FileField', ['require', 'OJS/Class', 'OJS/UI/View', 'OJS/Helpers/Element'], function(require) {
    var Class = require('OJS/Class'),
        View = require('OJS/UI/View'),
        HElement = require('OJS/Helpers/Element');

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
            this.addType('ojs-filefield');
            this.uploads = [];
            this.refresh();
        },
        refresh: function() {
            this.elements.root.innerHTML = '';

            var uploadID = Math.random().toString(36).slice(2);

            var iframeNode = this.elements.root.appendChild(HElement.create('iframe', {
                src: 'javascript:;',
                name: '__upload' + uploadID,
                style: 'display:none'
            }));

            iframeNode.addEventListener('load', uploadEnd.bind(this));

            this.elements.status = this.elements.root.appendChild(HElement.create('div', {
                className: 'ojs-status',
                text: 'Uploading...'
            }));
            HElement.hide(this.elements.status);

            this.elements.browse = this.elements.root.appendChild(HElement.create('div', {
                className: 'ojs-browse'
            }));
            this.elements.form = this.elements.browse.appendChild(HElement.create('form', {
                action: this.options.uploadURL,
                enctype: 'multipart/form-data',
                method: 'POST',
                target: '__upload' + uploadID
            }));
            this.elements.input = this.elements.form.appendChild(HElement.create('input', {
                type: 'file',
                name: uploadID
            }));
            this.elements.cover = this.elements.browse.appendChild(HElement.create('div', {
                className: 'ojs-cover',
                text: this.options.text
            }));

            this.elements.input.addEventListener('change', (function() {
                HElement.hide(this.elements.browse);
                HElement.show(this.elements.submit);
                HElement.show(this.elements.cancel);
                HElement.setAttributes(this.elements.submit, {
                    text: 'Upload ' + this.elements.input.value
                });
            }).bind(this));

            this.elements.submit = this.elements.root.appendChild(HElement.create('div', {
                className: 'ojs-submit',
                text: 'Upload'
            }));
            this.elements.submit.addEventListener('click', uploadStart.bind(this));
            HElement.hide(this.elements.submit);

            this.elements.cancel = this.elements.root.appendChild(HElement.create('div', {
                className: 'ojs-cancel',
                text: 'Cancel'
            }));
            this.elements.cancel.addEventListener('click', this.refresh.bind(this));
            HElement.hide(this.elements.cancel);

            if (this.options.multiple) {
                // TODO display current files
            }

            function uploadStart() {
                HElement.hide(this.elements.browse);
                HElement.hide(this.elements.submit);
                HElement.hide(this.elements.cancel);
                HElement.show(this.elements.status);
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
                    HElement.setText(this.elements.status, 'Uploaded ' + this.elements.input.value);
                }

                this.emit('FileUploaded', uploadID);
            }
        },
        getValue: function() {
            return this.options.multiple ? this.uploads : this.uploads[0];
        }
    });
});