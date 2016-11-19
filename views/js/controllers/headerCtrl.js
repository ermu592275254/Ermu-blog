define(['app'],function(app){
    return app.controller('headerCtrl',['$scope','$rootScope','bFactory',
        function($scope,$rootScope,bFactory){
        $scope.ctl={
            activeNum: 0,
            reload: function() {
                location.reload(true);
                console.log('11');
            },
            logOut: function() {
                bFactory.delCookie('user');
                bFactory.delSession('user');
                delete $rootScope.user;
            }
        };
        $scope.views={
            title: 'yish'
        };
        function init(){

        }
        init();
    }]);
});