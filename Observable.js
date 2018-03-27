import Class from './Class.js';
import Helpers from './Helpers.js';

var Observable = Class.extend({
    __construct: function() {
        this.listeners = {};
    },
    on: function(event, callback) {
        if (!Helpers.isFunction(callback)) {
            throw new Error('Invalid arguments (`callback` must be a function in Oyat/Observable.on)');
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
        } else {
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

export default Observable;
