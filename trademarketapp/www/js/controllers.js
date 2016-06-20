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


  .controller('LoginCtrl', function ($scope, $location, $log, pageNameService) {

    $scope.login = function () {
      $scope.pageName =  "login";
      console.log("Login");
      console.log($scope.model.username);
      console.log($scope.model.password);

      //connect to service to validate
      if(true){  //to do !
        $location.path("/tab/dash");
      }

    };

    pageNameService.setPageName("login");
    $log.log(pageNameService.getPageName());

  })

  .controller('SignUpCtrl', function ($scope, $location, $log, pageNameService, signUpService) {
    $scope.pageName = "signup";
    $scope.createNewUser = function () {
      console.log("create new user");

      signUpService.save($scope.model);
      // console.log($scope.model.firstname);
      // console.log($scope.model.lastname);
      // console.log($scope.model.email);
      // console.log($scope.model.username);
      // console.log($scope.model.password);
      $location.path('/login');
    };
    pageNameService.setPageName("signup");
    $log.log(pageNameService.getPageName());
  })

  .controller('WelcomeCtrl', function ($scope, $location, $log, pageNameService) {
    pageNameService.setPageName("welcome");
    $log.log(pageNameService.getPageName());
  })

  .controller('RealTimeDataCtrl', function ($scope, $location, $log, $ionicLoading, pageNameService, crossPageService, localStorageService, quotesService) {
    pageNameService.setPageName("realtime");
    $log.log(pageNameService.getPageName());

    // Get symbols from localstorage, set default values
    $scope.symbols = localStorageService.get('quotes', ['YHOO', 'AAPL', 'GOOG', 'MSFT', 'FB', 'TWTR']);
    $scope.form = {
      query: ''
    };
    $scope.state = {
      reorder: false
    };


    $scope.connectSocket = function () {
      // var socket = io('http://127.0.0.1:8080');
      // //socket.send('messageEvent', '{"action":"login","username":"xxhu","password":"121212"}@@');
      //socket.emit('some event', '{"action":"subscribe","symbol":"uwti"}@@');
      // socket.on('connect',function(){
      //   socket.send('{"action":"subscribe","symbol":"uwti"}@@');
      //   socket.on('messageEvent', function(data){
      //     console.log(data);
      //   });
      // })
      var ws = new WebSocket("ws://127.0.0.1:8080/");
      $log.log(ws);
      var count = 0;
      while(true){
        count++;
        if(count > 3){
          break;
        }
        setTimeout(function(){
          $log.log("try again");
        },2000);
        if(ws.readyState === 1){
          $log.log("success");
          ws.send("sdfwew");
          break;
        }
      }
    if(ws.readyState === 0) {
      $log.log("INVALID_STATE_ERR: Web Socket connection has not been established");
    }

      //connection.send("{\"action\":\"login\",\"username\":\"xxhu\",\"password\":\"121212\"}@@\"");
      ws.onmessage = function(message){
          $log.log(message);
      };

      ws.onopen = function (event) {
        ws.send('{"action":"login","username":"xxhu","password":"121212"}@@');
        $log.log("send a message");
        setTimeout(function(){
          ws.send('{"action":"subscribe","symbol":"uwti"}@@');
        },5000);
        ws.onmessage = function(event){
          $log.log("received a message",event);
        }

        ws.onclose = function(event){
          $log.log("client close");
        }
        ws.close();
      };
    };

    $scope.$on('handleBroadcast',function(){
      $scope.state.reorder = crossPageService.getReorder();
      updateSymbols();
    });

    // Function to update the symbols in localstorage
    function updateSymbols() {
      var symbols = [];
      angular.forEach($scope.quotes, function(stock) {
        symbols.push(stock.Symbol);
      });
      $scope.symbols = symbols;
      localStorageService.update('quotes', symbols);
    }
    // Method to handle reordering of items in the list
    $scope.reorder = function(stock, $fromIndex, $toIndex) {
      $scope.quotes.splice($fromIndex, 1);
      $scope.quotes.splice($toIndex, 0, stock);
      updateSymbols();
    };
    // Method to load quotes, or show an alert on error, and finally close the loader
    $scope.getQuotes = function() {

      quotesService.get($scope.symbols).then(function(quotes) {
        $scope.quotes = quotes;
      }, function(error) {
        $ionicPopup.alert({
          template: 'Could not load quotes right now. Please try again later.'
        });
      }).finally(function() {
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
      });
    };
    // Method to load a quote's data and add it to the list, or show alert for not found
    $scope.add = function() {
      if ($scope.form.query) {
        quotesService.get([$scope.form.query]).then(function(results) {
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
    $scope.remove = function($index) {
      $scope.symbols.splice($index, 1);
      $scope.quotes.splice($index, 1);
      updateSymbols();
    };
    // Method to give a class based on the quote price vs closing
    $scope.quoteClass = function(quote) {
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


    $scope.changeReorderState = function(){
      if(crossPageService.getReorder() == true){
        crossPageService.setReorder(false);
      }else{
        crossPageService.setReorder(true);
      }
      crossPageService.prepForBroadcast(crossPageService.getReorder());

    };
  })



