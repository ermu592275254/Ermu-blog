function init() {
    var blogPaths = {
        // lib包
        'jquery': '../lib/jquery203',
        'angular': '../lib/angular.min',
        'angular-sanitize': '../lib/angular-sanitize.min',//解决markdown生成的html，可以使用指令ng-bind-html来显示
        'less': '../lib/less-1.3.3.min',
        'angular-ui-router': '../lib/angular-ui-router.min',// 控制路由，比angular自带的route好用
        'bootstrap': '../lib/bootstrap/js/bootstrap.min',
        //'highlight':'http://cdn.bootcss.com/highlight.js/8.0/highlight.min',
        //  杂项

        'appRoute': 'routes/appRoute',
        'bDirective':'directives/bDirective',
        'bFactory': 'services/bFactory',
        'bService': 'services/bService',
        // controller
        'app': 'controllers/app'
    };

    var loadList = [
        'jquery',
        'angular',
        'angular-ui-router',
        'angular-sanitize',
        'app',
        'appRoute',
        'less',
        'bootstrap',
        'bService',
        'bFactory',
        'bDirective'
    ];
// 增加controller路径
    for (var p in window.ARGUMENTSCONFIG.controller) {
        if (window.ARGUMENTSCONFIG.controller.hasOwnProperty(p)) {
            blogPaths[p] = window.ARGUMENTSCONFIG.controller[p];
        }
    }
    for (var p in window.ARGUMENTSCONFIG.controller) {
        if (window.ARGUMENTSCONFIG.controller.hasOwnProperty(p)) {
            loadList.push(p);
        }
    }
    require.config({
        baseUrl: 'js/',
        paths: blogPaths,
        shim: { // shim 用来配置不兼容的模块
            'angular': {
                exports: 'angular'
            },
            'angular-ui-router': {
                deps: ['angular'], //　依赖的模块
                exports: 'angular-ui-router'　//　模块名称
            },
            'angular-sanitize': {
                deps: ['angular'],
                exports: 'angular-sanitize'
            },
            'bootstrap': {
                deps: ['jquery'],
                exports: 'bootstrap'
            },
        }
    });
    require(loadList, function ($, angular) {
        $(function () {
            angular.bootstrap(document, ['blogApp']);
        });
    });
}

init();