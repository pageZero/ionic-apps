angular.module('wechat.directives', [])

.directive('rjCloseBackDrop', [function() {
    return {
        scope: false,//共享父scope
        restrict:'A',//定义这个指令作为属性使用
        replace:false,
        link: function(scope, iElm, iAttrs, controller) {
            //要在html上添加点击事件。。。点击之后关闭弹窗
            //在dom树中获取整个html标签包裹的内容
            var htmlEl = angular.element(document.querySelector('html'));
            htmlEl.on("click", function(event) {
                if(event.target.nodeName === "HTML" &&
                    scope.popup.optionsPopup &&
                    scope.popup.isPopup) {
                    scope.popup.optionsPopup.close();
                    scope.popup.isPopup = false;
                }
            });

        }
    }
}])

.directive('rjHoldActive', ['$ionicGesture', '$timeout', '$ionicBackdrop',
        function($ionicGesture, $timeout, $ionicBackdrop) {
            return {
                scope: false,
                restrict: 'A',
                replace: false,
                link: function(scope, iElm, iAttrs, controller) {
                    $ionicGesture.on("hold", function() {
                        iElm.addClass('active');
                        //300ms后恢复
                        $timeout(function() {
                            iElm.removeClass('active');
                        }, 300);
                    }, iElm);
                }
            };
        }
])

.directive('resizeFootBar',['$ionicScrollDelegate', function($ionicScrollDelegate) {
    return {
        replace:false,
        link: function(scope, iElm, iAttrs, controller) {
            console.log(iElm);
            scope.$on('elastic:resize', function(event, element, oldHeight, newHeight) {

                var scroll = document.body.querySelector("#message-detail-content");
                var scrollBar = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
                var newFooterHeight = newHeight + 10;
                //footerHeight的高度最多为44,
                newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;
                iElm[0].style.height = newFooterHeight + 'px';

                //下面两行，解决键盘弹出覆盖聊天内容的bug
                //增加聊天内容区高度
                scroll.style.bottom = newFooterHeight + 'px';
                //滚动到底部
                scrollBar.scrollBottom();
            });
            //绑定taResize事件，接收子控制器传上来的数据
            /*scope.$on("taResize", function(e, ta) {
                //console.log(ta);
                if(!ta) return;
                var scroll = document.body.querySelector("#message-detail-content");
                var scrollBar = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
                var taHeight = ta[0].offsetHeight;
                var newFooterHeight = taHeight + 10;
                newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

                //调整ion-footer-bar的高度
                iElm[0].style.height = newFooterHeight + 'px';

                //下面两行，解决键盘弹出覆盖聊天内容的bug
                //增加聊天内容区高度
                scroll.style.bottom = newFooterHeight + 'px';
                //滚动到底部
                scrollBar.scrollBottom();
            })*/
        }
    }
}])