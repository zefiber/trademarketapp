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

  .controller('SignUpCtrl', function ($scope, $log, pageNameService) {
    $scope.pageName = "signup";
    $scope.createNewUser = function () {
      console.log("create new user");
      console.log($scope.model.firstname);
      console.log($scope.model.lastname);
      console.log($scope.model.email);
      console.log($scope.model.username);
      console.log($scope.model.password);
    };
    pageNameService.setPageName("signup");
    $log.log(pageNameService.getPageName());
  })

  .controller('WelcomeCtrl', function ($scope, $location, $log, pageNameService) {
    pageNameService.setPageName("welcome");
    $log.log(pageNameService.getPageName());
  })

  .controller('RealTimeDataCtrl', function ($scope, $location, $log, pageNameService) {
    pageNameService.setPageName("realtime");
    $log.log(pageNameService.getPageName());
  })

  .controller('MainCtrl', function ($scope, $location, $log, pageNameService) {
    pageNameService.setPageName("index");
    $scope.pageName = pageNameService.getPageName();
    $log.log(pageNameService.getPageName());
  })



