var dependencies = [
    'require',
    'Oyat/Helpers'
]

define('Oyat/XHR', dependencies, function(require) {
    var Helpers = require('Oyat/Helpers');

    var XHR = {};

    XHR.callBasic = function(url, options) {
        // TODO check url

        options = Helpers.Object.extend({
            method: 'GET',
            asynchronous: true,
            headers: {},
            parameters: null,
            onException: function(e) {
                throw e;
            }
        }, options || {});

        options.method = options.method.toUpperCase();

        if (options.parameters) {
            if (!Helpers.isString(options.parameters)) {
                var pairs = [];

                for (var i in options.parameters) {
                    if (!options.parameters.hasOwnProperty(i)) {
                        continue;
                    }

                    var key = encodeURIComponent(i);
                    var value = options.parameters[i];

                    if (Array.isArray(value)) {
                        for (var j = 0, c = value.length; j < c; j++) {
                            pairs.push(key + '=' + encodeURIComponent(value[j]));
                        }
                    } else {
                        pairs.push(key + '=' + encodeURIComponent(value));
                    }
                }

                options.parameters = pairs.join('&');
            }

            if (options.method === 'GET') {
                url += (url.match(/\?/) === null ? '?' : '&') + parameters;
            }
        }

        var transport = new XMLHttpRequest();

        if (options.onCreate) {
            options.onCreate();
        }

        try {
            transport.open(options.method, url, options.asynchronous);

            transport.onreadystatechange = function() {
                if(transport.readyState !== 4) {
                    return;
                }

                var status = transport.status || 0;
                status = status === 1223 ? 204 : status; // NOTE for MSIE
                var success = !status || (status >= 200 && status < 300) || status == 304;

                try {
                    var callback = options['on' + status] || options['on' + (success ? 'Success' : 'Failure')] || function() {};
                    callback(transport);
                } catch (e) {
                    options.onException(e);
                }
            };

            if (options.method === 'POST' && !options.headers['Content-Type']) { // TODO check case insensitive
                options.headers['Content-type'] = this.options.contentType;

                if(this.options.encoding) {
                    options.headers['Content-type'] += '; charset=' + this.options.encoding;
                }
            }

            for (var name in options.headers) {
                if (options.headers.hasOwnProperty(name)) {
                    transport.setRequestHeader(name, options.headers[name]);
                }
            }

            var body = options.method === 'POST' ? options.postBody || parameters : null;
            transport.send(body);
        } catch (e) {
            options.onException(e);
        }
    };

    XHR.callJSONRPC = function(url, method, parameters, onSuccess, options) {
        var id = Math.random().toString(36).slice(2);

        options = Helpers.Object.extend({
            onException: function(e) {
                throw e;
            }
        }, options || {});

        XHR.callBasic(url, {
            method: 'POST',
            onException: options.onException,
            postBody: JSON.stringify({
                id: id,
                method: method,
                params: parameters ? parameters : null
            }),
            onSuccess: function(transport) {
                try {
                    var object = JSON.parse(transport.responseText);

                    if (!object || !('id' in object) || !('result' in object) || !('error' in object)) {
                        throw new Error('response is misformed'); // TODO harmonize
                    }

                    if (object.id != id) {
                        throw new Error('request id and response id do not match'); // TODO harmonize
                    }

                    if (!!object.error) {
                        // TODO check error structure (should have message and code)
                        options.onException(object.error);
                    }
                    else {
                        onSuccess(object.result);
                    }
                } catch (e) {
                    options.onException({ message: e.message, code: 0 });
                }
            },
            onFailure: function(transport) {
                options.onException({ message: 'HTTP error', code: transport.status });
            },
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        });
    };

    return XHR;
});
