angular.module('app').controller('usermanagementcontroller',
    ['$scope','$location', 'userResource' ,'passingdataservice', '$rootScope','appmanagementResource','$filter',
        function ($scope, $location, userResource, passingdataservice, $rootScope, appmanagementResource, $filter) {
           var userresource = new userResource();
           var appmanagementresource = new appmanagementResource();
           $scope.pagelist = [];
           $scope.pagelistEditMode = [];
            $scope.roles =[
                {"rolename": "Admin"}, 
                {"rolename": "User"}
                // {"rolename": "Super Admin"}
                ];
            $scope.userobject = {
                "username":"",
                "password":"",
                "role":"",
                "pages":[]
            }
            $scope.selecteduser = {};
            $scope.deleteuserid =0;
            $scope.errormessage = "";
            $scope.userlist = [];
            $scope.init = function(){
                userresource.$getall(function(data){
                    $scope.userlist = data.obj;
                });
                $scope.getPageList();
            }

            $scope.getPageList = function(){
                appmanagementresource.$init(function(data){
                    // console.log(data);
                    $scope.pagelist = data.obj;
                    $scope.pagelistEditMode = data.obj;
                });
            }

            $scope.init();
            $scope.btnAddClick = function()
            {
                $scope.userobject = {
                    "username":"",
                    "password":"",
                    "role":"",
                    "pages":[]
                }
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
                // console.log($scope.userobject);
            }

            $scope.pushSelectedTransactionType = function(obj, active, mode){
                console.log(mode);
                if (active){
                    if(mode=="add"){
                        $scope.userobject.pages.push(obj.id);
                    }else{
                        $scope.selecteduser.pages.push(obj.id);
                    }
                }
                else{
                    if(mode=="add"){
                        $scope.userobject.pages.splice($scope.userobject.pages.indexOf(obj.id), 1);
                    }else{
                        $scope.selecteduser.pages.splice($scope.userobject.pages.indexOf(obj.id), 1);
                    }
                }             
                
            }

            $scope.btnEditClick = function(obj){
                $("#modal-edit").modal('show');
                // console.log($scope.selecteduser);
                
                angular.forEach($scope.pagelistEditMode, function (pageobj) {
                    var qwe = $filter('filter')(obj.pages,function(item){
                        return pageobj.id === item
                    })[0];
                    // console.log(qwe);
                    
                    pageobj.selected = qwe != undefined ? true:false;
                });
                $scope.selecteduser = obj;
                console.log($scope.selecteduser);
                console.log(obj);
            }

            $scope.btnDeleteClick = function(obj){
                $("#modal-delete").modal('show');
                $scope.deleteuserid = obj.id;
            }

            $scope.isSelectedRole =function(roleA, roleB){
                return roleA == roleB ? true:false;
            }
            
            $scope.Update = function(){
                userresource.id = $scope.selecteduser.id;
                userresource.username = $scope.selecteduser.username;
                userresource.password= $scope.selecteduser.password;
                userresource.role= $scope.selecteduser.role;
                userresource.pages= $scope.selecteduser.pages
                userresource.$update(function(data){
                    if(data.success){
                        $("#modal-edit").modal('hide');
                        $scope.init();
                    }
                });
            }

            $scope.Delete = function(){
                userresource.id = $scope.deleteuserid;                
                userresource.$delete(function(data){
                    if(data.success){
                        $("#modal-delete").modal('hide');
                        $scope.init();
                        
                    }
                });
            }

        }
    ]);