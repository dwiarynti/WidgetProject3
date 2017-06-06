(function () {
    "use strict";
    angular.module('app').factory('notificationmanagementResource',
    ["$resource", notificationmanagementResource]);

    function notificationmanagementResource($resource) {
        return $resource("/api/message/:action/:_id",
               { _id: '@_id' },
               {
                 getAll: {method:'GET', params:{action:'getall'}},
                 create: {method:'POST', params:{action:'create'}},
                 update: {method:'POST', params:{action:'update'}},
                 get: {method:'GET'},
                 getbyuser: {method:'GET', params:{action:'getbyuser'}},      
               })
    }
}());