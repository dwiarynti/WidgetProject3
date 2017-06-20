angular.module('app').controller('devicemanagementcontroller',
    ['$scope','roomdevResource', 'roomResource',
        function ($scope, roomdevResource, roomResource) {
            var roomdevresource = new roomdevResource();
            var roomresource = new roomResource();

            $scope.devicetypes = ["fixed", "mobile"];
            $scope.deviceslist = [];
            $scope.deviceobj = {};
            $scope.roomlist =[];
            $scope.action = "";
            $scope.errormessage = "";

            $scope.init = function(){
                roomdevresource.$getAll(function(data){
                    if(data.success)
                        $scope.deviceslist = data.obj;
                        $scope.getroom();
                });
            }

            $scope.init();            

            $scope.btnAddClick = function()
            {
                $scope.action = "Add";
                $scope.getroom();
                $("#modal-add").modal('show');
            }

            $scope.getroom = function(){
                roomresource.$gettyperoom(function(data){
                    // console.log(data)
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

            $scope.btnEditClick = function(obj){
                $scope.deviceobj = obj;
                $scope.action = "Edit";                
                $("#modal-add").modal('show');                
            }

            $scope.Update = function(){
                roomdevresource.deviceobj = $scope.deviceobj;
                roomdevresource.$update(function(data){
                    if(data.success){
                        $scope.init(); 
                    }
                });
            }
            
            $scope.isSelectedItem = function(itemA, itemB){
                return itemA == itemB ? true:false;
            }
        }
    ]);