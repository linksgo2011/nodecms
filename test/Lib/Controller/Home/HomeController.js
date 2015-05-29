/**
 * HomeController
 * @return
 */
module.exports = Controller("Home/HomeController", function() {
	"use strict";
	return {
		indexAction: function() {

		},
		__before:function(action){
            console.log(action);
		},
        __after: function(action){
            console.log(action);
        }
	};
});