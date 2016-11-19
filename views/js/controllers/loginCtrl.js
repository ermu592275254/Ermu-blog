define(['app'],function(app){
    return app.controller('loginCtrl',['$scope','bService','$rootScope','$state','bFactory',
        function($scope,bService,$rootScope,$state,bFactory){
        $scope.views = {
            username: '',
            password: '',
            remember: false,
            register:{
                name:'',
                email:'',
                password:'',
                rePassword:'',
                agree: false
            }
        };
        $scope.ctl = {
            checkName: 2,
            checkEmail: 2,
            checkPassword: 2,
            checkRepassword: 2,
            checkRegister: function() {
                if($scope.ctl.checkName === 1 && $scope.ctl.checkEmail === 1 && $scope.ctl.checkPassword === 1 && $scope.ctl.checkRepassword === 1){
                    return true;
                }
                return false;
            }
        };
        //监听并验证name值
        $scope.$watch('views.register.name',function(newV,oldV){
            var re = new RegExp(/^[a-zA-z][a-zA-Z0-9_]{5,20}$/);
            if(newV === ''){
                $scope.ctl.checkName = 2;
                return;
            }
                $scope.ctl.checkName = re.test(newV)?1:0;
            //console.log(re.test(newV));
        });
        //监听并验证email值
        $scope.$watch('views.register.email',function(newV,oldV){
            var re = new RegExp(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/);
            if(newV === ''){
                $scope.ctl.checkEmail = 2;
                return;
            }
            $scope.ctl.checkEmail = re.test(newV)?1:0;
            //console.log(re.test(newV));
        });
        $scope.$watch('views.register.password',function(newV,oldV){
            if(newV === ''){
                $scope.ctl.checkPassword = 2;
                return;
            }
            $scope.ctl.checkPassword = newV.length>5?1:0;
        });
        $scope.$watch('views.register.rePassword',function(newV,oldV){
            if(newV === ''){
                $scope.ctl.checkRepassword = 2;
                return;
            }
            $scope.ctl.checkRepassword = newV === $scope.views.register.password?1:0;
        });
        $scope.req = {
            submit: function() {
                var params = {
                    name: $scope.views.username,
                    remember: $scope.views.remember,
                    password: $scope.views.password
                };
                console.log(params);
                bService.login(params).then(function(data){
                    if(data.data && data.data.code === 0){
                        alert(data.data.message);
                    }else{
                        alert('登录成功！');
                        $rootScope.user = data.data;
                        bFactory.setSession('user',data.data);
                        if($scope.views.remember){
                            bFactory.SetCookie('user',data.data);
                        }
                        $state.go('home');
                    }
                });
            },
            register: function() {
                if(!$scope.ctl.checkRegister()){
                    alert('输入项错误，请正确填写！');
                    return;
                }
                var params ={
                    name: $scope.views.register.name,
                    password: $scope.views.register.password,
                    email: $scope.views.register.email
                };
                bService.register(params).then(function(data){
                    if(data.data && data.data.code === 0){
                        alert(data.data.message);
                    }else{
                        alert('注册成功！');
                        $rootScope.user = data.data;
                    }
                });
            }
        }
    }]);
});