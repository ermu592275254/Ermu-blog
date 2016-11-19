/**
 * 配置路由文件
 */
define(['app','angular'],function(app, angular){
    return app.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider) {
        var global = window.ARGUMENTSCONFIG.routeState;
        $urlRouterProvider.otherwise(global.defaultUrl);
        angular.forEach(global.stateList, function (item) {
            $stateProvider.state(item.path, {
                url: item.url,
                templateUrl: item.templateUrl,
                controller: item.controller
            });
        });
    }]);
});