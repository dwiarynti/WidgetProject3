angular.module('app').controller('usermanagementcontroller',
    ['$scope','$location', 'userResource' ,'passingdataservice', '$rootScope',
        function ($scope, $location, userResource, passingdataservice, $rootScope) {
           var userresource = new userResource();
            $scope.roles =[{"rolename": "Admin"}, {"rolename": "User"}];
            $scope.userobject = {
                "username":"",
                "password":"",
                "role":"",
                "pages":[]
            }
            $scope.errormessage = "";
            $scope.userlist = [];
            $scope.init = function(){
                userresource.$getall(function(data){
                    $scope.userlist = data.obj;
                });
            }
            $scope.init();
            $scope.btnAddClick = function()
            {
                $("#modal-add").modal('show');
            }



            $scope.Save = function(){
                userresource.username = $scope.userobject.username;
                userresource.password = $scope.userobject.password;
                userresource.role = $scope.userobject.role;
                userresource.pages = $scope.userobject.pages;
                userresource.$create(function(data){
                    console.log(data);
                    if(data.success){
                        $("#modal-add").modal('hide');   
                        $scope.init();                     
                    }else{
                        $scope.errormessage = data.message;
                    }

                });
                console.log($scope.userobject);
            }

        }
    ]);