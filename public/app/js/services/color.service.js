/**
 *
 * @param {object} scope - a reference to the call scope
 * @returns {object}
 */
(function (scope) {
    'use strict';

    (function (name, definition) {
        if (typeof module === 'object' && module !== null && module.exports) {
            module.exports = exports = definition();
        } else if (typeof define === 'function' && define.amd) {
            define(definition);
        } else {
            scope[name] = definition();
        }
    }('Color', function () {
    	var service = {};
        
    	service.random = function () {
         	var letters = '0123456789ABCDEF';
         	var color = '#';
         
         	for (var i = 0; i < 6; i++ ) {
            	color += letters[Math.floor(Math.random() * 16)];
         	}
         
         	return color;
    	}

    	return service;
    }));
}(this));