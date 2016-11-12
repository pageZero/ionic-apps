// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('todo', ['ionic'])

.controller('TodoCtrl', function($scope) {
  $scope.tasks = [
    {
      title:'菜鸟教程'
    }, {
      title:'www.runoob.com'
    }, {
      title:'菜鸟教程'
    }, {
      title:'www.runoob.com'
    }
  ];

  //创建并载入模型
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope:$scope,
    animation:'slide-in-up'
  });

  //表单提交时调用
  $scope.createTask = function(task) {
    
    $scope.tasks.push({
      title:task.title
    });
    //表的提交之后要隐藏新增Task的模板
    $scope.taskModal.hide();
    task.title = "";
  };

  //打开新增的模板
  $scope.newTask = function(){
    $scope.taskModal.show();
  }

  //点击关闭按钮的时候调用，关闭模板
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  }
});
