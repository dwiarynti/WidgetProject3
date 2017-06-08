"use strict";

angular.module('app').controller('appController',
    ['$scope', '$rootScope', 'appmanagementResource', 'userResource','authsettingResource','notificationmanagementResource',
        function ($scope, $rootScope, appmanagementResource, userResource, authsettingResource, notificationmanagementResource) {
            var userresource = new userResource();            
            var appmanagementresource = new appmanagementResource();  
            var authsettingresource = new authsettingResource();                    
            var notificationmanagementresource = new notificationmanagementResource();
            $scope.state = 'unauthorized';
            $scope.loginobj = {username:"", password:""};
            $scope.registerobj = {username:"", password:""};
            $scope.menuItems = [];
            $rootScope.userobj = {id:0,authorized:"", username:"", role:"", siteid:""};
            $scope.errmessage = "";
            $rootScope.authenticationStatus = true;
            $scope.notificationnumber = 0;

            //check authentication status (on/off)
            authsettingresource.$init(function(data){
                // console.log(data);
                if(data.success){
                    $scope.state = data.obj ? 'unauthorized':'authorized';
                    $rootScope.authenticationStatus = data.obj;
                    $scope.notificationnumber = data.totalnotif;
                    if(data.obj){
                        $scope.getSession();
                    }else{
                        $scope.initMenu();
                    }
                }
            });

            $scope.getSession = function(){
                userresource.$session(function(data){
                    // console.log(data);
                    $scope.state = data.result.authorized;
                    $rootScope.userobj.role = data.result.role
                    $rootScope.userobj.username = data.result.username;
                    $rootScope.userobj.id = data.result.userid;
                    $rootScope.userobj.siteid = data.result.siteid;
                    $scope.loginobj.username = data.result.username;
                    if($scope.state == 'authorized' && $rootScope.userobj.role == "Admin"){
                        $scope.initMenu();
                    }else{
                        $scope.getUserPage($rootScope.userobj.id);
                    }
                    // console.log($scope.state);
                });
            }

            $scope.signIn = function () {
                userresource.username = $scope.loginobj.username;
                userresource.password = $scope.loginobj.password;
                userresource.$login(function(data){
                    console.log(data);
                    $rootScope.userobj = data.obj;
                    if(data.success){
                        $scope.state = 'authorized';
                        if(data.obj.role == "Admin"){
                             $scope.initMenu();
                        }
                        // else if(){

                        // }
                        else{
                            $scope.getUserPage(data.obj.id);
                        }
                        $scope.errmessage = "";         
                        
                    }else{
                        $scope.errmessage = data.obj;
                    }
                });
                
            };

            $scope.signUp = function(){
                userresource.username = $scope.registerobj.username;
                userresource.password = $scope.registerobj.password;
                userresource.$register(function(data){
                    console.log(data);
                    if(data.success){
                        $scope.state = 'authorized';
                        $scope.errmessage = "";         
                        $scope.loginobj = $scope.registerobj;           
                    }else{
                        $scope.errmessage = data.message;
                    }
                });                
            }

            $scope.getUserPage = function(userid){
                appmanagementresource.$getbyuser({_id:userid},function(data){
                    // console.log(data);
                    $scope.menuItems=[];
                    angular.forEach(data.obj, function (obj) {
                        $scope.menuItems.push({
                            label: obj.pagename, href: '/prevpage/' + obj.id, icon: 'fa-dashboard', isGroup: false, submenuItems: []
                        });
                    });
                });
            }




            $rootScope.addedNewApp = false;

            $scope.$watch(function(){ return $rootScope.addedNewApp }, function () {                
                //console.log($rootScope.addedNewApp);
                if ($rootScope.addedNewApp){
                    if($rootScope.userobj.role == "Admin" || !$rootScope.authenticationStatus){
                        $scope.initMenu();
                    }else{
                        $scope.getUserPage($rootScope.userobj.id);
                    }
                }
                    // $scope.initMenu();
            });

            // Init       
            $scope.initMenu = function () {

                $scope.menuItems = [
                    // { label: 'Dashboard', href: '/dashboard', icon: 'fa-dashboard', isGroup: false, submenuItems: [] },
                    // { label: 'Raft Guides', href: '/guides', icon: 'fa-user', isGroup: false, submenuItems: [] },
                    // {
                    //     label: 'Equipment', href: '', icon: 'fa-gears', isGroup: true, submenuItems: [
                    //         { label: 'Rafts', href: '/rafts', icon: 'fa-unlink' },
                    //         { label: 'Paddles', href: '/paddles', icon: 'fa-magic' }
                    //     ]
                    // },
                    { label: 'App Management', href: '/appmanagement', icon: 'fa-user', isGroup: false, submenuItems: [] },
                    { label: 'User Management', href: '/usermanagement', icon: 'fa-user', isGroup: false, submenuItems: [] },
                    { label: 'Auth Setting', href: '/authsetting', icon: 'fa-wrench', isGroup: false, submenuItems: [] },
                    { label: 'Notification Management', href: '/notificationmanagement', icon: 'fa-wrench', isGroup: false, submenuItems: [] },
                    { label: 'Site Management', href: '/sitemanagement', icon: 'fa-wrench', isGroup: false, submenuItems: [] }
                ];


                appmanagementresource.$init(function (data) {

                    var applist = { label: 'App List', href: '', icon: 'fa-gears', isGroup: true, submenuItems: [] };

                    if (data.success) {

                        var list = data.obj;

                        angular.forEach(list, function (item) {
                            if (item.pagestatus) {
                                applist.submenuItems.push({ label: item.pagename, href: '/prevpage/' + item.id, icon: 'fa-dashboard' });
                            }
                        });

                    }

                    $scope.menuItems.push(applist);

                    $rootScope.addedNewApp = false;
                });
            }

            // $scope.getNotification = function(){
            //     notificationmanagementresource.$getAll(function(data){
            //         if(data.success){
            //             $rootScope.notificationList = data.obj;
            //         }
            //         console.log($scope.notificationList);
                    
            //     });
            // }
            // $scope.test = "aaaa";
            // $scope.notificationtemplate = '/javascripts/angularproject/partialviews/notificationmanagement.html';
            //Menu init when app run
            // $scope.initMenu();   
        }
    ]);