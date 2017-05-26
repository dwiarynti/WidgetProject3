﻿"use strict";

angular.module('app').directive('wwaDashboard', ['$localStorage', 'widgetResource',
    function ($localStorage, widgetResource) {
    return {
        scope: {
        },
        template: '<ps-dashboard></ps-dashboard>',
        link: function (scope) {

            scope.title = 'My First Dashboard';
            var widgetresource = new widgetResource();

            scope.gridsterOpts = {
                columns: 12,
                margins: [20, 20],
                outerMargin: false,
                pushing: true,
                floating: false,
                swapping: false
            };

            scope.widgetDefinitions = [
                {
                    title: 'Temperature',
                    settings: {
                        sizeX: 3,
                        sizeY: 3,
                        minSizeX: 2,
                        minSizeY: 2,
                        template: '<wwa-temperature></wwa-temperature>',
                        widgetSettings: {
                            id: 1000,
                            templateUrl: '/javascripts/app/dialogs/wwaSelectLocationTemplate.html',
                            controller: 'wwaSelectLocationController'
                        }
                    }
                },
                {
                    title: 'Inventory',
                    settings: {
                        sizeX: 5,
                        sizeY: 3,
                        minSizeX: 2,
                        minSizeY: 2,
                        template: '<wwa-inventory></wwa-inventory>',
                        widgetSettings: {
                            id: 1002,
                            templateUrl: '/javascripts/app/dialogs/wwaSelectLocationTemplate.html',
                            controller: 'wwaSelectLocationController'
                        }
                    }
                },
                {
                    title: 'Employee',
                    settings: {
                        sizeX: 5,
                        sizeY: 3,
                        minSizeX: 2,
                        minSizeY: 2,
                        template: '<wwa-employee></wwa-employee>',
                        widgetSettings: {
                            id: 5000,
                            templateUrl: '/javascripts/app/dialogs/wwaSelectEmployeeTemplate.html',
                            controller: 'wwaSelectEmployeeController'
                        }
                    }
                },
                {
                    title: 'Location',
                    settings: {
                        sizeX: 5,
                        sizeY: 3,
                        minSizeX: 2,
                        minSizeY: 2,
                        template: '<mvplocation></mvplocation>',
                        widgetSettings: {
                            id: 5003,
                            by:"",
                            option:"",
                            templateUrl: '/javascripts/angularproject/dialog/mvp-location/mvp-location-dialog.html',
                            controller: 'mvp-locationdialogcontroller'
                        }
                    }
                },
                {
                    title: 'Person',
                    settings: {
                        sizeX: 5,
                        sizeY: 3,
                        minSizeX: 2,
                        minSizeY: 2,
                        template: '<mvpperson></mvpperson>',
                        widgetSettings: {
                            id: 5003,
                            selectedfilter :"",
                            templateUrl: '/javascripts/angularproject/dialog/mvp-person/mvp-person-dialog.html',
                            controller: 'mvp-persondialogcontroller'
                        }
                    }
                }
            ];
            
            scope.widgets = [];

            init();

            function init()
            {
                widgetresource.$getAll({}, function (data) {
                    console.log('widget loaded', data);
                    scope.widgets = data.obj.obj;

                });
            }

            scope.$watch('widgets', function () {
                console.log('scope.widgets',scope.widgets);
                if (scope.widgets.length > 0) {
                    widgetresource.obj = scope.widgets;
                    widgetresource.$add().then(function (data) {

                        if (data.success) {
                            console.log('widget saved');
                        }
                        else {

                        }
                    });
                }
                
            }, true);
        }
    }
}]);