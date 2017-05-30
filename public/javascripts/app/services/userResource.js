(function () {
    "use strict";
    angular.module('app').factory('userResource',
    ["$resource", userResource]);

    function userResource($resource) {
        return $resource("/api/user/:action/:_id",
               { _id: '@_id' },
               {
                 login: {method:'POST', params:{action:'login'}}
               });
    }
}());