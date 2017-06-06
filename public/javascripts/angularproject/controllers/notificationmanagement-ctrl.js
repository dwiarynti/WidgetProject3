angular.module('app').controller('notificationmanagementcontroller',
    ['$scope','$location', 'notificationmanagementResource', 'passingdataservice', '$rootScope', 'locationsiteResource',
        function ($scope, $location, notificationmanagementResource, passingdataservice, $rootScope, locationsiteResource) {
            var notificationmanagementresource = new notificationmanagementResource();
            var locationsiteresource = new locationsiteResource();
            // var passingdataservice = new passingdataservice();
            $scope.notificationList=[];
            $scope.locationList=[];
            var siteid = "001";
            $scope.init = function(){
                notificationmanagementresource.$getAll(function(data){
                    console.log(data.obj);
                    angular.forEach(data.obj, function(obj) {
                        obj.editmode = false;
                    }, this);
                    $scope.notificationList= data.obj;
                });
                locationsiteresource.$init({_id:siteid}, function(data){
                    console.log(data);                    
                    $scope.locationList = data.obj;
                });
            }
            $scope.init();
            $scope.Edit = function(obj){
                obj.editmode = true;
                obj.datetime="";
            }
            $scope.Add = function(){
                $scope.notificationList.push({"id":0, "datetime":"", "topic":"", "siteid":"", "locationid":"", "editmode":true});
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
                console.log(obj);
                notificationmanagementresource.id = obj.id;
                notificationmanagementresource.pagename = obj.pagename;
                notificationmanagementresource.pagestatus = obj.pagestatus;
                notificationmanagementresource.widget = obj.widget;
                notificationmanagementresource.$update(function(data){
                    console.log(data);
                    if(data.success){
                        $scope.turnoffeditmode(obj);
                        
                        //Reinit menu
                        $rootScope.addedNewApp = true;
                    }
                });
            }
            
            $scope.turnoffaddmode = function(index){
                $scope.PageList.splice(index,1);
            }

            $scope.turnoffeditmode = function(obj){
                obj.editmode = false;    
            }

            $scope.ComposePage = function(obj){
                passingdataservice.notificationmanagementobj = obj;
                $location.path('appcomposer');
            }

        }
    ]);