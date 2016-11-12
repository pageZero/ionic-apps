# tab的使用

1. 在html中定义共同的ion-nav-bar

2. 用ion-view定义tab.html，包含所有的tab，当成一个模板。

3. 在tabs中定义多个tab，tab内部要本来是要包含tab对应的内容，采用模块化来发的思想，将内部的contetn动态载入，用ion-nav-view代替contetn，表示动态载入模板。

4. 如何动态载入？配置路由，在app.js中的config函数中用$stateProvider配置路由信息。
* 由于tabs时多个tab页面共享的，可以使用状态继承，也就是`嵌套路由`。多个tabx继承自tab，共享页面底部的tabs.

        //另一父状态
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

* views:使用多视图来指定要加载哪个view，状态继承的时候使用。

5. 对于列表详情页这样的情况如何处理？

   进入列表详情页的时候传入列表的下标，用这个下标在列表详情页加载详情信息。

   由于列表详情页是依托于列表页面，所以在路由配置的时候加载的ion-nav-vewi的name是列表页的name.

        .state('tab.tab2', {
            url: '/tab2',
            views: {
            'tab-tab2': {
                templateUrl: 'templates/demo1-tab-tab2.html',
                controller: 'tab2Controller'
            }
            }
        })

        //views用的tab-tab2,但是加载的是content
        .state('tab.tab2-content', {
            url: '/tab2-content/:id',
            views: {
            'tab-tab2': {
                templateUrl: 'templates/demo1-tab2-content.html',
                controller: 'tab2-contentController'
            }
            }
        })

# tab结合ion-side-menus使用

1. 在index中定义side-menus的侧边栏和内容区域。

2. 由于tabs的内容属于内容区域，所以需要放在side-menus-content中。

3. 动态加载tabs，在side-menus-content定义好nav-bar,然后使用ion-nav-view动态载入tabs，搭配路由使用。
