"use strict";

angular.module('app').controller('appController',
    ['$scope', '$rootScope', 'appmanagementResource', 'userResource','authsettingResource',
        function ($scope, $rootScope, appmanagementResource, userResource, authsettingResource) {
            var userresource = new userResource();            
            var appmanagementresource = new appmanagementResource();  
            var authsettingresource = new authsettingResource();                    
            $scope.state = 'unauthorized';
            $scope.loginobj = {username:"", password:""};
            $scope.menuItems = [];
            $scope.userobj = {};
            $scope.errmessage = "";
            $scope.authenticationStatus = true;

            authsettingresource.$init(function(data){

                if(data.success){
                    $scope.state = data.obj ? 'unauthorized':'authorized';
                    $scope.authenticationStatus = data.obj;
                    if(data.obj){
                        $scope.getSession();
                    }else{
                        $scope.initMenu();
                    }
                }
                console.log($scope.state);
            });

            $scope.getSession = function(){
                userresource.$session(function(data){
                    $scope.state = data.result;
                });
            }

            $scope.signIn = function () {
                userresource.username = $scope.loginobj.username;
                userresource.password = $scope.loginobj.password;
                userresource.$login(function(data){
                    console.log(data);
                    $scope.userobj = data.obj;
                    if(data.success){
                        $scope.state = 'authorized';
                        if(data.obj.role == "Admin"){
                             $scope.initMenu();
                        }else{
                            $scope.getUserPage(data.obj.id);
                        }
                    }else{
                        $scope.errmessage = data.obj;
                    }
                });
                
            };

            $scope.getUserPage = function(userid){
                appmanagementresource.$getbyuser({_id:userid},function(data){
                    console.log(data);
                    angular.forEach(data.obj, function (obj) {
                        $scope.menuItems.push({
                            label: obj.pagename, href: '/prevpage/' + obj.id, icon: 'fa-dashboard', isGroup: false, submenuItems: []
                        });
                    });
                    console.log($scope.menuItems);
                });
            }




            $rootScope.addedNewApp = false;

            $scope.$watch(function(){ return $rootScope.addedNewApp }, function () {
                //console.log($rootScope.addedNewApp);
                if ($rootScope.addedNewApp){
                    if($scope.userobj.role == "Admin" || !$scope.authenticationStatus){
                        $scope.initMenu();
                    }else{
                        $scope.getUserPage($scope.userobj.id);
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
                    { label: 'Auth Setting', href: '/authsetting', icon: 'fa-user', isGroup: false, submenuItems: [] }
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

            //Menu init when app run
            // $scope.initMenu();   
        }
    ]);