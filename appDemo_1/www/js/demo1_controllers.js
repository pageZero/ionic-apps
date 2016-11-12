/**
 * 定义Controller的js
 */
angular.module('demo1_app.controllers',[])

.controller('tab1Controller', function($scope) {

})
.controller('tab2Controller', function($scope) {
    $scope.id = 12;

})
.controller('tab2-contentController', function($scope, $stateParams) {
    $scope.id = $stateParams.id;
})
.controller('tab3Controller', function($scope) {

});