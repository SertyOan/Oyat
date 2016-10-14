var dependencies = [
    'require',
    'Oyat/Class',
    'Oyat/Helpers'
];

define('Oyat/Observable', dependencies, function(require) {
    var Class = require('Oyat/Class')
        Helpers = require('Oyat/Helpers');
    
    return Class.extend({
        __construct: function() {
            this.listeners = {};
        },
        on: function(event, callback) {
            if (!Helpers.isFunction(callback)) {
                throw new Error('Invalid arguments in Oyat/Observable.on, callback parameter should be a function');
            }

            if (!this.listeners[event]) {
                this.listeners[event] = {};
            }

            do {
                var hash = Math.random().toString(36).slice(2);
            }
            while (this.listeners[event][hash]);

            this.listeners[event][hash] = callback;
            return hash;
        },
        off: function(event, hash) {
            if (this.listeners[event] && this.listeners[event][hash]) {
                delete this.listeners[event][hash];
                return true;
            }
            else {
                return false;
            }
        },
        emit: function(event, data) {
            if (this.listeners[event]) {
                var listeners = this.listeners[event];

                for (var i in listeners) {
                    if (listeners.hasOwnProperty(i)) {
                        listeners[i](data, this);
                    }
                }
            }
        }
    });
});
