"use strict";

angular.module('psDashboard').directive('psWidgetBodytest',
    ['$compile', '$modal',
    function ($compile, $modal) {
        return {
            // templateUrl: '/javascripts/angularproject/widgets/psWidgetBodyTestTemplate.html',
            templateUrl: '/javascripts/ext-modules/psDashboard/psWidgetBodyTestTemplate.html',
            link: function (scope, element, attrs) {
                var newElement = angular.element(scope.item.template);
                element.append(newElement);
                $compile(newElement)(scope);

                scope.close = function () {
                    scope.widgets.splice(scope.widgets.indexOf(scope.item), 1);
                };

                scope.settings = function () {
                    var options = {
                        templateUrl: scope.item.widgetSettings.templateUrl,
                        controller: scope.item.widgetSettings.controller,
                        scope: scope
                    };
                    $modal.open(options);
                };

                scope.iconClicked = function () {
                    // empty body.
                    // this function is used by ng-click in the template
                    // so that icon clicks aren't intercepted by widgets
                };
            }
        };
    }
]);