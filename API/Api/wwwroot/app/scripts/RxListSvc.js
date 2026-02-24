'use strict';
angular.module('RxApp')
.factory('RxListSvc', ['$http', function ($http) {

    $http.defaults.useXDomain = true;
    delete $http.defaults.headers.common['X-Requested-With']; 

    return {
        getItems : function(){
            return $http.get(apiEndpoint + '/api/Rx');
        },
        getItem : function(id){
            return $http.get(apiEndpoint + '/api/Rx/' + id);
        },
        postItem : function(item){
            return $http.post(apiEndpoint + '/api/Rx', item);
        },
        putItem : function(item){
            return $http.put(apiEndpoint + '/api/Rx/' + item.id, item);
        },
        deleteItem : function(id){
            return $http({
                method: 'DELETE',
                url: apiEndpoint + '/api/Rx/' + id
            });
        }
    };
}]);