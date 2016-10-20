var dependencies = [
    'require'
];

define('Oyat/Helpers', dependencies, function(require) {
    var __toString = Object.prototype.toString;

    var Helpers = {
        isElement: function(anObject) {
            return !!(anObject && anObject.nodeType == Element.ELEMENT_NODE);
        },
        isArray: function(anObject) {
            return Array.isArray(anObject);
        },
        isFunction: function(anObject) {
            return __toString.call(anObject) === '[object Function]';
        },
        isString: function(anObject) {
            return __toString.call(anObject) === '[object String]';
        },
        isNumber: function(anObject) {
            return __toString.call(anObject) === '[object Number]';
        },
        isDate: function(anObject) {
            return __toString.call(anObject) === '[object Date]';
        },
        isUndefined: function(anObject) {
            return typeof anObject === 'undefined';
        }
    };

    Helpers.Array = {
        first: function(anArray) {
            return anArray[0];
        },
        last: function(anArray) {
            return anArray[anArray.length - 1];
        },
        select: function(anArray, iterator, context) {
            var results = [];

            anArray.forEach(function(value, index) {
                if (iterator.call(context, value, index)) {
                    results.push(value);
                }
            });

            return results;
        },
        without: function(anArray) {
            var values = Array.prototype.slice.call(arguments, 1);

            return Helpers.Array.select(anArray, function(value) {
                return values.indexOf(value) == -1;
            });
        }
    };

    Helpers.Date = {
        format: function(aDate, format) {
            var string = '';

            for (var i = 0; i < format.length; i++) {
                switch (format[i]) {
                    case 'h':
                        string += date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
                        break;
                    case 'i':
                        string += date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                        break;
                    case 's':
                        string += date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
                        break;
                    case 'd':
                        string += date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                        break;
                    case 'm':
                        string += date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
                        break;
                    case 'y':
                        string += date.getFullYear();
                        break;
                    case '/':
                    case ':':
                    case '-':
                    case '.':
                    case ' ':
                        string += format[i];
                        break
                    default:
                        throw new Error('Invalid arguments (`format` is invalid in Oyat/Helpers.Date.format)');
                }
            }

            return string;
        }
    };

    Helpers.Element = {
        hasClassName: function(anElement, className) {
            return (anElement.className.length > 0 && (anElement.className == className || new RegExp("(^|\\s)" + className + "(\\s|$)").test(anElement.className)));
        },
        addClassName: function(anElement, className) {
            if (!Helpers.Element.hasClassName(anElement, className)) {
                anElement.className += (anElement.className ? ' ' : '') + className;
            }
        },
        removeClassName: function(anElement, className) {
            anElement.className = anElement.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ').trim();
        },
        toggleClassName: function(anElement, className) {
            Helpers.Element.hasClassName(anElement, className) ? Helpers.Element.removeClassName(anElement, className) : Helpers.Element.addClassName(anElement, className);
        },
        create: function(tag, attributes) {
            var anElement = document.createElement(tag);

            if (attributes) {
                Helpers.Element.setAttributes(anElement, attributes);
            }

            return anElement;
        },
        show: function(anElement) {
            anElement.style.display = '';
        },
        hide: function(anElement) {
            anElement.style.display = 'none';
        },
        cumulativeOffset: function(anElement) {
            var top = 0;
            var left = 0;

            if (anElement.parentNode) {
                do {
                    top += anElement.offsetTop || 0
                    left += anElement.offsetLeft || 0
                    anElement = anElement.offsetParent
                }
                while (anElement);
            }

            return {
                top: top,
                left: left
            };
        },
        setAttributes: function(anElement, attributes) {
            for (var i in attributes) {
                if (!attributes.hasOwnProperty(i)) {
                    continue;
                }

                switch (i) {
                    case 'html':
                        Helpers.Element.setHTML(anElement, attributes[i]);
                        break;
                    case 'text':
                        Helpers.Element.setText(anElement, attributes[i]);
                        break;
                    case 'style':
                        Helpers.Element.anElement[i].cssText = attributes[i];
                        break;
                    default:
                        anElement[i] = attributes[i];
                }
            }
        },
        setText: function(anElement, text) {
            anElement.innerHTML = Helpers.String.escapeHTML(text);
        },
        setHTML: function(anElement, html) {
            anElement.innerHTML = html;
        },
        empty: function(anElement) {
            anElement.innerHTML = '';
        }
    };

    Helpers.Object = {
        clone: function(anObject) {
            return JSON.parse(JSON.stringify(anObject));
        },
        extend: function(destination, source) {
            for (var property in source) {
                destination[property] = source[property];
            }

            return destination;
        }
    };

    Helpers.String = {
        escapeHTML: function(aString) {
            return aString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        }
    };

    return Helpers;
});