angular.module('app').controller('notificationmanagementcontroller',
    ['$scope','$location', 'notificationmanagementResource', 'passingdataservice', '$rootScope', 'locationsiteResource','$filter','siteResource',
        function ($scope, $location, notificationmanagementResource, passingdataservice, $rootScope, locationsiteResource, $filter, siteResource) {
            var notificationmanagementresource = new notificationmanagementResource();
            var locationsiteresource = new locationsiteResource();
            var siteresource = new siteResource();
            $scope.notificationList=[];
            $scope.locationList=[];
            $scope.siteList=[];
            $scope.deleteuserid = 0;
            $scope.userobj = $rootScope.userobj;
            var siteid = $rootScope.userobj.siteid;
            console.log($rootScope.userobj);

            $scope.getAllNotification = function(){
                notificationmanagementresource.$getAll(function(data){
                    console.log(data);
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
            }

            $scope.getNotificationbySite = function(){
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

            $scope.getAllSite = function(){
                siteresource.$getall(function(data){
                    $scope.siteList = data.obj;
                });
            }


            $scope.init = function(){
                if(!$rootScope.authenticationStatus || siteid == ""){
                    $scope.getAllNotification();
                    if(siteid == ""){
                        $scope.getAllSite();
                    }
                }else{
                    $scope.getNotificationbySite();
                }
                console.log("Siteid: "+siteid);
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