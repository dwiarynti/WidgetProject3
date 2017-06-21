angular.module('app').controller('appmanagemet-v2controller',
    ['$scope','$location', 'widgetmanagementResource', 'passingdataservice', '$rootScope',
        function ($scope, $location, widgetmanagementResource, passingdataservice, $rootScope) {
            var widgetmanagementresource = new widgetmanagementResource();

            $scope.PageList=[];
            widgetmanagementresource.$getall(function(data){
                console.log(data);
                $scope.PageList = data.obj;
            });

            $scope.Edit = function(obj){
                obj.editmode = true;
            }
            
            //
            $scope.Add = function(){
                var newapp = {"euid":0, "appname":"", "appstatus":true, "widget":[]};
                passingdataservice.appmanagementv2obj = newapp;
                $location.path('appcomposert-v2');
                
            }

            $scope.Update = function(obj){
                widgetmanagementresource.euid = obj.euid;
                widgetmanagementresource.appname = obj.appname;
                widgetmanagementresource.appstatus = obj.appstatus;
                widgetmanagementresource.widget = obj.widget;
                widgetmanagementresource.$update(function(data){
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
                passingdataservice.appmanagementv2obj = obj;
                $location.path('appcomposert-v2');
            }
        }
    ]);