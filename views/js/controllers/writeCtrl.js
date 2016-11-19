define(['app'],function(app){
    return app.controller('writeCtrl',['$scope','$rootScope','$http','bService','$stateParams','$state',
        function($scope,$rootScope,$http,bService,$stateParams,$state){
        var articleId = $stateParams.articleId;
        $scope.views={
            categoryList: [],
            typeList:[],
            article:{},
            title: '',
            content: '',
            category: '选择分类',
            type: '选择二级分类'
        };
        $scope.ctl = {
            checkForm: function() { //表单验证
                if(!$scope.views.title){
                    alert('请输入标题');
                    return true;
                }
                if($scope.views.category === '选择分类'){
                    alert('请选择分类');
                    return true;
                }
                if($scope.views.type === '选择二级分类'){
                    alert('请选择二级分类');
                    return true
                }
                if(!document.getElementById('editor').value){
                    alert('好歹输入点内容吧');
                    return true;
                }
                return false;
            },
            isEdit: false
        };
        $scope.req = {
            postArticle: function(){
                if($scope.ctl.checkForm()){
                    return false;
                }
                var parmas = {
                    author: $rootScope.user.name,
                    title: $scope.views.title,
                    firstSort:$scope.views.category,
                    secondSort: $scope.views.type,
                    post: document.getElementById('editor').value
                };
                console.log(parmas);
                bService.postArticle(parmas).then(function(data){
                    if(data && data.status === 200) {
                        alert('发表成功');
                        $state.go('home');
                    }else{
                        alert('oh，no~请求失败了')
                    }
                });
            },
            editArticle: function() {
                if($scope.ctl.checkForm()){
                    return false;
                }
                var params = {
                    article:{
                        _id: articleId,
                        author: $rootScope.user.name,
                        title: $scope.views.title,
                        firstSort:$scope.views.category,
                        secondSort: $scope.views.type,
                        post: document.getElementById('editor').value
                    },
                   userName: $rootScope.user.name
                };
                bService.editArticle(params).then(function(data){
                    if(data && data.data){
                        if(data.data.ok){
                            alert('修改成功');
                            $state.go('home');
                        } else{
                            alert(data.data.message);
                        }
                    }
                })
            },
            getArticle: function(){
                var params = {
                    id: articleId,
                    isEdit: true
                };
                bService.getArticle(params).then(function (data){
                    if(data && data.data){
                        $scope.views.article = data.data;
                        $scope.views.category = $scope.views.article.firstSort;
                        $scope.views.type = $scope.views.article.secondSort;
                        $scope.views.title = $scope.views.article.title;
                        $('.editor').val($scope.views.article.post);
                        $scope.ctl.isEdit = true;
                    }
                })
            }
        };
        function init() {
            bService.getCategory({}).then(function (data) {
                $scope.views.categoryList = data.data;
            });
            console.log($stateParams.articleId);
            if(articleId){
                $scope.req.getArticle();
            }
        }
        init();
    }]);
});