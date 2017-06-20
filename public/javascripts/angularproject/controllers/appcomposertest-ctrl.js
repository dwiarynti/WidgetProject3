angular.module('app').controller('appcomposertestcontroller',
    ['$scope', '$window', '$location','widgetResource', 'passingdataservice', 'appmanagementResource', 'dataService', '$rootScope',
        function ($scope, $window, $location, widgetResource, passingdataservice, appmanagementResource, dataService, $rootScope) {
            $scope.appmanagementobj={};
            $scope.widgets = [];
            var widgetresource = new widgetResource();
            var appmanagementresource = new appmanagementResource();
            $scope.gridsterOpts = {
                columns: 12,
                margins: [20, 20],
                outerMargin: false,
                pushing: true,
                floating: false,
                swapping: false
            };
            $scope.widgetDefinitions = [];
            dataService.getWidgetForm().then(function(data){
                $scope.widgetDefinitions = data;
            });
            


            $scope.addNewWidget = function (widget) {
                var newWidget = angular.copy(widget.settings);
                $scope.widgets.push(newWidget);
                // $scope.appmanagementobj.widget.push(newWidget);
            }


            $scope.ViewPage = function(){
                // window.open($location.path('/prevpage/', {id:$scope.appmanagementobj.id}));
                $location.path('prevpage/'+$scope.appmanagementobj.id);
            }

        }]);