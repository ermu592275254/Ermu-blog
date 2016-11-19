define(['app'],function(app){
    app.factory('bFactory',['$rootScope','$state',function($rootScope,$state){
        return {
            //将一些共用的方法(比如：数组操作、字符截取转换等)写在这里
            /**
             * 生成cookie
             * @param name
             * @param value
             * @constructor 在浏览器端生成cookie，在浏览器关闭的时候cookie就会被清除，所以生成cookie应该在服务器端。
             */
            SetCookie: function(name,value) {
                var Days = 30; //此 cookie 将被保存 30 天
                var exp = new Date(); //new Date("December 31, 9998");
                exp.setTime(exp.getTime() + Days*24*60*60*1000);
                var valString = '';
                for (var p in value) {
                    if (value.hasOwnProperty(p)) {
                        valString += p+':'+value[p]+',';
                    }
                }
                document.cookie = name + "="+ valString + ";expires=" + exp.toGMTString();
            },
            getCookie:function(name){
                var arr = document.cookie.match(name);
                if(arr != null){
                    var obj = {};
                    for(var i in arr.input.split(',')){
                        obj[arr.input.split(',')[i].split(':')[0]]= arr.input.split(',')[i].split(':')[1];
                    }
                    return obj;
                }
            },
            delCookie:function (name){
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                var cookie=this.getCookie(name);
                if(cookie!=null) document.cookie= name + "="+cookie+";expires="+exp.toGMTString();
            },
            /**
             * 设置session
             * @param name
             * @param value
             */
            setSession: function(name,value) {
                var valString = '';
                for (var p in value) {
                    if (value.hasOwnProperty(p)) {
                        valString += p+':'+value[p]+',';
                    }
                }
                sessionStorage.setItem(name,valString);
            },
            delSession: function(name) {
                sessionStorage.removeItem(name);
            },
            isLogin: function(){ //判断是否登陆
                if($rootScope.user){
                    return true;
                } else {
                    $state.go('login');
                }
            }
        }
    }])
        .filter('cutContent',function(){ //切割字符串，100字节
            return function(content) {
                return  content.substring(0,100);
            }
        });
});