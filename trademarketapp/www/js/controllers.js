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

  .controller('LoginCtrl', function ($scope, $location, $log, $ionicPopup, $ionicActionSheet, $timeout, pageNameService, signInService) {

    $scope.login = function () {
      $scope.pageName = "login";
      console.log("Login");
      console.log($scope.model.username);
      console.log($scope.model.password);

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
          $location.path("/tab/dash");
        }

      }, function error() {
        //pop up
        console.log("connect fail!");
      });
    };

    $scope.forgotPwd = function () {
      // Show the action sheet for forgetting password
      var hideSheet = $ionicActionSheet.show({
          //titleText: 'ActionSheet Example',
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
            if(index && index === 1){
              $location.path("/signUp");
            }else if(index === 0){
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

  .controller('SignUpCtrl', function ($scope, $location, $log, pageNameService, signUpService) {
    $scope.pageName = "signup";
    $scope.createNewUser = function () {
      console.log("create new user");

      signUpService.create($scope.model).then(function () {
        $location.path('/login');
      })
      // console.log($scope.model.firstname);
      // console.log($scope.model.lastname);
      // console.log($scope.model.email);
      // console.log($scope.model.username);
      // console.log($scope.model.password);
    };
    pageNameService.setPageName("signup");
    $log.log(pageNameService.getPageName());
  })

  .controller('WelcomeCtrl', function ($scope, $location, $log, $ionicActionSheet, pageNameService) {
    pageNameService.setPageName("welcome");
    $log.log(pageNameService.getPageName());
  })

  .controller('RealTimeDataCtrl', function ($scope, $location, $log, $ionicLoading, pageNameService, crossPageService, localStorageService, socketService, quotesService) {
    pageNameService.setPageName("realtime");
    $log.log(pageNameService.getPageName());

    // Get symbols from localstorage, set default values
    localStorageService.clear('quotes');
    $scope.symbols = localStorageService.get('quotes', ['YHOO', 'AAPL', 'GOOG', 'MSFT', 'FB', 'TWTR']);
    $scope.form = {
      query: ''
    };
    $scope.state = {
      reorder: false
    };

    $scope.connectSocket = function () {
      //var sendMsg = '{"action":"subscribe","symbol":"uwti"}';
      var sendMsg = localStorageService.generateMsgArr('subscribe', $scope.symbols);
      $log.log(sendMsg);
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

    $scope.$on('handleBroadcast', function () {
      $scope.state.reorder = crossPageService.getReorder();
      updateSymbols();
    });

    // Function to update the symbols in localstorage
    function updateSymbols() {
      var symbols = [];
      angular.forEach($scope.quotes, function (stock) {
        symbols.push(stock.Symbol);
      });
      $scope.symbols = symbols;
      localStorageService.update('quotes', symbols);
    }

    // Method to handle reordering of items in the list
    $scope.reorder = function (stock, $fromIndex, $toIndex) {
      $scope.quotes.splice($fromIndex, 1);
      $scope.quotes.splice($toIndex, 0, stock);
      updateSymbols();
    };
    // Method to load quotes, or show an alert on error, and finally close the loader
    $scope.getQuotes = function () {

      quotesService.get($scope.symbols).then(function (quotes) {
        $scope.quotes = quotes;
      }, function (error) {
        $ionicPopup.alert({
          template: 'Could not load quotes right now. Please try again later.'
        });
      }).finally(function () {
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
      });
    };
    // Method to load a quote's data and add it to the list, or show alert for not found
    $scope.add = function () {
      if ($scope.form.query) {
        quotesService.get([$scope.form.query]).then(function (results) {
          if (results[0].Name) {
            $scope.symbols.push($scope.form.query);
            $scope.quotes.push(results[0]);
            $scope.form.query = '';
            updateSymbols();
          } else {
            $ionicPopup.alert({
              title: 'Could not locate symbol.'
            });
          }
        });
      }
    };
    // Method to remove a quote from the list
    $scope.remove = function ($index) {
      $scope.symbols.splice($index, 1);
      $scope.quotes.splice($index, 1);
      updateSymbols();
    };
    // Method to give a class based on the quote price vs closing
    $scope.quoteClass = function (quote) {
      if (quote.PreviousClose < quote.LastTradePriceOnly) {
        return 'positive';
      }
      if (quote.PreviousClose > quote.LastTradePriceOnly) {
        return 'negative';
      }
      return '';
    };
    // Start by showing the loader the first time, and request the quotes
    $ionicLoading.show();
    $scope.getQuotes();


  })

  .controller('MainCtrl', function ($scope, $location, $log, crossPageService, pageNameService) {
    pageNameService.setPageName("index");
    $scope.pageName = pageNameService.getPageName();
    $log.log(pageNameService.getPageName());


    $scope.changeReorderState = function () {
      if (crossPageService.getReorder() == true) {
        crossPageService.setReorder(false);
      } else {
        crossPageService.setReorder(true);
      }
      crossPageService.prepForBroadcast(crossPageService.getReorder());

    };

    $scope.customize = function(){
      crossPageService.setReorder(true);
      $location.path("/customizeStocks");
    };

  })


  .controller('customizeStocksCtrl', function ($scope, $location, $log, $ionicLoading, pageNameService, crossPageService, localStorageService, socketService, quotesService) {
    pageNameService.setPageName("realtime");
    $log.log(pageNameService.getPageName());

    // Get symbols from localstorage, set default values
    localStorageService.clear('quotes');
    $scope.symbols = localStorageService.get('quotes', ['YHOO', 'AAPL', 'GOOG', 'MSFT', 'FB', 'TWTR']);
    $scope.form = {
      query: ''
    };
    $scope.state = {
      reorder: false
    };

    $scope.connectSocket = function () {
      //var sendMsg = '{"action":"subscribe","symbol":"uwti"}';
      var sendMsg = localStorageService.generateMsgArr('subscribe', $scope.symbols);
      $log.log(sendMsg);
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

    $scope.$on('handleBroadcast', function () {
      $scope.state.reorder = crossPageService.getReorder();
      updateSymbols();
    });

    // Function to update the symbols in localstorage
    function updateSymbols() {
      var symbols = [];
      angular.forEach($scope.quotes, function (stock) {
        symbols.push(stock.Symbol);
      });
      $scope.symbols = symbols;
      localStorageService.update('quotes', symbols);
    }

    // Method to handle reordering of items in the list
    $scope.reorder = function (stock, $fromIndex, $toIndex) {
      $scope.quotes.splice($fromIndex, 1);
      $scope.quotes.splice($toIndex, 0, stock);
      updateSymbols();
    };
    // Method to load quotes, or show an alert on error, and finally close the loader
    $scope.getQuotes = function () {

      quotesService.get($scope.symbols).then(function (quotes) {
        $scope.quotes = quotes;
      }, function (error) {
        $ionicPopup.alert({
          template: 'Could not load quotes right now. Please try again later.'
        });
      }).finally(function () {
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
      });
    };
    // Method to load a quote's data and add it to the list, or show alert for not found
    $scope.add = function () {
      if ($scope.form.query) {
        quotesService.get([$scope.form.query]).then(function (results) {
          if (results[0].Name) {
            $scope.symbols.push($scope.form.query);
            $scope.quotes.push(results[0]);
            $scope.form.query = '';
            updateSymbols();
          } else {
            $ionicPopup.alert({
              title: 'Could not locate symbol.'
            });
          }
        });
      }
    };
    // Method to remove a quote from the list
    $scope.remove = function ($index) {
      $scope.symbols.splice($index, 1);
      $scope.quotes.splice($index, 1);
      updateSymbols();
    };

    $scope.onItemDelete = function($index){
      $scope.symbols.splice($index, 1);
      $scope.quotes.splice($index, 1);
      updateSymbols();
    }

    // Method to give a class based on the quote price vs closing
    $scope.quoteClass = function (quote) {
      if (quote.PreviousClose < quote.LastTradePriceOnly) {
        return 'positive';
      }
      if (quote.PreviousClose > quote.LastTradePriceOnly) {
        return 'negative';
      }
      return '';
    };
    // Start by showing the loader the first time, and request the quotes
    $ionicLoading.show();
    $scope.getQuotes();


  })



