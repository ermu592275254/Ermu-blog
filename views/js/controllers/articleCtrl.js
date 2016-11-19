define(['app'],function(app){
    return app.controller('articleCtrl',['$scope','$rootScope','bService','bFactory','$state',
        function($scope,$rootScope,bService,bFactory,$state){
        $scope.ctl={
            activeNum: 0,
            showActCmtIpt: false,
            showCommentNum: '',
            oldDirectiveId: '',
            showComment: function(index){
                if(this.showCommentNum === index){
                    this.showCommentNum = -1; // 这个是用来实现二次点击同个评论按钮关闭评论的
                }else{
                    this.showCommentNum = index;
                }
                $scope.req.getComment($scope.views.commentList[index]._id,'comment');
            },
            toEdit: function() {
                $state.go('write', {articleId: $scope.views.article._id});
            }
        };
        $scope.views={
            article: {}, //文章
            inputContent: '',
            commentList:[], // 文章的评论
            commentCList: [], //评论的评论
            commentInputValue: '' // 评论文章的输入框的值
        };
        $scope.req = {
            getArticle: function() {
                var params = {
                    id: sessionStorage.getItem('article')
                };
                bService.getArticle(params).then(function (data){
                    $scope.views.article = data.data;
                    $scope.req.getComment($scope.views.article._id,'article');
                })
            },
            delArticle: function(){
                var params = {
                    articleId: $scope.views.article._id,
                    userName: $rootScope.user.name
                };
                bService.delArticle(params).then(function(data){
                    if(data.data.ok === 1){
                        alert('删除成功！');
                        $state.go('home');
                    } else {
                        console.log(data);
                        alert(data.data.message);
                    }
                });
            },
            // todo 点赞功能需要考虑怎样储存点赞的用户，如何方便存取，减少耗时。
            markLike: function(){
                var params = {
                    id: sessionStorage.getItem('article'),
                    user: $rootScope.user.name
                };
                //bService.markLike(params).then(function(data) {
                //    console.log(data);
                //});
                alert('待实现');
            },
            addComment: function(id,target_user,type,tags,index) {
                bFactory.isLogin();
                var content = '',
                    isReply = false;
                if(tags === 1){
                    content = $scope.views.inputContent;
                    $scope.views.inputContent = '';
                } else if(tags === 2){
                    content = $scope.views.commentList[index].inputContent;
                    $scope.views.commentList[index].inputContent = '';
                } else{
                    content = $scope.views.commentCList[index].inputContent;
                    $scope.views.commentCList[index].inputContent = '';
                    isReply = true;
                }
                var params = {
                    owner_user: $rootScope.user.name, //此评论的创建者
                    target_user: target_user, // 此评论的对象
                    content: content,
                    parent_id: id, // 文章或评论的id
                    parent_type: type, // 评论是针对文章还是评论
                    isReply: isReply, //是不是回复
                    article_id: $scope.views.article._id
                };
                console.log(params);
                bService.addComment(params).then(function(data){
                    if(data){
                        alert(data.data.message);
                    }
                    $scope.req.getComment(id,type);
                    $scope.ctl.showActCmtIpt = false;
                });
            },
        getComment: function(id,type) {
            bService.getComment(id,type).then(function(data) {
                    if(data && data.data){
                        if(type === 'article'){
                            $scope.views.commentList = data.data;
                            for(var commentItem in $scope.views.commentCList){
                                commentItem.inputContent = '';
                            }
                        } else if(type === 'comment'){
                            $scope.views.commentCList = data.data;
                            for(var commentCItem in $scope.views.commentCList){
                                commentCItem.showInput = false;
                                commentCItem.inputContent = '';
                            }
                        }
                    }
                })
            }
        };
        function init(){
            $scope.req.getArticle();
        }
        init();
    }]);
});