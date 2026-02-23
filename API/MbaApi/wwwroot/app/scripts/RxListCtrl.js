'use strict';
angular.module('RxApp')
.controller('RxListCtrl', ['$scope', '$location', 'RxListSvc', function ($scope, $location, RxListSvc) {
    $scope.error = "";
    $scope.loadingMessage = "Loading...";
    $scope.RxList = null;
    $scope.editingInProgress = false;
    $scope.newRxCompanyName = "";

    $scope.editInProgressRx = {
        companyName: "",
        nickName: "",
        relatedEntityId: 0,
    };

    $scope.editSwitch = function (Rx) {
        Rx.edit = !Rx.edit;
        if (Rx.edit) {
            $scope.editInProgressRx.id = Rx.id
            $scope.editInProgressRx.companyName = Rx.companyName;
            $scope.editInProgressRx.relatedEntityId = Rx.relatedEntityId;
            $scope.editingInProgress = true;
        } else {
            $scope.editingInProgress = false;
        }
    };

    $scope.populate = function () {
        RxListSvc.getItems().success(function (results) {
            $scope.RxList = results;
            $scope.loadingMessage = "";
        }).error(function (err) {
            $scope.error = err;
            $scope.loadingMessage = "";
        })
    };
    $scope.delete = function (RelatedEntityId) {
        RxListSvc.deleteItem(RelatedEntityId).success(function (results) {
            $scope.loadingMessage = "";
            $scope.populate();
        }).error(function (err) {
            $scope.error = err;
            $scope.loadingMessage = "";
        })
    };
    $scope.update = function (Rx) {
        RxListSvc.putItem($scope.editInProgressRx).success(function (results) {
            $scope.loadingMsg = "";
            $scope.populate();
            $scope.editSwitch(Rx);
        }).error(function (err) {
            $scope.error = err;
            $scope.loadingMessage = "";
        })
    };
    $scope.add = function () {
        if ($scope.editingInProgress) {
            $scope.editingInProgress = false;
        }
        RxListSvc.postItem({
            'CompanyName': $scope.newRxCompanyName,
        }).success(function (results) {
            $scope.loadingMsg = "";
            $scope.newRxCompanyName = "";
            $scope.populate();
        }).error(function (err) {
            $scope.error = err;
            $scope.loadingMsg = "";
        })
    };

}]);
