var dependencies = [
    'require',
    'Oyat/Observable',
    'Oyat/Helpers'
];

define('Oyat/EventBus', dependencies, function(require) {
    var Observable = require('Oyat/Observable'),
        Helpers = require('Oyat/Helpers');

    var EventBus = Observable.extend({
        __construct: function() {
            this.__parent();
            this.remanence = {};
        },
        on: function(event, callback) {
            if (this.remanence[event]) {
                callback(this.remanence[event], this);
            }

            return this.__parent(event, callback);
        },
        emit: function(event, data, options) {
            options = Helpers.Object.extend({
                remanent: false
            }, options);

            if (options.remanent) {
                this.remanence[event] = data;
            }

            return this.__parent(event, data);
        }
    });

    return EventBus;
});