angular.module('app').controller('notificationpopovercontroller',
    ['$scope','$location','$rootScope', 'notificationmanagementResource',
        function ($scope, $location, $rootScope, notificationmanagementResource, ) {
            $scope.notificationList = [];
            var notificationmanagementresource = new notificationmanagementResource();

            $scope.getactivenotificationpopoverbysite = function(){
                notificationmanagementresource.$getbysitedate({_id:$rootScope.userobj.siteid},function(data){
                    $scope.notificationList = data.obj;
                    $scope.$parent.$parent.notificationnumber = data.obj.length;

                });
            }
            
            $scope.getallactivenotificationpopover = function(){
                notificationmanagementresource.$getbydate(function(data){
                    $scope.notificationList = data.obj;
                    $scope.$parent.$parent.notificationnumber = data.obj.length;                    
                });
            }


            //init
            if($rootScope.userobj.role== "Super Admin"){
                $scope.getallactivenotificationpopover();
            }else{
                $scope.getactivenotificationpopoverbysite();
            }

            
        }
    ]);