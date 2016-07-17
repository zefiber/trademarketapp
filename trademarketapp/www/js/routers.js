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

    .state('tab.holdings', {
      url: '/holdings',
      views: {
        'tab-holdings': {
          templateUrl: 'templates/tab-holdings.html',
          //controller: 'AcctHoldingsCtrl',
          cache: true
        }
      }
    })


    .state('tab.orders', {
      url: '/orders',
      views: {
        'tab-orders': {
          templateUrl: 'templates/tab-orders.html',
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

    .state('tab.activities', {
      url: '/activities',
      views: {
        'tab-activities': {
          templateUrl: 'templates/tab-activities.html',
          controller: 'AccountCtrl'
        }
      }
    })

    .state('tab.acctsummary', {
      url: '/acctsummary',
      views: {
        'tab-acctsummary': {
          templateUrl: 'templates/tab-acct-summary.html',
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
      // controller: 'LoginCtrl'
    })

    .state('listWatchlist', {
      url: '/listWatchList',
      templateUrl: 'templates/list-watchlist.html',
      //controller: 'listWatchListCtrl',
      cache:false
    })

    .state('listAcctlist', {
      url: '/listAcctList',
      templateUrl: 'templates/list-accountlist.html',
      //controller: 'listAcctListCtrl',
      cache:false
    })

    .state('detailWatchlist', {
      url: '/detailWatchList',
      templateUrl: 'templates/detail-watchlist.html',
      controller: 'detailWatchListCtrl',
      cache:false
    })


    .state('forgotpassword', {
      url: '/forgotPassword',
      templateUrl: 'templates/forgot-password.html',
      controller: 'forgotPwdCtrl'
    })

    .state('signUp', {
      url: '/signUp',
      templateUrl: 'templates/signup.html',
      // controller: 'SignUpCtrl'
    })

    .state('customizeWatchList', {
      url: '/customizeWatchList',
      templateUrl: 'templates/customize-watchlist.html',
      // controller: 'customizeWatchListCtrl',
      cache: false
    })

    .state('editListWatchList', {
      url: '/editListWatchList',
      templateUrl: 'templates/edit-list-watchlist.html',
      // controller: 'customizeWatchListCtrl',
      cache: true
    })

    .state('customizeAccount', {
      url: '/customizeAccount',
      templateUrl: 'templates/customize-account.html',
      //controller: 'customizeAcctCtrl',
      cache: true
    })

    .state('searchNewStock', {
      url: '/searchNewStock',
      templateUrl: 'templates/search-new-stock.html',
      //controller: 'searchNewStockCtrl'
      cache: false
    })

    .state('editWatchList', {
      url: '/editWatchList/:isNew',
      templateUrl: 'templates/edit-list-watchlist.html',
      cache: false
    })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');

});
