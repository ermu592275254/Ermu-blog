/**
 *  创建module
 */
define(['angular'], function(angular) {
	var app = angular.module('blogApp',['ui.router','ngSanitize']);
	// app.config(function (hljsServiceProvider) {
 //  		hljsServiceProvider.setOptions({
 //    	// replace tab with 2 spaces
 //    	tabReplace: '  '
 //  		});
	// });
	return app;
});