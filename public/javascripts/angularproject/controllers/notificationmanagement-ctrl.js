angular.module('app').controller('notificationmanagementcontroller',
    ['$scope','$location', 'notificationmanagementResource', 'passingdataservice', '$rootScope', 'locationsiteResource','$filter',
        function ($scope, $location, notificationmanagementResource, passingdataservice, $rootScope, locationsiteResource, $filter) {
            var notificationmanagementresource = new notificationmanagementResource();
            var locationsiteresource = new locationsiteResource();
            // var passingdataservice = new passingdataservice();
            $scope.notificationList=[];
            $scope.locationList=[];
            $scope.deleteuserid = 0;
            var siteid = $rootScope.userobj.siteid;
            console.log($rootScope.userobj);
            $scope.init = function(){
                if(!$rootScope.authenticationStatus){
                    notificationmanagementresource.$getAll(function(data){
                        angular.forEach(data.obj, function(obj) {
                            obj.editmode = false;
                            obj.datetimeORI = obj.datetime;
                        }, this);
                        $scope.notificationList= data.obj;
                        $scope.$parent.$parent.notificationnumber = data.obj.length;
                    });
                    locationsiteresource.$getall( function(data){        
                        $scope.locationList = data.obj;
                    });
                }else{
                    notificationmanagementresource.$getbysite({_id:siteid}, function(data){
                        angular.forEach(data.obj, function(obj) {
                            obj.editmode = false;
                            obj.datetimeORI = obj.datetime;
                        }, this);
                        $scope.notificationList= data.obj;
                        $scope.$parent.$parent.notificationnumber = data.obj.length;
                    });
                    locationsiteresource.$getbysite({_id:siteid}, function(data){        
                        $scope.locationList = data.obj;
                    });
                }
console.log(siteid);

            }


            $scope.init();
            $scope.Edit = function(obj){
                obj.editmode = true;
                obj.datetime="";
            }
            $scope.Add = function(){
                $scope.notificationList.push({"id":0, "datetime":"", "date":"","time":"", "topic":"", "siteid":siteid, "locationid":"", "editmode":true});
            }

            $scope.Save = function(obj){
                console.log(obj);

                notificationmanagementresource.datetime = obj.datetime;
                notificationmanagementresource.topic = obj.topic;
                notificationmanagementresource.siteid = obj.siteid;
                notificationmanagementresource.locationid = obj.locationid;
                notificationmanagementresource.$create(function(data){
                    if(data.success){
                        $scope.init();
                    }
                });
            }

            $scope.Update = function(obj){
                console.log(obj.datetime);
                // var datetime = $scope.convertodatetime(obj.date, obj.time);
                obj.datetime = obj.datetime == "" && obj.datetimeORI != ""?obj.datetimeORI:obj.datetime;
                
                notificationmanagementresource.id = obj.id;
                notificationmanagementresource.datetime = obj.datetime;
                notificationmanagementresource.topic = obj.topic;
                notificationmanagementresource.siteid = obj.siteid;
                notificationmanagementresource.locationid = obj.locationid;
                notificationmanagementresource.$update(function(data){
                    console.log(data);
                    if(data.success){
                        $scope.turnoffeditmode(obj);
                        $scope.init();
                    }
                });
            }
            
            $scope.turnoffaddmode = function(index){
                $scope.PageList.splice(index,1);
            }

            $scope.turnoffeditmode = function(obj){
                obj.editmode = false;    
                obj.datetime =obj.datetimeORI;
            }

            $scope.ComposePage = function(obj){
                passingdataservice.notificationmanagementobj = obj;
                $location.path('appcomposer');
            }
            
            $scope.btnDeleteClick = function(obj){
                $("#modal-delete").modal('show');
                $scope.deleteuserid = obj.id;
            }
            
            $scope.Delete = function(){
                notificationmanagementresource.id = $scope.deleteuserid;                
                notificationmanagementresource.$delete(function(data){
                    if(data.success){
                        $("#modal-delete").modal('hide');
                        $scope.init();
                        
                    }
                });
            }

        }
    ]);