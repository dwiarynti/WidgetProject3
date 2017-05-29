(function () {
    "use strict";
    angular.module('app').factory('persondeviceResource',
    ["$resource", persondeviceResource]);

    function persondeviceResource($resource) {
        return $resource("/api/persondevice/:action/:_id",
               { _id: '@_id' },
               {
                 init: {method:'GET', params:{action:'getbysite'}}
               });
    }
}());