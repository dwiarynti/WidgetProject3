angular.module('app').controller('applicationcontroller',
    ['$scope', '$routeParams', 'widgetmanagementResource',
        function ($scope, $routeParams, widgetmanagementResource) {

            var widgetmanagementresource = new widgetmanagementResource();
            $scope.applicationObj = {};

            widgetmanagementresource.$getappbyid({_id:$routeParams.euid}, function(data){
                $scope.applicationObj = data.obj;

            });
            
            $scope.gridsterOpts = {
                columns: 12,
                margins: [20, 20],
                outerMargin: false,
                pushing: true,
                floating: false,
                swapping: false,
                draggable: {
                    enabled: false
                },
                resizable: {
                    enabled: false
                },
                rowHeight: 'match'
            };
        }]);