define(['app'],function(app){
     app.service('bService',['$http','$q','$rootScope',
         function($http,$q,$rootScope){ // 不要在这里传$scope,service里面没有$scope!!!!
         var GOLBAL = window.ARGUMENTSCONFIG.api;
         function init(){ // 解决每次刷新之后$rootScope被清空的问题
             var userString = sessionStorage.getItem('user');
             if(userString){
                 var obj = {};
                 for(var i in userString.split(',')){
                     obj[userString.split(',')[i].split(':')[0]]= userString.split(',')[i].split(':')[1];
                 }
                 $rootScope.user = obj;
                 console.log($rootScope.user);
             }
         }
         init();
         return {
             //封装好的请求函数
             /**
              * 所有接口求情最终都是在这里完成
              * @param method
              * @param url
              * @param pramas
              * @returns {*}
              */
             request: function(method,url,pramas){
                 var method = method?method:'GET';
                 var n = $http({
                     method: method,
                     url: url,
                     data: pramas
                 });
                 return $q.when(n);
             },

             // kp *******************登录、注册**********************
             /**
              * 登录
              * @param pramas（username，password）
              * @returns {*}
              */
                login: function(params) {
                    var url = 'login';
                    return this.request('POST',url,params);
                },
             /**
              * 注册
              * @param params(username,password,email)
              * @returns {*}
              */
                register: function(params){
                    var url ='register';
                    return this.request('Post',url,params);
                },
             // kp **************** 文章接口 ***********************
             /**
              * 获取.文章的分类的
              * @param ｛｝
              * @returns {*}
              */
             getCategory: function(pramas) {
                 var url = '/json/category.json';
                 return this.request('',url,pramas);
             },
             /**
              * 获取所有文章
              * @param ｛｝
              * @returns {*}
              */
             getPosts: function(parmas) {
                 var url = 'getData';
                 return this.request('',url,parmas);
             },
             getArticleByPage: function(params){
                var url = 'getArticleByPage';
                return this.request('POST',url,params);
             },
             /**
              * 获取某个用户的所有文章
              * @param parmas
              * @returns {*}
              */
             getUserPosts: function(parmas) {
                 var url= 'getArticleByUser';
                 return this.request('Post',url,parmas);
             },
             /**
              * 提交文章
              * @param parmas
              * @returns {*}
              */
             postArticle: function(parmas){
                 var url = 'postArticle';
                 return this.request('Post',url,parmas);
             },
             /**
              * 获取一篇文章
              * @param parmas  id
              * @returns {*}
              */
             getArticle: function(params){
                 var url = 'getArticle';
                 return this.request('POST',url,params);
             },
             /**
              * 删除一篇文章
              * @param params  articleId、userName
              * @returns {*}
              */
             delArticle: function(params){
                 var url = 'delArticle';
                 return this.request('POST',url,params);
             },
             /**
              * 提交修改文章
              * @param params  接收article对象，和用户名
              * @returns {*}
              */
             editArticle: function(params) {
               var url = 'editArticle';
                 return this.request('POST',url,params);
             },
             /**
              * 点赞文章
              * @param params
              * @returns {*}
              */
             markLike:  function(params){
                 var url = 'markLike';
                 return this.request('POST',url,params);
             },
             /**
              * 发表评论
              * @param params
              * @returns {*}
              */
             addComment: function(params){
                 var url = 'addComment';
                 return this.request('POST',url,params);
             },
             /**
              * 获取评论，传入要获取的类型
              * @param id,type   Id为对应的article或者comment的id type为article、comment
              * @returns {*}
              */
             getComment: function(id,type){
                 var params = {
                     parent_id: id,
                     parent_type:type
                 },
                     url = 'getComment';
                 return this.request('POST',url,params);
             }
         }
    }]);
});