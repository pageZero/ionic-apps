## 仿weChat客户端总结

做这个的时候是跟着大神写的博客做的，还是遇到了几个问题，这里记录一下。

### 1. $scope.$on方法不执行？？

过程中需要用$on监听ionicView状态变化，在ionicView进入之前左一些数据初始化的操作，结果遇到$on方法不执行，监听不到beforEnter事件。

最后原因出在载入的视图没有全部包含在`<ion-view></ion-view>`中,而是写成了这样

    <ion-header-bar>...</ion-header-bar>
    <ion-view>...</ion-view>

导致$on方法只能监听到loaded，beforeLeave，leave，afterLeave这几个事件，关于ion-view的生命周期事件[官方文档](http://ionicframework.com/docs/nightly/api/directive/ionView/ "Title")上有详细的说明。最后也就是将ion-header-bar放到ion-view中就可以了。

**ionicView的生命周期事件**

  事件   |    说明    |
--------|------------|
$ionicView.loaded | 视图已经被加载了。这事件只会发生一次，就是在视图被创建并添加到Dom中。当跳出页面并且被缓存了的话，再次访问这个页面时这个事件将不会被激活。Loaded事件可以让你为这个视图设置你的代码； 然而，不推荐用它去监听视图是否被激活。类似Activity的onCreat()方法。|
$ionicView.enter | 视图完全进入，变成一个活动视图，无论这个视图是第一次进入还是被缓存了，这个事件都会被激活。  |
$ionicView.leave | 视图完全离开，不在是一个活动视图。无论视图被缓存还是被销毁，这个事件都会被激活。  |
$ionicView.beforeEnter | 视图即将进入变成一个活动视图，类似于Activity的onResume()方法。  |
$ionicView.beforeLeave | 视图即将离开，不再是一个活动视图，类似于Activity的onPause()方法。  |
$ionicView.afterEnter | 视图完全进入，现在是一个活动视图。  |
$ionicView.afterLeave | 视图完全离开，不再是一个活动视图。  |
$ionicView.unloaded | 视图的控制器被销毁，视图元素也全部从DOM树中移除，相当于Activity的onDestroy()方法。 |
$ionicParentView.enter | 父视图已经完全进入...  |
$ionicParentView... | ...  |

 
*注：需要注意的是，当一个视图离开，另一个视图进入时，前一个视图的beforeLeave,leave,afterLeave和后一个视图的beforeEnter,enter,afterEnter是交叉执行的，进行控制器间传值的时候需要注意。避免使用不当，导致获取不到数据。*

### 2. 代码结构方面的问题

* 善用run方法，做一些初始化全局数据的操作

        angular.module('wechat',['ionic'])

        .run(function(...) {
            ...
        })

* 善用$on函数，$scope.$on函数可以监听事件变化，在开发中可以用来监听ionicView的生命周期事件，做一些数据初始化/数据缓存的操作；或者用来监听**子控制器**或者**父控制器**传播的事件，详见[这篇](http://blog.51yip.com/jsjquery/1602.html"Title")，在做可伸缩的输入框就用到这个，子控件向上传播事件，父控件用$on方法监听。

* 将数据获取/存储/计算这样的逻辑放在service中，然后在controller中调用这样方法完成工作，减轻controller的工作量，让controller变轻。

### 3. 滑动切换的tab如何实现

使用手势识别。在tab的内容ion-content上添加on-swipe-right/on-swipe-left，为其制定跳转函数，用$state进行路由跳转。

    <ion-content
        on-swipe-up="onSwipeUp()">
        Test
    </ion-content>

**其他手势事件**
手势事件    |    说明    |
--------|------------|
on-hold | 长按的时间是500毫秒。|
on-tap | 这个是手势轻击事件，如果长按时间超过250毫秒，那就不是轻击了。  |
on-double-tap | 手双击屏幕事件。  |
on-touch | 	这个和 on-tap 还是有区别的，这个是立即执行，而且是用户点击立马执行。不用等待 touchend/mouseup 。  |
on-release | 当用户结束触摸事件时触发。  |
on-drag | 	这个有点类似于PC端的拖拽。当你一直点击某个物体，并且手开始移动，都会触发 on-drag。 |
on-drag-up | 向上拖拽。  |
on-drag-right | 向右拖拽。 |
on-drag-down | 向下拖拽。  |
on-drag-left | 向左边拖拽。|
on-swipe  | 指手指滑动效果，可以是任何方向上的。而且也和 on-drag 类似，都有四个方向上单独的事件。
on-swipe-up	| 向上的手指滑动效果。
on-swipe-right | 向右的手指滑动效果。
on-swipe-down |	向下的手指滑动效果。
on-swipe-left |	向左的手指滑动效果。

### 4.可伸缩的输入框如何实现

使用[Angular Elastic插件](https://github.com/monospaced/angular-elastic "Title")

在需要加入可伸缩输入框的地方这样写：

    <textarea msd-elastic ng-model="foo">
    ...
    </textarea>

需要在module中加入依赖

    angular
    .module('yourApp', [
        'monospaced.elastic'
    ]);

可以在上层控制器中监听到输入框高度变化。

这是很重要的，因为有的组件(eg:ion-footer-bar)是有固定高度的，监听到内部的输入框的高度变化就可以动态改变其高度，否则可伸缩输入框不起作用。

    $scope.$on('elastic:resize', function(event, element, oldHeight, newHeight) {
        // do stuff
    });

在elastic.js文件中可以看到

    scope.$emit('elastic:resize', $ta, taHeight, mirrorHeight);

这里就是调用$emit函数向上层控制器传递数据。

*注：scope.$emit()是向父控制器提交数据，scope.$broadcast是向子控制器广播数据，而同级的控制器都是获取不到的。这一种方法可以用于控制器间传值。*