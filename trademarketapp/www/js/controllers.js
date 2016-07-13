angular.module('tradeapp.controllers', [])


  .controller('DashCtrl', function ($scope) {

  })

  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  })

  .controller('forgotPwdCtrl', function ($scope, $location, $log, $ionicPopup, $timeout, pageNameService, sendEmailForResetService) {

    $scope.sendEmail = function () {
      $scope.pageName = "forgotPassword";
      console.log("Forgot password");
      console.log($scope.model.email);

      //connect to service to validate
      sendEmailForResetService.sendEmail($scope.model).then(function success(data) {
        if (data && data === "user validation fail") {
          console.log("connect fail!");
          $ionicPopup.alert({
            title: 'Sign-in Failed',
            template: 'Please check that your username and password are correct!'
          });
        } else {
          console.log("login success");
          $location.path("/tab/dash");
        }

      }, function error() {
        //pop up
        console.log("connect fail!");
      });
    };


  })

  .controller('LoginCtrl', function ($scope, $state, $location, $log, $ionicPopup, $ionicActionSheet, $timeout, pageNameService, signInService) {

    $scope.login = function () {
      $scope.pageName = "login";
      console.log("Login");
      //console.log($scope.model.username);
      //console.log($scope.model.password);

      //connect to service to validate
      signInService.validateUser($scope.model).then(function success(data) {
        if (data && data === "user validation fail") {
          console.log("connect fail!");
          $ionicPopup.alert({
            title: 'Sign-in Failed',
            template: 'Please check that your username and password are correct!'
          });
        } else {
          console.log("login success");
          //$state.go("tab.dash");
          $location.path("/listWatchList");
        }

      }, function error() {
        //pop up
        console.log("connect fail!");
      });
    };


    $scope.forgotPwd = function () {
      // Show the action sheet for forgetting password
      var hideSheet = $ionicActionSheet.show({
          //titleText: 'ActionSheet title',
          buttons: [
            {text: 'Forgot Password?'},
            {text: 'Create a new User'},
          ],
          cancelText: 'Cancel',
          cancel: function () {
            console.log('CANCELLED');
          },
          buttonClicked: function (index) {
            console.log('BUTTON CLICKED', index);
            //choose create new user
            if (index && index === 1) {
              $location.path("/signUp");
            } else if (index === 0) {
              $location.path("/forgotPassword");
            }
            return true;
          }
        }
      )
    }

    pageNameService.setPageName("login");
    $log.log(pageNameService.getPageName());

  })


  .controller('listWatchListCtrl', function ($scope, $state, $location, $log, $ionicPopup, $ionicActionSheet, $timeout, pageNameService, localStorageService) {

    pageNameService.setPageName("list watchlist");
    $log.log(pageNameService.getPageName());

    // Get watchlists from localstorage, set default values
    $scope.watchlists = localStorageService.get('watchlists', [
      {
        id: '1',
        name: 'watchList1',
        desc: 'list1'
      },
      {
        id: '2',
        name: 'watchList2',
        desc: 'list2'

      }
    ]);

    localStorageService.update('watchlists', $scope.watchlists);

    $scope.onItemDelete = function ($index) {
      $scope.watchlists.splice($index - 1, 1);
      localStorageService.update('watchlists',$scope.watchlists);
    }

    $scope.goDetailWatchList = function () {
      $location.path("/detailWatchList");

    }

    $scope.goBackToListWatchList = function () {
      $location.path("/listWatchList");
    }

    $scope.editWatchList = function ($index) {
      $state.go("editWatchList", {isNew:$index});
    }


  })

  .controller('editWatchListCtrl', function ($scope, $location, $ionicHistory, $log, $state, $ionicPopup, $ionicLoading, $ionicFilterBar, $timeout, pageNameService, localStorageService) {
    pageNameService.setPageName("editWatchListCtrl");
    $log.log(pageNameService.getPageName());


    var watchlists = localStorageService.get('watchlists');

    function getWatchList(watchListId) {
      for (var i = 0; i < watchlists.length; i++) {
        if (watchlists[i].id == watchListId) {
          return watchlists[i];
        }
      }
      return undefined;
    }

    function updateWatchList(watchListObj, watchListId){
      for (var i = 0; i < watchlists.length; i++) {
        if (watchlists[i].id === watchListId) {
          watchlists[i].name = watchListObj.name;
          watchlists[i].desc = watchListObj.desc;
          localStorageService.update('watchlists',watchlists);
          return;
        }
      }

      var newWatchListObj = {
        id: watchListId,
        name: watchListObj.name,
        desc: watchListObj.desc
      }
      watchlists.push(newWatchListObj);
      localStorageService.update('watchlists',watchlists);
    }

    // Function to update the symbols in localstorage
    function updateSymbols() {
      var symbols = [];
      angular.forEach($scope.symbols, function (symbol) {
        symbols.push(symbol);
      });
      $scope.symbols = symbols;
      localStorageService.update('quotes', symbols);
    }

    $log.log("isNew:"+$state.params.isNew);




    $scope.editDone = function ($index) {
      // $location.path("/listWatchList");
      // $status.go("listWatchlist");

      // var watchlistObj = getWatchList($index);
      // $scope.name = watchlistObj.name;
      // $scope.desc = watchlistObj.desc;
      $ionicHistory.goBack();
    }

    $scope.watchListId = $state.params.isNew;

    if($scope.watchListId !== 'addNew'){
      $scope.watchlist = {name:"", desc:""};

      var watchlistObj = getWatchList($scope.watchListId);
      $scope.watchlist.name = watchlistObj.name;
      $scope.watchlist.desc = watchlistObj.desc;
    }

    $scope.saveEditWatchList = function(){

      if($state.params.isNew === 'addNew'){
        var newId = watchlists[watchlists.length - 1].id ++ ;
        // var newWatchListObj = {
        //   id: newId,
        //   name: $scope.watchlist.name,
        //   desc: $scope.watchlist.desc
        // }
        // watchlists.push(newWatchListObj);
        // localStorageService.update('watchlists',watchlists);
        updateWatchList($scope.watchlist, newId);
      }else{
        updateWatchList($scope.watchlist, $scope.watchListId);

      }

      $location.path("/listWatchList");
    }

  })


  .controller('listAcctListCtrl', function ($scope, $state, $location, $log, $ionicPopup, $ionicActionSheet, $timeout, pageNameService) {

    pageNameService.setPageName("list accountlist in listAcctListCtrl");
    $log.log(pageNameService.getPageName());

    $scope.goDetailAcctList = function () {
      $state.go("tab.holdings");
    }

    $scope.goBackToListAcctList = function () {
      $location.path("/listAcctList");
    }
  })


  .controller('detailWatchListCtrl', function ($scope, $state, $location, $log, $ionicPopup, $ionicActionSheet, $timeout, pageNameService, localStorageService, socketService) {

    pageNameService.setPageName("list watchlist");
    $log.log(pageNameService.getPageName());

    $scope.goDetailWatchList = function () {
      $state.go("tab.dash");
    }

    $scope.goBackToListWatchList = function () {
      $location.path("/listWatchList");
    }

    pageNameService.setPageName("detail watch list");
    $log.log("current page:" + pageNameService.getPageName());

    // Get symbols from localstorage, set default values
    //localStorageService.clear('quotes');

    $scope.symbols = localStorageService.get('quotes', ['YHOO', 'AAPL', 'GOOG', 'MSFT', 'FB', 'TWTR']);

    $scope.connectSocket = function () {
      //var sendMsg = '{"action":"subscribe","symbol":"uwti"}';
      var sendMsg = localStorageService.generateMsgArr('subscribe', $scope.symbols);
      $log.log("send message:" + sendMsg);
      socketService.loadRealTimeQuotes(sendMsg).then(function success(data) {
        $log.log("receive resolve data:" + data);
      }, function error(data) {
        $log.log("error data:" + data);
      }, function notify(data) {
        $log.log("notifid data:" + data);
        $scope.quotes = data;
      });
    }

    $scope.disConnectSocket = function () {
      var ws = socketService.getSocketConn();
      ws.close();
    }

    // Function to update the symbols in localstorage
    function updateSymbols() {
      var symbols = [];
      angular.forEach($scope.quotes, function (stock) {
        symbols.push(stock.Symbol);
      });
      $scope.symbols = symbols;
      localStorageService.update('quotes', symbols);
    }

    // start to connect to the socket to retrieve real time data when come to the page
    $scope.$on("$ionicView.beforeEnter", function (event, data) {
      // handle event
      console.log("State: preLoadDetailWatchListPage");
      $scope.connectSocket();
    });

    $scope.$on("$ionicView.beforeLeave", function (event, data) {
      // handle event
      console.log("State: beforeLeaveDetailWatchListPage");
      $scope.disConnectSocket();
    });


  })


  .controller('SignUpCtrl', function ($scope, $location, $log, pageNameService, signUpService) {
    $scope.pageName = "signup";
    $scope.createNewUser = function () {
      console.log("create new user");

      // console.log($scope.model.email);
      // console.log($scope.model.username);
      signUpService.create($scope.model).then(function () {
        $location.path('/login');
      })
    };
    pageNameService.setPageName("signup");
    $log.log(pageNameService.getPageName());
  })

  .controller('WelcomeCtrl', function ($scope, $location, $log, $ionicActionSheet, pageNameService) {
    pageNameService.setPageName("welcome");
    $log.log("current page:" + pageNameService.getPageName());
  })

  .controller('AcctHoldingsCtrl', function ($scope, $location, $log, $ionicPopup, $ionicLoading, pageNameService, localStorageService, socketService) {
    pageNameService.setPageName("account holding");
    $log.log("current page:" + pageNameService.getPageName());

    // Get symbols from localstorage, set default values
    //localStorageService.clear('quotes');

    $scope.symbols = localStorageService.get('quotes', ['YHOO', 'AAPL', 'GOOG', 'MSFT', 'FB', 'TWTR']);

    $scope.connectSocket = function () {
      //var sendMsg = '{"action":"subscribe","symbol":"uwti"}';
      var sendMsg = localStorageService.generateMsgArr('subscribe', $scope.symbols);
      $log.log("send message:" + sendMsg);
      socketService.loadRealTimeQuotes(sendMsg).then(function success(data) {
        $log.log("receive resolve data:" + data);
      }, function error(data) {
        $log.log("error data:" + data);
      }, function notify(data) {
        $log.log("notifid data:" + data);
        $scope.quotes = data;
      });
    }

    $scope.disConnectSocket = function () {
      var ws = socketService.getSocketConn();
      ws.close();
    }

    // Function to update the symbols in localstorage
    function updateSymbols() {
      var symbols = [];
      angular.forEach($scope.quotes, function (stock) {
        symbols.push(stock.Symbol);
      });
      $scope.symbols = symbols;
      localStorageService.update('quotes', symbols);
    }

    // start to connect to the socket to retrieve real time data when come to the page
    $scope.$on("$ionicView.beforeEnter", function (event, data) {
      // handle event
      console.log("State: preLoadAcctHoldingsPage");
      $scope.connectSocket();
    });

    $scope.$on("$ionicView.beforeLeave", function (event, data) {
      // handle event
      console.log("State: beforeLeaveAcctHoldingsPage");
      $scope.disConnectSocket();
    });


  })

  .controller('MainCtrl', function ($scope, $state, $location, $http, $log, $timeout, $ionicFilterBar, $ionicHistory, pageNameService) {
    pageNameService.setPageName("index");
    $scope.pageName = pageNameService.getPageName();
    $log.log(pageNameService.getPageName());

    $scope.goCustomizeWatchList = function () {
      // socketService.getSocketConn().close();
      $location.path("/customizeWatchList");
    };

    $scope.editListWatchList = function () {
      $location.path("/editListWatchList");
    };

    $scope.data = {
      showDelete: false
    };


    $scope.goCustomizeAccount = function () {
      $location.path("/customizeAccount");
    };

    //filter bar
    var filterBarInstance;

    // function getItems(stockList) {
    //   var items = [];
    //   //generate added test data
    //   // for (var x = 1; x < 2000; x++) {
    //   //   items.push({text: 'This is item number ' + x + ' which is an ' + (x % 2 === 0 ? 'EVEN' : 'ODD') + ' number.'});
    //   // }
    //   angular.forEach(stockList, function (stockname) {
    //     items.push({text: stockname});
    //   })
    //
    //
    //   $scope.items = items;
    // }

    //TO DO: $http to get the stock list
    //var stockList = ['YHOO', 'AAPL', 'GOOG', 'MSFT', 'FB', 'TWTR'];

    $scope.showFilterBar = function () {
      filterBarInstance = $ionicFilterBar.show({
        items: $scope.items,
        update: function (filteredItems, filterText) {
          if(!filterText){
            return;
          }
          var URL = "http://107.22.132.180:8732/securitis/" + filterText.toUpperCase();
          $http.get(URL).then(function(resp){
            console.log('Search securitis symbol success', resp); //JSON Object
            $scope.items = resp.data;
          },function(err){
            console.error('Search securitis symbol err', err);
          })


          //$scope.items = filteredItems;
          if (filterText) {
            console.log(filterText);
          }
        }
      });
    };

    // $scope.refreshItems = function () {
    //   if (filterBarInstance) {
    //     filterBarInstance();
    //     filterBarInstance = null;
    //   }
    //
    //   $timeout(function () {
    //     getItems(stockList);
    //     $scope.$broadcast('scroll.refreshComplete');
    //   }, 1000);
    // };

    $scope.showSearchNew = function () {
      $location.path("/searchNewStock");
    }


    $scope.accountEditDone = function () {
      // $location.path("/tab/dash");
      $state.go("tab.holdings");
    }

    $scope.watchListCustomizeDone = function () {
      $state.go("detailWatchlist");
    }

    $scope.watchListEditDone = function () {
      $state.go("listWatchlist");
    }

    $scope.goBack = function () {
      $ionicHistory.goBack();
    }

    $scope.goBackToListAcctList = function () {
      $location.path("/listAcctList");
    }


  })


  .controller('customizeWatchListCtrl', function ($scope, $location, $ionicHistory, $log, $state, $ionicPopup, $ionicLoading, $ionicFilterBar, $timeout, pageNameService, localStorageService) {
    pageNameService.setPageName("customizeWatchList");
    $log.log(pageNameService.getPageName());

    // Get symbols from localstorage, set default values
    //localStorageService.clear('quotes');

    $scope.symbols = localStorageService.get('quotes', ['YHOO', 'AAPL', 'GOOG', 'MSFT', 'FB', 'TWTR']);

    // Function to update the symbols in localstorage
    function updateSymbols() {
      var symbols = [];
      angular.forEach($scope.symbols, function (symbol) {
        symbols.push(symbol);
      });
      $scope.symbols = symbols;
      localStorageService.update('quotes', symbols);
    }

    // Method to handle reordering of items in the list
    $scope.reorder = function (symbol, $fromIndex, $toIndex) {
      $scope.symbols.splice($fromIndex, 1);
      $scope.symbols.splice($toIndex, 0, symbol);
      updateSymbols();
    };

    $scope.onItemDelete = function ($index) {
      $scope.symbols.splice($index, 1);
      updateSymbols();
    }


    $scope.editDone = function ($index) {
      // $location.path("/listWatchList");
      // $status.go("listWatchlist");
      $ionicHistory.goBack();
    }


  })





  .controller('customizeAcctCtrl', function ($scope, $location, $log, $state, $ionicPopup, $ionicLoading, $ionicFilterBar, $timeout, pageNameService, localStorageService) {
    pageNameService.setPageName("customizeAccount");
    $log.log(pageNameService.getPageName());

    // Get symbols from localstorage, set default values
    //localStorageService.clear('quotes');

    $scope.symbols = localStorageService.get('quotes', ['YHOO', 'AAPL', 'GOOG', 'MSFT', 'FB', 'TWTR']);

    // Function to update the symbols in localstorage
    function updateSymbols() {
      var symbols = [];
      angular.forEach($scope.symbols, function (symbol) {
        symbols.push(symbol);
      });
      $scope.symbols = symbols;
      localStorageService.update('quotes', symbols);
    }

    // Method to handle reordering of items in the list
    $scope.reorder = function (symbol, $fromIndex, $toIndex) {
      $scope.symbols.splice($fromIndex, 1);
      $scope.symbols.splice($toIndex, 0, symbol);
      updateSymbols();
    };

    $scope.onItemDelete = function ($index) {
      $scope.symbols.splice($index, 1);
      updateSymbols();
    }


    $scope.editDone = function ($index) {
      $state.go("tab.holdings");
    }


  })


  .controller('searchNewStockCtrl', function ($rootScope, $scope, $state, $location, $log, $timeout, $ionicFilterBar, localStorageService, pageNameService) {
    pageNameService.setPageName("searchNewStock");
    $scope.pageName = pageNameService.getPageName();
    $log.log(pageNameService.getPageName());

    $scope.addNewStock = function (symbol) {
      var symbols = [];
      if (localStorageService.get('quotes')) {
        symbols = localStorageService.get('quotes');
      }
      if (symbol && !symbols.includes(symbol)) {
        symbols.push(symbol);
      }

      localStorageService.update('quotes', symbols);

      // $location.path("/customizeWatchList");
      $state.go("customizeWatchList");
    }


  })



