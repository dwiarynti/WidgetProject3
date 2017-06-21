"use strict";

angular.module('app').controller('mvp-textdialogcontroller',
    ['$scope', '$filter', 'dataService','widgetmanagementResource',
    function ($scope, $filter, dataService, widgetmanagementResource) {
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
        $scope.fieldvalue = [];
        $scope.returneddatatypes = ["list", "singledata"];
        // var siteid = "001";


        $scope.saveSettings = function () {
            console.log($scope.configuration);
            $scope.item.widgetSettings.configuration = $scope.configuration;
            // $scope.item.widgetSettings.configuration.datasource = 
            $scope.$close();
        };

        $scope.addcondition = function(){
            $scope.configuration.conditions.push({
                "fieldname":"",
                "value":"",
                "fieldvalue":[],
            })
        }
        
        $scope.getDataSource = function(){
            widgetmanagementresource.$get(function(data){
                console.log(data);
                if(data.success)
                    $scope.datasourcelist = data.obj

            });
        }

        $scope.getDataSourceFeilds = function(){
            if($scope.configuration.datasource != "")
            {
                var datasource = JSON.parse($scope.configuration.datasource);
                $scope.fieldnamelist = datasource.field;
            }

        }

        $scope.getDataSource();

        $scope.getValue=function(obj, conditionobj){
            conditionobj.fieldvalue = [];
                angular.forEach($scope.datasourcelist, function (datasource) {
                    if(datasource.data != undefined)
                        angular.forEach(datasource.data, function (data) {
                            if(data.hasOwnProperty(obj))
                                conditionobj.fieldvalue.push(data[obj])
                        });

                });
            console.log(conditionobj.fieldvalue);
            
        }
        
        $scope.isSelectedItem = function(itemA, itemB){
            return itemA == itemB ? true:false;
        }
    }]);