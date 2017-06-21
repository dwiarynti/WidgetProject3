(function () {
    "use strict";
    angular.module('app').factory('widgetmanagementResource',
    ["$resource", widgetmanagementResource]);

    function widgetmanagementResource($resource) {
        return $resource("/api/widgetmanagement/:action/:_id",
               { _id: '@_id' },
               {
                 get: { method: 'GET',params:{action:'datasource'}},
                //  getDataSource: { method: 'GET',params:{action:'datasource'}},
               })
    }
}());