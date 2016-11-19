define(['app'],function(app){
    app
        .directive('bDirective',['$rootScope',function($rootScope){
            return {
                //restrict: 'E',// 指令类型  E：element A：attribute M：comment C: class
                //template: ' <div class="comment-input-box">'+
                //'<div class="comment-input" contenteditable="true"><br /></div>'+
                //'<button class="btn btn-nop-nob">取消</button>'+
                //'<button class="btn btn-success comment-submit">评论</button>'+
                //'</div>',
                //replace: true //使用模板替换原始标记  指令内原本的数据将被清空
            }
        }])
        .directive('commentInput',[function(){
            return {
                restrict: 'E',// 指令类型  E：element A：attribute M：comment C: class
                template: ' <div class="comment-input-box">'+
                                '<div class="comment-input" contenteditable="true"><br /></div>'+
                                '<button class="btn btn-nop-nob">取消</button>'+
                                '<button class="btn btn-success comment-submit">评论</button>'+
                            '</div>',
                replace: true //使用模板替换原始标记  指令内原本的数据将被清空
            }
        }])
        .directive('contentEditAble', function () { //此指令器用于解决 设置了contenteditable属性的div或p等元素不能使用ng-model双向绑定的问题
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                /*输入的内容如果需要过滤，就在这个方法下过滤*/
                function deleteBr(sHtml) {
                    return sHtml.replace(/<br>/g, "");// 将<br>清除
                }
                // view -> model 视图转到数据
                element.bind('input', function () {
                    scope.$apply(function () {
                        //element.html(deleteBr(element.html()));
                        ctrl.$setViewValue(element.html());
                    });
                });

                // model -> view 数据转为视图
                ctrl.$render = function () {
                    element.html(ctrl.$viewValue);
                };

                // load init value from DOM
                ctrl.$render();
            }
        };
    });
});