angular.module('wechat.controllers', [])

//.controller('messageCtrl', function($scope, $state, $ionicPopup, localStorageService, messageService) {
.controller('messageCtrl',['$scope','$state','$ionicPopup','messageService', 
    function($scope, $state, $ionicPopup, messageService) {

      
    $scope.popup = {
        isPopup: false,
        index: 0
    };

    $scope.onSwipeLeft = function() {
        //console.log("onSwipeLeft");
        $state.go("tab.friends");
    };

    //长按item
    $scope.popupMessageOptions = function($index) {
        //console.log("popupMessageOptions");
        $scope.popup.index = $index;
        //通过$ionicPopup.show创建一个自定义的popup
        $scope.popup.optionsPopup = $ionicPopup.show({
            templateUrl: "templates/popup.html",
            scope:$scope,
        });
        $scope.popup.isPopup = true;
    };

    //单击item
    $scope.messageDetails = function(message) {
        //console.log("轻击");
        $state.go("messageDetail", {
            "messageId":message.id
        });
    };
    //实现标记为已读未读，注意$scope.popup.optionsPopup.close()方法
    //用来关闭弹窗
    $scope.markMessage = function() {
        //console.log("点击了markMessage函数");
        
        var index = $scope.popup.index;
        var message = $scope.messages[index];
        console.log(index);
        if (message.showHints) {//点击了设置为已读
            message.showHints = false;
            message.noReadMessages = 0;
        } else {////点击了设置为未读
            message.showHints = true;
            message.noReadMessages = 1;
        }
        $scope.popup.optionsPopup.close();
        $scope.popup.isPopup = false;
       // $scope.messages[index] = message;
        messageService.updateMessage(message);
        
    };
    
    $scope.topMessage = function() {
        var index = $scope.popup.index;
        var message = $scope.messages[index];
        var firstMessage = {};
        if(message.isTop) {//说明点击的是取消置顶
            message.isTop = 0;
            //console.log("取消置顶");
        } else {
            // console.log("置顶");
            message.isTop = new Date().getTime();
            //如果当前有置顶的消息，改变其状态-->因为只能有一个消息置顶
            firstMessage = $scope.messages[0];
            if(firstMessage.isTop) {
                firstMessage.isTop = 0;
                messageService.updateMessage(firstMessage);
            }
            //改变顺序
            $scope.messages.splice(index, 1);
            $scope.messages.splice(0, 0, message); 
        }
        $scope.popup.optionsPopup.close();
        $scope.popup.isPopup = false;
        messageService.updateMessage(message);
    };

    
    $scope.deleteMessage = function() {
        var index = $scope.popup.index;
        var message = $scope.messages[index];
        //从当前列表中删除这歌message
        $scope.messages.splice(index, 1);
        $scope.popup.optionsPopup.close();
        $scope.popup.isPopup = false;
        //在本地存储中删除
        messageService.deleteMessageId(message.id);
        messageService.removeMessage(message);
    };

    /**
     * 从文件中获取数据的方法写在app.js的run()中，用来初始化全局数据
     */
    //$on接收事件和数据方法
    $scope.$on("$ionicView.beforeEnter", function() {
       
        $scope.messages = messageService.getAllMessages();
        console.log("--------controller中------------");
        //console.log($scope.messages);
        
    });
    
 }]) 

.controller('friendsCtrl', ['$scope', '$state',function($scope, $state) {
    //$scope.name = '2';
    $scope.$on("$ionicView.beforeEnter", function(){
        // handle event
        //console.log("State Params: ", data.stateParams);
        console.log("friends ctrl $on");
    });
    $scope.onSwipeLeft = function() {
        $state.go("tab.find");
    }

    $scope.onSwipeRight = function() {
        $state.go("tab.message");
    }
}])

.controller('findCtrl', ['$scope', '$state',function($scope, $state) {
    //$scope.name = '2';
    $scope.$on("$ionicView.beforeEnter", function(){
        // handle event
        //console.log("State Params: ", data.stateParams);
        console.log("find ctrl $on ");
    });
    $scope.onSwipeLeft = function() {
        $state.go("tab.setting");
    }

    $scope.onSwipeRight = function() {
        $state.go("tab.friends");
    }
    
}])

.controller('settingCtrl', ['$scope', '$state',function($scope, $state) {
    //$scope.name = '2';
    $scope.$on("$ionicView.beforeEnter", function(){
        // handle event
        //console.log("State Params: ", data.stateParams);
        console.log("setting ctrl $on");
    });
    $scope.onSwipeRight = function() {
        $state.go("tab.find");
    }
}])

.controller('messageDetailCtrl', ['$scope', '$stateParams',
    'messageService', '$ionicScrollDelegate', '$timeout',
    function($scope, $stateParams, messageService, $ionicScrollDelegate, $timeout) {

    var viewScroll = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
        // console.log("enter");
        $scope.doRefresh = function() {
            // console.log("ok");
            $scope.messageNum += 5;
            $timeout(function() {
                $scope.messageDetils = messageService.getAmountMessageById($scope.messageNum,
                    $stateParams.messageId);
                $scope.$broadcast('scroll.refreshComplete');
            }, 200);
        };

        $scope.$on("$ionicView.beforeEnter", function() {
            //console.log("beforeEnter");
            $scope.message = messageService.getMessageById($stateParams.messageId);
            $scope.message.noReadMessages = 0;
            $scope.message.showHints = false;
            messageService.updateMessage($scope.message);
            $scope.messageNum = 10;
            $scope.messageDetils = messageService.getAmountMessageById($scope.messageNum,
                $stateParams.messageId);
            $timeout(function() {
                viewScroll.scrollBottom();
            }, 0);
        });

        window.addEventListener("native.keyboardshow", function(e){
            viewScroll.scrollBottom();
        });
}])