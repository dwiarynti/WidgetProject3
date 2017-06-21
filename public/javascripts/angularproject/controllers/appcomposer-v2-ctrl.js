angular.module('app').controller('appcomposer-v2controller',
    ['$scope', '$window', '$location', 'dataService','passingdataservice', 'widgetmanagementResource',
        function ($scope, $window, $location, dataService, passingdataservice, widgetmanagementResource) {
            $scope.appmanagementv2obj={};
            var widgetmanagementresource = new widgetmanagementResource();

            
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
            

            $scope.init = function(){
                if(passingdataservice.appmanagementv2obj != undefined){
                    $scope.appmanagementv2obj = passingdataservice.appmanagementv2obj;
                    // $scope.$parent.widgets = $scope.appmanagementv2obj.widget;
                    console.log($scope.appmanagementv2obj);
                }else{
                    $location.path('appmanagement-v2');
                }

            }

            $scope.init();


            $scope.addNewWidget = function (widget) {
                var newWidget = angular.copy(widget.settings);
                $scope.appmanagementv2obj.widget.push(newWidget);
            }


            $scope.ViewPage = function(){
                // window.open($location.path('/prevpage/', {id:$scope.appmanagementv2obj.id}));
                $location.path('prevpage/'+$scope.appmanagementv2obj.id);
            }

            $scope.Save = function(){
                widgetmanagementresource.appname = $scope.appmanagementv2obj.appname;
                widgetmanagementresource.appstatus = $scope.appmanagementv2obj.appstatus;
                widgetmanagementresource.widget = $scope.appmanagementv2obj.widget;

                widgetmanagementresource.$create(function(data){
                    $window.alert("Data saved successfully");
                    
                    // $scope.appmanagementv2obj = data.obj;
                    //Reinit menu
                    // $rootScope.addedNewApp = true;
                });
            }

        }]);