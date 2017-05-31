"use strict";

angular.module('app').controller('appController',
    ['$scope', '$rootScope', 'appmanagementResource', 'userResource',
        function ($scope, $rootScope, appmanagementResource, userResource) {
            var userresource = new userResource();            
            $scope.state = 'unauthorized';
            $scope.loginobj = {username:"", password:""};
            $scope.signIn = function () {
                userresource.username = $scope.loginobj.username;
                userresource.password = $scope.loginobj.password;
                userresource.$login(function(data){
                    if(data.success){
                        $scope.state = 'authorized';
                    }
                });
                
            };
            userresource.$session(function(data){
                $scope.state = data.result;
            });


            $rootScope.addedNewApp = false;

            $scope.$watch(function(){ return $rootScope.addedNewApp }, function () {
                //console.log($rootScope.addedNewApp);
                if ($rootScope.addedNewApp)
                    $scope.initMenu();
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
                    { label: 'User Management', href: '/usermanagement', icon: 'fa-user', isGroup: false, submenuItems: [] }
                ];

                var appmanagementresource = new appmanagementResource();

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
            $scope.initMenu();   
        }
    ]);