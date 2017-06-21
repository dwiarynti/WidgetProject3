"use strict";

angular.module('app').controller('mvp-textdialogcontroller',
    ['$scope', 'dataService','widgetmanagementResource',
    function ($scope, dataService, widgetmanagementResource) {
        // var textsiteresource = new textsiteResource();
        var widgetmanagementresource = new widgetmanagementResource();

        $scope.configuration = {
            "placeholder":"", 
            "datasource":{}, 
            "fieldname":"", 
            "conditions":[],
            "returneddatatype":""
        };

        $scope.datasourcelist = [];
        $scope.fieldnamelist = [];
        $scope.returneddatatypes = ["list", "singledata"];
        var siteid = "001";


        // textsiteresource.$distinct({_id:siteid}, function(data){
        //     // $scope.objmodel = data.obj;
        //     $scope.filteroptions = data.obj;
        //     console.log(data.obj);
        // });

        $scope.saveSettings = function () {
            console.log($scope.item);
            console.log($scope);
            // $scope.item.widgetSettings.configuration = $scope.configuration;
            // $scope.$close();
        };

        $scope.addcondition = function(){
            $scope.configuration.conditions.push({
                "fieldname":"",
                "value":""
            })
        }
        
        $scope.getDataSource = function(){
            widgetmanagementresource.$get(function(data){
                if(data.success)
                    $scope.datasourcelist = data.obj

            });
        }

        $scope.getDataSourceFeilds = function(){
            var datasource = JSON.parse($scope.configuration.datasource);
            $scope.fieldnamelist = datasource.field;
        }

        $scope.getDataSource();
    }]);