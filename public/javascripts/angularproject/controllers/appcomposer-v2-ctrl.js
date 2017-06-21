angular.module('app').controller('appcomposer-v2controller',
    ['$scope', '$window', '$location', 'dataService',
        function ($scope, $window, $location, dataService) {
            $scope.appmanagementobj={};
            $scope.widgets = [];
            
            $scope.gridsterOpts = {
                columns: 12,
                margins: [30, 20],
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
            }


            $scope.ViewPage = function(){
                // window.open($location.path('/prevpage/', {id:$scope.appmanagementobj.id}));
                $location.path('prevpage/'+$scope.appmanagementobj.id);
            }

        }]);