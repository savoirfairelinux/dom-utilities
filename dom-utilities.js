// DOM Utilities
// A mashup of functions gleaned everywhere to code in lightweight vanilla Javascript (internet explorer 8 gte).
// This is a toolkit, so take what you need and comment or delete the rest.
// Don't load unused code!

var du = (function(win) {
    'use strict';

    // @param {Object} `out`
    // @return {Object} `out`
    // @usage du.doExtend({}, objA, objB);
    // @about Merge objects. Equivalent to jQuery.extend()
    // @source <http://youmightnotneedjquery.com/#extend>
    function doExtend(out) {
        var key;
        var i;

        out = out || {};

        for (i = 1; i < arguments.length; i++) {
            if (!arguments[i]) {
                continue;
            }

            for (key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    out[key] = arguments[i][key];
                }
            }
        }

        return out;
    }

    // @param {String} `eventType` String containing the type of event
    // @param {Node} `context` The DOM context of the query
    // @return {Array} An array with element nodes
    // @usage du.queryAll('.slide', document.getElementById('slider'));
    // @source <http://lea.verou.me/2015/04/jquery-considered-harmful/>
	function queryAll(selector, context) {
		return Array.prototype.slice.call((context || document).querySelectorAll(selector));
    }

    // @param {Node} `el` The base element
    // @param {Object} `attrs` The key/value list of attributes
    // @return {Node} `el`
    // @usage du.setAttrs(el, {'role' : 'tab', 'tabindextab' : '0', ...});
    // @about Setting multiple attributes to an element
    function setAttrs(el, attrs) {
        var key;

        if (isElement(el) && isObject(attrs)) {
            for(key in attrs) {
                if (attrs.hasOwnProperty(key)) {
                    el.setAttribute(key, attrs[key]);
                }
            }
        } else {
            console.log('Error "' + el + '" should be a DOM element!!');
            console.log('Error "' + attrs + '" should be an Object!!');
        }
    }

    // @param {Node} `el` The base element
    // @param {String} `eventType` String containing the type of event
    // @param {Object} `handler` Object that receives a notification or a JavaScript function
    // @return {Object} `handler`
    // @usage du.setEvent(el, 'click', myJsFunction);
    // @source <http://youmightnotneedjquery.com/#on>
    // @about addEventListener with a fallback for IE 8 lte
    function setEvent(el, eventType, handler) {
        if (window.addEventListener) {
            el.addEventListener(eventType, handler, false);
        } else {
            el.attachEvent('on' + eventType, function() {
                handler.call(el);
            });
        }
    }

    // @param {Object} `elList` A collections of nodes
    // @param {String} `eventType` String containing the type of event
    // @param {Object} `handler` Object that receives a notification or a JavaScript function
    // @return {Object} `handler`
    // @usage du.setEventList(document.querySelectorAll('li'), 'click', doSomethingFunction);
    // @about addEventListener on list of elements
    function setEventList(elList, event, handler) {
        var lengthOf = elList.length;

        while(lengthOf--) {
            setEvent(elList[lengthOf], event, handler);
        }
    }

    // @param {Object} `array` Must be an array
    // @param {Node} `item` An element from the array
    // @return {Number} The index of the `item`
    // @usage du.getIndex(myArray, this);
    // @source <http://youmightnotneedjquery.com/#index_of>
    // @about Array.indexOf for IE 8 gte
    function getIndex(array, item) {
        var lengthOf = array.length;

        while(lengthOf--) {
            if (array[lengthOf] === item) {
                return lengthOf;
            }
        }

        return -1;
    }

    // @param  {Node} `el` The base element
    // @param  {String} `selector` The class, id, data attribute, or tag to look for
    // @return {Node} HTMLElement from the `selector` param || {Boolean} false
    // @usage du.getClosest(el, '.my-selector');
    // @source <http://gomakethings.com/ditching-jquery#climb-up-the-dom>
    // @about Get closest DOM element up the tree that contains a class, ID, data attribute, or tag.
    function getClosest(el, selector) {
        // Variables
        var firstChar = selector.charAt(0);
        var supports = 'classList' in document.documentElement;
        var attribute, value;

        // If selector is a data attribute, split attribute from value
        if (firstChar === '[') {
            selector = selector.substr(1, selector.length - 2);
            attribute = selector.split('=');

            if (attribute.length > 1) {
                value = true;
                attribute[1] = attribute[1].replace(/"/g, '').replace(/'/g, '');
            }
        }

        // Get closest match
        for (; el && el !== document && el.nodeType === 1; el = el.parentNode) {
            // If selector is a class
            if (firstChar === '.') {
                if (supports) {
                    if (el.classList.contains(selector.substr(1))) {
                        return el;
                    }
                } else {
                    if (new RegExp('(^|\\s)' + selector.substr(1) + '(\\s|$)').test(el.className)) {
                        return el;
                    }
                }
            }

            // If selector is an ID
            if (firstChar === '#') {
                if (el.id === selector.substr(1)) {
                    return el;
                }
            }

            // If selector is a data attribute
            if (firstChar === '[') {
                if (el.hasAttribute(attribute[0])) {
                    if (value) {
                        if (el.getAttribute(attribute[0]) === attribute[1]) {
                            return el;
                        }
                    } else {
                        return el;
                    }
                }
            }

            // If selector is a tag
            if (el.tagName.toLowerCase() === selector) {
                return el;
            }
        }

        return null;
    }

    // @param {Node} `el` The base element
    // @return {Number} The largest measurement height
    // @usage du.getHeight(document.getElementById('myNav'));
    function getHeight(el) {
        return Math.max(el.scrollHeight, el.offsetHeight, el.clientHeight);
    }

    // @param {Node} `el` The base element
    // @param {String} `className` The class name to be add
    // @return {Node} `el` with `classname`
    // @usage du.setClass(document.querySelector('button'), 'myNewStateClass');
    // @source <http://youmightnotneedjquery.com/#add_class>
    // @about Add a class to an element
    function setClass(el, classname) {
        if (el.classList) {
            el.classList.add(classname);
        } else {
            el.className += ' ' + classname;
        }

        return;
    }

    // @param {Node} `el` The base element
    // @param {String} `className` The class name to be remove
    // @return {Node} `el` without `classname`
    // @usage du.unsetClass(document.querySelector('[data-header]'), 'thatRemovableClass');
    // @source <http://youmightnotneedjquery.com/#remove_class>
    // @about Remove a class from an element
    function unsetClass(el, classname) {
        if (el.classList) {
            el.classList.remove(classname);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + classname.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }

        return;
    }

    // @param {Node} `el` The base element
    // @param {String} `className` The class name to be test
    // @return {Boolean} True if `classname` is present
    // @usage du.hasClass(document.getElementById('thatID'), 'aStateClass');
    // @source <http://youmightnotneedjquery.com/#has_class>
    function hasClass(el, classname) {
        if (el.classList) {
            return el.classList.contains(classname);
        } else {
            return new RegExp('(^| )' + classname + '( |$)', 'gi').test(el.className);
        }
    }

    // @param {Node} `el` The base element
    // @param {String} `className` The class name to be toggle
    // @return {Node} `el` with or without `classname`
    // @usage du.toggleClass(document.body, 'state--remove-scrollbar');
    // @about Toogle a class true if an element has a specific class
    function toggleClass(el, classname) {
        if (du.hasClass(el, classname)) {
            return unsetClass(el, classname);
        } else {
            return setClass(el, classname);
        }
    }


    // @param {Object} `fnCallback` The function to debounce
    // @param {Number} `delay` The setTimeout delay in milisecond
    // @return {Object} `fnCallback`
    // @usage du.setEvent(myButton, 'keyup', du.setDebounce(fireThatFunction, 1000));
    // @source <http://www.grafikart.fr/tutoriels/javascript/debounce-throttle-642>
    // @about Limits the rate at which a function can fire
    function setDebounce(fnCallback, delay) {
        var timer;

        return function() {
            var args = arguments;
            var context = this;

            clearTimeout(timer);

            timer = setTimeout(function() {
                fnCallback.apply(context, args);
            }, delay);
        };
    }

    // @param {Object} `fnCallback` The function to debounce
    // @param {Number} `delay` The setTimeout delay in milisecond
    // @return {Object} `fnCallback`
    // @usage window.addEventListener('scroll', du.setThrottle(function(e) {...}, 50));
    // @source <http://www.grafikart.fr/tutoriels/javascript/debounce-throttle-642>
    // @about Reduce the amount of times a function can run
    function setThrottle(fnCallback, delay) {
        var last;
        var timer;

        return function() {
            var context = this;
            var now = +new Date();
            var args = arguments;

            if (last && now < last + delay) {
                clearTimeout(timer);

                timer = setTimeout(function() {
                    last = now;
                    fnCallback.apply(context, args);
                }, delay);

            } else {
                last = now;

                fnCallback.apply(context, args);
            }
        };
    }

    // @param {Object} `obj` The item to test
    // @return {Boolean} True if `obj` is an Node.ELEMENT_NODE
    // @usage du.isElement(thatItem);
    // @source <http://underscorejs.org/#isElement>
    // @about Is a given value a DOM element
    function isElement(obj) {
        return !!(obj && obj.nodeType === 1);
    }

    // @param {Object} `obj` The item to test
    // @return {Boolean} True if `obj` is an Object
    // @usage du.isObject(anotherItem);
    // @source <http://underscorejs.org/#isObject>
    // @about Is a given variable an Object
    function isObject(obj) {
        var type = typeof obj;

        return type === 'function' || type === 'object' && !!obj;
    }

    // @param {Node} `el` The base element
	// @param {String} `eventType` The event type or name
    // @usage du.triggerEvent(element, 'mousedown');
    // @source <http://youmightnotneedjquery.com/#trigger_native>
    function triggerEvent(el, eventType) {
        if (document.createEvent) {
            var event = document.createEvent('HTMLEvents');

            event.initEvent(eventType, true, false);

            el.dispatchEvent(event);
        } else {
            el.fireEvent('on' + eventType);
        }
	}

    // @param {Node} `el` The base element
	// @param {String} `eventType` The event type or name
	// @param {Object} `eventData` The detail property. Data associated with the event
	// @usage du.triggerCustomEvent(element, 'mousedown', [myBigFatData, 'Hello Goodbye!']);
    // @source <http://youmightnotneedjquery.com/#trigger_custom>
    function triggerCustomEvent(el, eventType, eventData) {
        var customEvent;

		if (window.CustomEvent) {
			customEvent = new CustomEvent(eventType, {detail: eventData});

		} else {
			customEvent = document.createEvent('CustomEvent');

			customEvent.initCustomEvent(eventType, true, true, eventData);
		}

		el.dispatchEvent(customEvent);
	}

    // @param {Node} `el` The base element
    // @return {Boolean} True if `el` is in viewport
    // @usage du.isElementInViewport(document.getElementbyid('myId'));
    // @about Check if an element is in the viewport
    function isElementInViewport(el) {
        var elRect = el.getBoundingClientRect();

        return (
            elRect.top >= 0
                && elRect.left >= 0
                && elRect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
                && elRect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    return {
        doExtend : doExtend,
        queryAll : queryAll,
        setAttrs : setAttrs,
        setEvent : setEvent,
        setEventList : setEventList,
        getIndex : getIndex,
        getClosest : getClosest,
        getHeight : getHeight,
        setClass : setClass,
        unsetClass : unsetClass,
        hasClass : hasClass,
        toggleClass : toggleClass,
        setDebounce : setDebounce,
        setThrottle : setThrottle,
        isElement : isElement,
        isObject : isObject,
        triggerEvent : triggerEvent,
        triggerCustomEvent : triggerCustomEvent,
        isElementInViewport : isElementInViewport
    };
})(window);
