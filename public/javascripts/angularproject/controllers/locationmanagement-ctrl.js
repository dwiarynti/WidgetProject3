angular.module('app').controller('locationmanagementcontroller',
    ['$scope', '$filter', '$rootScope', 'roomResource',
        function ($scope, $filter, $rootScope, roomResource) {
            var roomresource = new roomResource();
            $scope.roomList = [];
            $scope.deleteuuid = "";
            $scope.areatype = [
                {level:1, name:"site"},
                {level:2, name:"area"}, 
                {level:3, name:"building"},
                {level:4, name:"floor"},
                {level:5, name:"room"},
                {level:6, name:"closet"},
                ];
            $scope.parentList = [];
            $scope.selectedareatype = "";
            
            var date = new Date();

            $scope.init = function(){
                roomresource.$getall(function(data){
                    console.log(data.obj);
                    $scope.roomList = data.obj;
                });
            }

            $scope.init();

            $scope.Add = function(){
                $scope.roomList.push({
                    uuid :"",
                    name:"",
                    parent:"",
                    datecreated:date,
                    datemodified : "",
                    changeby : "",
                    changebyname :"",
                    areatype : "",
                    shortaddress: "",
                    fulladdress:"",
                    Location :"",
                    disable : false
                });
            }

            $scope.Save = function(obj){
                obj.areatype  = $filter('filter')($scope.areatype, function (type) { return parseInt(obj.areatype) === type.level })[0].name;
                roomresource.roomobj = obj;
                roomresource.$create(function(data){
                    if(data.success)
                        $scope.init();
                        
                });
            }

            $scope.turnoffaddmode = function(index){
                $scope.roomList.splice(index,1);
            }

            $scope.Edit=function(obj){
                obj.editmode = true;
            }
            
            $scope.turnoffeditmode = function(obj){
                obj.editmode = false;
            }

            $scope.Update = function(obj){
                obj.datamodified = date;
                obj.changeby = $rootScope.userobj.id;
                obj.changebyname = $rootScope.userobj.username;
                roomresource.roomobj = obj;
                roomresource.$update(function(data){
                    if(data.success)
                        $scope.init();
                    
                });
            }
            
            $scope.btnDeleteClick = function(obj){
                $("#modal-delete").modal('show');
                $scope.deleteuuid = obj.uuid;
            }
            
            $scope.Delete = function(){
                roomresource.roomobj = {uuid:$scope.deleteuuid};
                roomresource.$delete(function(data){
                    if(data.success)
                        $scope.init();
                        $("#modal-delete").modal('hide');
                    
                });
            }

            $scope.getParent = function(obj){
                console.log(obj);
                $scope.parentList = [];
                obj = parseInt(obj);
                var list = $filter('filter')($scope.areatype, function (type) { return type.level < obj });
                    angular.forEach(list,function(item) {
                        var data = $filter('filter')($scope.roomList, function (room) { return room.areatype === item.name });
                        if(data.length != 0){
                            $scope.parentList.push.apply($scope.parentList, data);
                        }
                    });
            }
        }
    ]);