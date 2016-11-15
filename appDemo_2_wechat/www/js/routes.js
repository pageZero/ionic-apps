//配置路由
angular.module('wechat.routers',[])
.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
        //如果tab状态被激活，加载tabs.html模板
        //注意这里的abstract:true,表示tab只有在子状态显示的时候它才显示，它本身是无法主动被激活的
        .state('tab', {
            url:'/tab',
            abstract:true,
            templateUrl:'templates/tabs.html'
        })
        //tab.message状态被激活，会显示tab-message.html模板，tab.message状态是在tabs.html中的ui-sref中设置的。
        //注意views中的tab-message这个名字，需要和tabs,html中的ion-nav-view中的name一致
        //用.标识子父级关系
        .state('tab.message', {
            url:'/message',
            views: {
                'tab-message' : {
                    templateUrl:'templates/tab-message.html',
                    controller:'messageCtrl'
                }
            }
        })
        
        //通讯录
        .state('tab.friends', {
            url:'/friends',
            views: {
                'tab-friends' : {
                    templateUrl:'templates/tab-friends.html',
                    controller:'friendsCtrl'
                }
            }
        })

        //发现
        .state('tab.find', {
            url:'/find',
            views: {
                'tab-find' : {
                    templateUrl:'templates/tab-find.html',
                    controller:'findCtrl'
                }
            }
        })

        //设置
        .state('tab.setting', {
            url:'/setting',
            views: {
                'tab-setting' : {
                    templateUrl:'templates/tab-setting.html',
                    controller:'settingCtrl'
                }
            }
        })

        //消息详情页
        .state('messageDetail', {
            url:'/messageDetail/:messageId',
            templateUrl:'templates/message-detail.html',
            controller:'messageDetailCtrl'
        })
    //默认状态是tab.message
    $urlRouterProvider.otherwise("/tab/message")
})