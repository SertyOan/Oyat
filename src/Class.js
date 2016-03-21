define('Oren/Class', ['require'], function(require) {
    var Class = function() {
        this.__construct.apply(this, arguments);
    };

    Class.prototype.__construct = function() {};

    function extend(parentClass, methods) {
        var subClass = function() {
            this.__construct.apply(this, arguments);
        };

        for (var method in parentClass.prototype) {
            if (typeof parentClass.prototype[method] === 'function') {
                if (methods[method]) {
                    subClass.prototype[method] = (function(m) {
                        return function() {
                            this.__parent = parentClass.prototype[m];
                            var value = methods[m].apply(this, arguments);
                            delete this.__parent;
                            return value;
                        };
                    })(method);
                } else {
                    subClass.prototype[method] = parentClass.prototype[method];
                }
            }
        }

        for (var method in methods) {
            if (!methods.hasOwnProperty(method)) {
                continue;
            }

            if (!subClass.prototype[method]) {
                subClass.prototype[method] = (function(m) {
                    return function() {
                        return methods[m].apply(this, arguments);
                    };
                })(method);
            }
        }

        subClass.extend = function(methods) {
            return extend(subClass, methods);
        };

        return subClass;
    };

    Class.extend = function(methods) {
        return extend(Class, methods);
    };

    return Class;
});
