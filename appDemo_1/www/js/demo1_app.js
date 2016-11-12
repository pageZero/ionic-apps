
angular.module('demo1_app', ['ionic','demo1_app.controllers'])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  /**
   * 使用了状态的继承，这里的几个tab都共用tabs,将tas看成是公用的部分，使用状态的继承达到共用tabs的效果
   * 状态的继承有3种方式，这里用的是.标记的方式。
   * 
   * abstract: true 用abstract修饰表示这个状态不会被显示的激活，它是抽象的，只有当子类状态被激活，这个状态才会被隐式的激活。
   * 不过在ionic中，加不加abstract都可以达到这样的效果。
   */
  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/demo1-tabs.html',
  })

  // Each tab has its own nav history stack:

  //views:使用多视图来指定要加载哪个view
  .state('tab.tab1', {
    url: '/tab1',
    views: {
      'tab-tab1': {
        templateUrl: 'templates/demo1-tab-tab1.html',
        controller: 'tab1Controller'
      }
    }
  })

  .state('tab.tab2', {
    url: '/tab2',
    views: {
      'tab-tab2': {
        templateUrl: 'templates/demo1-tab-tab2.html',
        controller: 'tab2Controller'
      }
    }
  })

  .state('tab.tab2-content', {
    url: '/tab2-content/:id',
    views: {
      'tab-tab2': {
        templateUrl: 'templates/demo1-tab2-content.html',
        controller: 'tab2-contentController'
      }
    }
  })

    .state('tab.tab3', {
    url: '/tab3',
    views: {
      'tab-tab3': {
        templateUrl: 'templates/demo1-tab-tab3.html',
        controller: 'tab3Controller'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/tab1');

});
