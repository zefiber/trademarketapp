/**
 * Created by wangz on 6/14/2016.
 */

//Routers
tradeapp.config(function ($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html',
      cache: false
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'RealTimeDataCtrl',
          cache: false
        }
      }
    })


    .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    })

    .state('welcome', {
      url: '/welcome',
      templateUrl: 'templates/welcome.html',
      controller: 'WelcomeCtrl'
    })


    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })

    .state('listWatchlist', {
      url: '/listWatchList',
      templateUrl: 'templates/list-watchlist.html',
      controller: 'listWatchListCtrl',
      cache:false
    })

    .state('listAcctlist', {
      url: '/listAcctList',
      templateUrl: 'templates/list-accountlist.html',
      controller: 'listAcctListCtrl',
      cache:false
    })

    .state('detailWatchlist', {
      url: '/detailWatchList',
      templateUrl: 'templates/detail-watchlist.html',
      controller: 'detailWatchListCtrl'
    })


    .state('forgotpassword', {
      url: '/forgotPassword',
      templateUrl: 'templates/forgot-password.html',
      controller: 'forgotPwdCtrl'
    })

    .state('signUp', {
      url: '/signUp',
      templateUrl: 'templates/signup.html',
      controller: 'SignUpCtrl'
    })

    .state('customizeWatchList', {
      url: '/customizeWatchList',
      templateUrl: 'templates/customize-watchlist.html',
      controller: 'customizeWatchListCtrl',
      cache: false
    })

    .state('searchNewStock', {
      url: '/searchNewStock',
      templateUrl: 'templates/search-new-stock.html',
      controller: 'searchNewStockCtrl'
    })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');

});
