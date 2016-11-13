// Ionic App appDemo_2_wechat

angular.module('wechat', ['ionic', 'wechat.routers', 'wechat.controllers'])
.config(['$ionicConfigProvider', function($ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('buttom');//other values: top
}])

