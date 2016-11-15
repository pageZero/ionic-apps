// Ionic App appDemo_2_wechat

angular.module('wechat', ['ionic', 'wechat.controllers', 'wechat.routers',
    'wechat.services', 'wechat.directives', 'monospaced.elastic'])

.config(['$ionicConfigProvider', function($ionicConfigProvider) {

  $ionicConfigProvider.tabs.position('buttom');//other values: top

}])

//run方法进行全局数据的初始化
.run(function($ionicPlatform, $rootScope, $http, messageService, dateService) {
  $rootScope.isSub = false;
    var url = "";
    if(ionic.Platform.isAndroid()) {
      url = "/android_asset/www/"
    }

    //读取文件中的json数据
    $http.get(url + "data/json/messages.json").then(function(response) {
      //console.log("---------------------------");
      //console.log(response.data.messages);
      messageService.init(response.data.messages);
      //console.log("---------------------------");
    });

    //读取friends的信息
    $http.get(url + "data/json/friends.json").then(function(response) {
      //console.log(response.data.results);
    })

    //平台相关的。。。
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)


        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

