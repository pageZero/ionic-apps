# AngularJS笔记

## AngularJS进阶

### 1. AngularJS中的服务service,provider等

**AngularJS的controller应该很薄，应用里大部分的业务逻辑和持久化数据都应该放在service里**

**出于性能的考虑，controller只会在需要的时候才初始化，一旦不需要就会被抛弃，所以，每次切换或刷新页面的时候，Angular会清空当前的controller,此时，可以用service来永久保存数据，并且这些数据可以在不同的controller中使用。**

1. provider服务

   使用provide可以自定义服务，有两种使用方式：
   * 在angular.module声明是使用它的第三个参数注入$provide,从$provide中获取到provider
   
            var m1 = angular.module('myApp',[],function($provide){
                    $provide.provider('providerServices01',function(){
                        this.$get=function(){
                            return {
                                message:'this is providerServices01'
                            }
                        }
                    })
                });

   * 使用config函数进行配置

            var m1 = angular.module('myApp',[]);

            m1.config(function($provide){
                    $provide.provider('providerServices01',function(){
                        this.$get=function(){
                            return {
                                message:'this is providerServices01'
                            }
                        }
                    });
                     //可以定义多个类似的服务，取不同的名字即可
                    //...
            })
    
2. factory服务

   也可以像provider一样通过$provide获取到，使用上要比provider简单一些。

        $provide.factory('factoryServices01',function(){
            return {
                message:'this is factoryServices01'
            }
        });
3. service服务

   和factory用法类似，需要区别的是：

   provider和factory都可以返回对象/字符串，而service只能返回对象。而provider中要把返回的内容放入$get函数中。

4. 总结

    配置服务的3种方式：
    * 声明module的第三个参数function中使用$provide进行定义;
    * 在config函数中使用$provide进行配置;
    * 直接使用module的factory(),service(),provider()进行配置，需要传入两个参数：(服务名,回调函数);

    **几个服务间的重要区别：**
    * service中可以直接使用this关键字来定义方法。而factory中要先声明对象，给对象添加方法。

            this.setName = function(name) {
                _name = name;
            }

            return this;
    * provider需要使用$get进行返回。
    * provider服务是唯一一个可以传入config函数的服务，需要注意书写规范prividerServiceName+Provider。

            var m1 = angular.module('mgApp',[]);

            //将下面定义的privider服务传入config函数中进行配置
            m1.config(function(providerService_1Provider) {
                //配置了provider中定义的属性
                providerService_1Provider.name = "zzz";
            })
            m1.provider('providerService_1', function() {
                //在config函数中配置的属性
                this.name = "";

                this.$get = function() {
                    var that = this;
                    var service = {};

                    //外部调用的配置函数，在controller中注入这个服务就可以调用这个方法
                    //由于config函数中对name进行了配置，所以调用这个函数会输出"zzz+provider中设置配置信息"
                    service.getConfigName = function() {
                        return that.name+"+provider中设置配置信息";
                    }
                    return service;
                }
            })

### 2. AngularJS中的服务的使用技巧

1. 把网络请求放在service中，不要让controller处理过多的逻辑，controller只要做一些逻辑判断就可以。

   在`service`中注入`$http`,做数据请求的操作，然后直接return给Controller，*success/error这些回调函数放在controller中进行。*

        m1.service('httpService', function($http, $rootScope) {
            this.getData = function() {
                var url = "http://www.xxx.com";
                //这里使用cache设置了http缓存
                return $http.jsonp(url,{cache:true});
            };
        })

        m1.controller('indexController',['$scope','httpService',function($scope, $httpService) {
            httpService.getData().success(function(data) {
                console.log(data);
            }).error(function() {
                alert("请求失败");
            });
        }])

 2. 在service服务中，不能注入$scope,当时可以使用$rootScope.

### 3. 其他常用服务$http,$location,$anchorScroll,$cacheFactory,$timeout,$interval,$sce

1. **$location**可以解析地址栏的url。

   $location和$anchorScroll一起使用：

   `$anchorScroll`注入控制器可以实现在改变地址栏的地址，就可以定位到html中的某个id。

   `$location`可以将某个html容器的id加入地址栏，在地址栏中加入参数。

2. **$cacheFactory** 用来缓存

   注：
   * localStorage是将数据存储到本地，永久保存；
   * sessionStorage只要不关闭浏览器也是指存有数据；
   * cacheFactory只要没有当前没有put数据就不会拿到数据。

   使用：可以用于不同controller之间共享数据。

        //在controller中注入$cacheFactory
        var cache = $cacheFactory('cacheId');
        cache.put("name","zero");

        //在另一个控制器中获取
        var cache = $cacheFactory.get('cacheId');
        $scope.name = cacheFactory.get('name');

3. **$sce服务** 用来解析html格式的文本

    使用场景：后台传回html格式的文本，如果不通过解析直接显示在页面上，会连标签一起显示，没有效果，这时可以使用`$sce.trastAsHtml(data);`就可以得到解析之后的文本。

### 4. AngularJS中的路由

路由用于页面导航，要使用路由必须先引入对应的js文件，然后在声明模板的时候注入ngRoute.

注：*在module.config函数中使用`$routeProvider`进行配置.*

**$routeParams** 用于在页面导航时传入参数。

使用场景：点击列表的某一项进入详细item。

使用方法：
* 在链接的时候这么写：`<a href="#content/13">点击去内容</a>`
* 在控制器中:注入`$routeParams`,从$routeParams获取到传入的参数`$scope.id = $routeParams.id;`
* 在config函数中设置导航：`when('/content/:id/')`,这里的id对应$routeParams的id.

ionic中用的是angularJS的ui-router路由，使用上了上面这个差不多.


**路由跳转的两种方式：**
* 在html的a标签中用href进行跳转。`<a href="#content">跳转</a>`
* 使用$location服务进行跳转,js切换的方式。

        //先在controller中注入$location
        //将传入的$location这个服务赋值类$scope的变量，这样就可以在html在使用$location服务了
        $scope.$location = $location;

        //在html中使用$location.path
        <a ng-click="$location.path('div1')">点击链接</a>
        <a ng-click="$location.path('/div1')">点击链接</a>

### 5. 使用ngAnimate插件实现动画效果

使用方法：
* script引入js文件。
* 注入模块`var m1 = angular.module('myApp',[ngAnimate]);`

使用的几种方式
1. ngAnimate CSS使用方式

   **a. 支持ng-if,ng-view,ng-repeat,include,switch的指令**

   ng-repeat:ng-enter-stagger animation--delay

   对应的CSS3样式：ng-enter,ng-enter-antive,ng-leave,ng-leave-active

        //使用上面这些命令定义样式
        <style>
        .box{ width:200px; height:200px; background:red; transition:2s all;}

        .box.ng-enter{
            opacity: 0;
        }
        .box.ng-enter-active{
            opacity: 1;
        }
        .box.ng-leave{
            opacity: 1;
        }
        .box.ng-leave-active{
            opacity: 0;
        }
        </style>

        //直接在html标签中使用
        //ng-if：如果bBtn为true就显示,显示样式为box，如果bBtn为false就不显示
        //自定执行对应的ng-enter,ng-enter-active...样式
        <input type="checkbox" ng-model="bBtn">
        <div ng-if="bBtn" class="box"></div>


**b. 支持class,show,hide,model等**

  对应的CSS3样式：ng-hide-add ng-hide-add-active ng-hide-remove ng-hide-remove-active 
       
  使用：和上面差不多，只不过html中使用ng-show;样式定义时使用ng-hide-add...

  *注：不同的ng命令对应着不同的ngAnimate样式，需要注意区分。*

2. ngAnimate js使用方式

   **关键**：module的animate(),enter/leave(对应上面的ng-if等命令),removeClass/addClass(对应上面的ng-show等命令)

        //在html中定义标签
        <div ng-if="bBtn" class="box"></div>

        //在js文件中，基于module的animation()为box这个类别的标签定义动画
        var m1 = angular.module('mApp',['ngAnimate']);
        
        //两个参数：需要定义动画的class，回调函数
        m1.animation('.box', function() {
            return {
                //使用ng-if时，对应两个函数enter/leave
                //两个参数:动画作用的类对象，done表示动画结束
                enter:function(element,done) {
                    //这里调用jQuery的函数
                    
                    //为元素定义样式
                    $(element).css({width:0,height:0});
                    //设置动画

                    //注意这里在设置动画时要传入done，否则当动画播放结束时，div标签还在，而我们使用ng-if是希望标签直接从dom中删除的
                    $(element).animate({width:200,height:200,1000,done});
                },
                leave:function(element,done) {
                    $(element).animate({width:0,height:0,1000,done});
                }
            }
        })

    注：
    * 如果使用ng-show这类的命令，就对应的使用removeClass/addClass函数。
    * removeClass和leave是一样的，addClass和enter是一样的。
    * 使用removeClass/addClass时有三个参数,Sclass这个参数不常使用

            removeClass:function(element,Sclass,done) {
                        //这里调用jQuery的函数
                        
                        //为元素定义样式
                        $(element).css({width:0,height:0});
                        //设置动画

                        //注意这里在设置动画时要传入done，否则当动画播放结束时，div标签还在，而我们使用ng-if是希望标签直接从dom中删除的
                        $(element).animate({width:200,height:200,1000,done});
                    },

### 6. 使用ngResource进行数据请求

介绍：$resource封装了能力较低的http服务。

使用方法：引入angular-resource的js文件 --> 在模板中注入$resource --> 使用$resource的函数。

使用：4个参数，常用前两个
$resource(url,[paramDefaults],[action],options);

支持的方法：

    { 'get':   {method:'GET'}, //只能请求一条数据
    'save':   {method:'POST'}, 
    'query':  {method:'GET', isArray:true},//可以查询多条数据
    'remove': {method:'DELETE'}, 
    'delete': {method:'DELETE'}  
    }; 

和$http的区别：使用上比$http更为简单，$http一般都有回调函数，而$resource可以不写回调函数。使用更方便。

**案例：**
* 案例一：简单案例

        //先在controller中注入$resource
        var obj = $resource('url');

        //调用get方法
        $scope.data = obj.get();//获取一条记录

        //添加参数的get
        //三个参数：传到服务器的参数{name:'zzz'};成功的回调函数;失败的回调函数
        //注：不建议使用回调函数
        $scope.data = obj.get({name:'zzz'}, function(data) {
            console.log(data);
        }, function(error) {
            console.log(error);
        })

* 案例二：使用变量拼接的url地址

        var obj = $resource(':name,:type');

        //在调用get函数的时候这只请求路径
        //说明请求的地址是xxx.json
        $scope.data = obj.get({name:'xxx',type:'json'});

        * 案例三：使用$resource的第三个参数,主要是传参

        var obj = $resource(':name.:type', {type:'json'});

* 案例四：使用$resource的第四个参数，配置请求的信息

        //在请求后台的时候，可以把定义的参数age,sex的值传到后台
        var obj = $resource('ata.json', {id:'@id'},{getAge:{method:'GET',params:{age:'40'},isArray:false},
        getSex:{{method:'GET',params:{sex:'male'},isArray:false}});

        //调用getXXX()传入参数
        //这里的id就是$resource中请求用到的id
        $scope.data = obj.getAge({id:'20'});
        $scope.data1 = obj.getSex({id:'20'});







