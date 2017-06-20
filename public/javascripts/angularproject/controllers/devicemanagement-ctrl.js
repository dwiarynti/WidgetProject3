angular.module('app').controller('devicemanagementcontroller',
    ['$scope','roomdevResource', 'roomResource',
        function ($scope, roomdevResource, roomResource) {
            var roomdevresource = new roomdevResource();
            var roomresource = new roomResource();

            $scope.devicetypes = ["fixed", "mobile"];
            $scope.deviceslist = [];
            $scope.deviceobj = {};
            $scope.roomlist =[];


            $scope.init = function(){
                roomdevresource.$getAll(function(data){
                    $scope.deviceslist = data.obj;
                });
            }

            $scope.init();            

            $scope.btnAddClick = function()
            {
                $("#modal-add").modal('show');
                $scope.getroom();
                
            }

            $scope.getroom = function(){
                roomresource.$gettyperoom(function(data){
                    console.log(data)
                    if(data.success)
                        $scope.roomlist = data.obj;                   
                });
            }

            $scope.Save = function(){
                roomdevresource.deviceobj = $scope.deviceobj;
                roomdevresource.$create(function(data){
                    if(data.success){
                        $scope.init(); 
                    }

                });
            }

            $scope.Edit = function(){

            }

            $scope.Update = function(){
                roomdevresource.deviceobj = $scope.deviceobj;
                roomdevresource.$update(function(data){
                    if(data.success){
                        $scope.init(); 
                    }

                });
            }
        }
    ]);