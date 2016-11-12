angular.module('todo',['ionic'])
/**
 * 工程提供对project进行操作的相关方法
 * 1.获取本地存储的所有project；
 * 2.存储projects到本地；
 * 3.新建一个project，一个project包括一个title和多个task.
 * 4.获取最近一次点击的project的下标。
 * 5.保存最近一次点击的project的下标。
 */
.factory('Projects', function() {
    return {
        //获取本地存储的projects
        all:function() {
            var projectString = window.localStorage['projects'];
            if(projectString) {
                return angular.fromJson(projectString);
            }
            return [];
        },
        save:function(projects) {
            //存储projects到本地
            window.localStorage['projects'] = angular.toJson(projects);
        },
        newProject: function(projectTitle) {
            //新建一个project
            return {
                title:projectTitle,
                tasks:[]
            };
        },
        getLastActiveIndex: function() {
            return parseInt(window.localStorage['lastActiveProject']) || 0;
        },
        setLastActiveIndex: function(index) {
            window.localStorage['lastActiveProject'] = index;
        }
    }
})

.controller('TodoCtrl', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate) {
    //根据给出的project的title创建一个project的函数
    var createProject = function(projectTitle) {
        var newProject = Projects.newProject(projectTitle);
        $scope.projects.push(newProject);
        Projects.save($scope.projects);
        $scope.selectProject(newProject, $scope.projects.length-1);
    }

    //加载或初始化projects
    $scope.projects = Projects.all();//通过工厂Projects获取本地存储的所有projects

    //获取最近的活动的project，如果没有，就获取第一个
    $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

    //创建一个新的project
    $scope.newProject = function() {
        var projectTitle = prompt('Project name');
        if(projectTitle) {
            createProject(projectTitle);
        }
    };

    //选中一个project
    $scope.selectProject = function(project, index) {
        $scope.activeProject = project;
        Projects.setLastActiveIndex(index);
        //选中一个project之后触发关闭左侧栏的操作
        $ionicSideMenuDelegate.toggleLeft(false);
    };

    //创建模板,加载页面
    $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
        $scope.taskModal = modal;
    }, {
        scope:$scope,
        animation:'slide-in-up'
    });

    //提交Task表单是调用
    $scope.createTask = function(task) {
        
        if(!$scope.activeProject || !task) {
            return;
        }
        $scope.activeProject.tasks.push({
            title:task.title
        });
        $scope.taskModal.hide();

        //保存projecs
        Projects.save($scope.projects);

        task.title = "";
    };

    $scope.newTask = function() {
        $scope.taskModal.show();
    };

    $scope.closeNewTask = function() {
        $scope.taskModal.hide();
    };

    $scope.toggleProjects = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $timeout(function() {
        if($scope.projects.length == 0) {
            while(true) {
                //弹出一个对话框，接收输入
                var projectTitle = prompt('Your first project title:');
                if(projectTitle) {
                    createProject(projectTitle);
                    break;
                }
            }
        }
    });
});