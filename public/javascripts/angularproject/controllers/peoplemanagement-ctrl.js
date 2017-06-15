angular.module('app').controller('peoplemanagementcontroller',
    ['$scope','personResource',
        function ($scope, personResource) {
            var personresource = new personResource();
            $scope.peopleList = [];
            $scope.deleteuuid = "";
            
            var date = new Date();

            $scope.init = function(){
                personresource.$getAll(function(data){
                    $scope.peopleList = data.obj;
                });
            }

            $scope.init();

            $scope.Add = function(){
                $scope.peopleList.push({
                    uuid :"",
                    version:"",
                    name:"",
                    nick:"",
                    email:"",
                    definedbytenant:"",
                    datecreated:date,
                    datemodified:"",
                    changeby:"",
                    changebyname:""
                });
            }

            $scope.Save = function(obj){
                console.log(obj);
                personresource.personobj = obj;
                personresource.$create(function(data){
                    if(data.success)
                        $scope.init();
                        
                });
            }

            $scope.turnoffaddmode = function(index){
                $scope.peopleList.splice(index,1);
            }

            $scope.Edit=function(obj){
                obj.editmode = true;
            }
            
            $scope.turnoffeditmode = function(obj){
                obj.editmode = false;
            }

            $scope.Update = function(obj){
                personresource.personobj = obj;
                personresource.$update(function(data){
                    if(data.success)
                        $scope.init();
                    
                });
            }
            
            $scope.btnDeleteClick = function(obj){
                $("#modal-delete").modal('show');
                $scope.deleteuuid = obj.id;
            }
            
            $scope.Delete = function(){
                // personresource.personobj.uuid = $scope.deleteuuid;
                // personresource.$delete(function(data){
                //     if(data.success)
                //         $scope.init();
                    
                // });
            }

        }
    ]);