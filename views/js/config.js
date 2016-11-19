/**
 * 此文件用于配置所有静态参数
 */
window.ARGUMENTSCONFIG = {
    routeState:{ //路由配置
        defaultUrl:'/home',
        stateList: [
            {
                path: 'test',
                url: '/test',
                templateUrl: 'template/test.html',
                controller: 'homeCtrl'
            },
            {
                path: 'home',
                url: '/home',
                templateUrl: 'template/home.html',
                controller: 'homeCtrl'
            },
            {
                path: 'article',
                url: '/article',
                templateUrl: 'template/article.html',
                controller: 'articleCtrl'
            },
            {
                path: 'write',
                url: '/write?articleId=',
                templateUrl: 'template/write.html',
                controller: 'writeCtrl'
            },
            {
                path: 'login',
                url: '/login',
                templateUrl: 'template/login.html',
                controller: 'loginCtrl'
            },
            {
                path:'user',
                url: '/user',
                templateUrl: 'template/user.html',
                controller: 'userCtrl'
            }
        ]
    },
    controller:{ // 用于main.js加载controller模块
        'homeCtrl':'controllers/homeCtrl',
        'headerCtrl': 'controllers/headerCtrl',
        'articleCtrl':'controllers/articleCtrl',
        'writeCtrl':'controllers/writeCtrl',
        'loginCtrl': 'controllers/loginCtrl',
        'userCtrl': 'controllers/userCtrl'
    },
    //接口配置
    api:{
        baseUrl: 'http://localhost:3000/'
    }
};