# AngularJS笔记

## AngularJS基础

1. **$scope和$rootScope的作用域**

   $scope：拥有局部作用域，作用于一个控制器。
   
   $rootScope：作用于全局。

2. **run方法**

   用于初始化全局数据，并且只能注入$rootScope,不能注入$scope，html中可以直接使用run方法中声明的变量。

        app.run(['$rootScope', function($rootScope) {
            $rootScope.name = 'zzz';
        }]);

3. **$scope的$apply方法**
   
   传播model的变化。

   使用场景：当我们使用定时器改变model时，需要借助于$apply来传播model的改变，否则定时器中对model的改变时无效的。

        //无效的方法
        setTimeout(function() {
            $scope.name = 'zzz';
        },2000);

        //有效的方法
        setTimeout(function() {
            $scope.$apply(function() {
                $scope.name = 'zzz';
            });
        },2000);

4. **angularJs的工具方法**

        ...
        angular.isArray
        angualr.isEmpty
        angualr.equals//判断是否相等
        angualr.extend(a,b);//a基础b,a拥有b的属性
        angualr.copy(a,b);//a copy给b,b变成和a一样
        angualr.toJson;//将对象转为json字符串
        angualr.fromJson;//从json字符串中识别出对象
        ...
    **angualr.forEach** 用于遍历对象中的key-value

     参数：要遍历的对象
          遍历的回调函数
          数组(可以在遍历时对数组进行操作)

        var person = {"name":"zzz", "age":"20"};
        angualr.forEach(person, function(val, key) {
            console.log(key+":"+val);
        });

        var results = [];
        var person = {"name":"zzz", "age":"20"};
        angualr.forEach(person, function(val, key) {
            console.log(key+":"+val);
            this.push(val);
        },results);

     **angualr.bind** 绑定对象，作为函数上下文，可以获取对象值，并对其进行修改
  
        var self = {name:"zzz"};
        var f = angualr.bind(self, function(age) {
            //函数内使用this开代替绑定的对象
            $scope.info = this.name+"is"+age;
            console.log($scope.info);
        });
        //调用函数
        f(30);
  
   **angualr.bootstrap** 用于动态初始化模型ng-model
  
    一般情况下，页面只有一个ng-model，但是也可以有多个，当多个ng-model并列的时候，在加载页面时只会加载第一个ng-model,可以设置点击事件，使用anguar.bootstrap对model进行动态初始化。
        
        var div = document.getElementById('content');
        document.onclick = function() {
            //div是模板对应的容器
            //myApp1是上面初始化的模板
            angualr.bootstrap(div,['myApp1']);
        };

5. **angualrJS插件的引入方式**(常用)
   
   a. 在html中先引入对应的js文件

   b. 在页面对应的app.js中挂载另一个文件声明的module
      
        var app1 = angualr.module("myApp", ['myApp2']);

6. **防止刷新页面时出现两个大括号**
   
   eg:`{{name}}`
   
   方法一：使用ng-bind,`<div ng-bind="name"></div>`
   
   方法二：使用ng-cloak,`<div ng-cloak>{{name}}</div>`

7. **input标签的相关命令**

   `ng-disabled;//设置不可用`

   `ng-readonly;//设置只能读`

   `ng-value;//和input标签的value是一样的`

   设置定时任务：`$interval` 取消：`$interval.cancel(timer);`

8. 样式命令
   
        <!--或者直接在Controller中定义样式，然后用{{}}绑定-->
        ng-class={red:true}
        ng-style={{red}}
        <!--解决页面为加载完成时img显示无图片，或者链接点击无效的情况-->
        ng-src={{url}}
        ng-href={{url}}

9. **DOM操作<重要>**
   
    `ng-show="ture/false"  显示或隐藏结点`

    `ng-if="true/false" 直接在DOM树中删除结点,false删除结点`

    `ng-switch`

        <div ng-switch on="s">
                <p ng-switch-default>默认效果</p>
                <p ng-switch-when="false">false切换效果</p>
                <p ng-switch-when="true">true切换效果</p>
        </div>

10. **其他常用命令**
    
    `ng-bind-template` 类似于ng-bind，但是可以绑定多个model
    
    `ng-bind-html` 需要先引入插件sanitise(用**5**中记录的方法)

    非常有用，可以借助$sce.trustAsHtml将后台返回的json数据转为html显示(此时不需要引入插件)

    `ng-model-option` 双向数据绑定时，使用该命令进行设置，使得数据的改变不会马上更新，而是在鼠标离开输入框之后才更新。

11. **引入模板**
    
    ng-include和ng-template结合使用
    
    步骤：
    在script中使用ng-template定义模板/在外部页面中定义html文件-> 在controller中声明变量，指向模板->在html中使用ng-include引入模板

12. **使用filter服务($filter)和自定义filter过滤器**【重要】
    
    使用过滤器对感兴趣的内容进行查询。[11讲]

    使用场景：
    * 在html中使用
    * 在Controller中用`$filter`使用

            //参照在html中使用的场景，传入多个参数
            //使用的服务(data,uppercase)和需要过滤的数据
            $scope.name = $filter('date')('236478234','hh'); 
            $scope.name = $filter('uppercase')('hello'); 
    * 自定义模块，然后为这个模块设置filter,在app.js中注入这个模块

            var filterModel = angualr.module('filter-module',[]);
            filterModel.filter('helloRep', function() {
                return function(input) {
                    return input.replace(/hello/,"你好");
                };
            });

            //在app.js中注入，就可以在html中使用helloRep
            var app = angualr.module('myApp',['filterModel']);
