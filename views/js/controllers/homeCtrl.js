define(['app'],function(app){
    return app.controller('homeCtrl',['$scope','$rootScope','bService','$state','bFactory',
        function($scope,$rootScope,bService,$state,bFactory){
        $scope.ctl={
            headerLiNum: 0,
            lookInfo: function(article) {
                sessionStorage.setItem('article',article._id);
                $state.go('article');
            },
            page: 1,
            pageSize:10,
            pageCount: 1,
            pageCountList: [],
            goToPage: function(pageNum){
                $scope.ctl.page = pageNum === 0 ? $scope.ctl.page+1:pageNum === -1?$scope.ctl.page -1:pageNum;
                $scope.req.getArticleByPage();
            },
            toWrite: function() {
                if($rootScope.user){
                    $state.go('write');
                } else {
                    $state.go('login');
                }
            }
        };
        $scope.views={
            article: {},
            articleList:[],
            categoryList:[]
        };
        $scope.req = {
            getArticleByPage: function(){
                var params = {
                    page: $scope.ctl.page,
                    pageSize: $scope.ctl.pageSize
                };
                bService.getArticleByPage(params).then(function(data){
                    console.log(data);
                    if(data && data){
                        $scope.views.articleList = data.data.results;
                        $scope.ctl.pageCount = data.data.pageCount;
                        $scope.ctl.page = data.data.pageNumber;
                        $scope.ctl.pageCountList.length = $scope.ctl.pageCount;
                        for(var i = 0; i< $scope.ctl.pageCountList.length;i++){
                            $scope.ctl.pageCountList[i] = i+1;
                        }
                    }
                })
            }
        };

        function init(){
            bService.getCategory({}).then(function (data) {
                $scope.views.categoryList = data.data;
            });
            $scope.req.getArticleByPage();
            if(!$rootScope.user){
                $rootScope.user = bFactory.getCookie('user');
            }
        }
        init();
    }]);
});