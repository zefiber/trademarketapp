var services = angular.module('tradeapp.services', []);

services.factory('Chats', function () {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function () {
      return chats;
    },
    remove: function (chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function (chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});

services.factory('signInService', function ($q, $http) {

  var signInService = {};
  // Create a new deferred object

  signInService.validateUser = function (bodyData) {
    var defer = $q.defer();
    var myobject = {
      password: bodyData.password,
      username: bodyData.username,
    };

    var jsonObj = angular.toJson(myobject);
    var url = "http://localhost:8200/signin";

    $http.post(url, jsonObj).success(function(data){
      return defer.resolve(data);
    }).error(function(error){
      return defer.reject(error);
    });
    return defer.promise;

  };

  return signInService;
});



services.factory('sendEmailForResetService', function ($q, $http) {

  var sendEmailForResetService = {};
  // Create a new deferred object
  var defer = $q.defer();
  sendEmailForResetService.sendEmail = function (bodyData) {

    var jsonObj = angular.toJson(bodyData.email);
    //TBD for connecting smtp to send email
    var url = "http://localhost:8200/signup";

    return $http.post(url, jsonObj);

  };

  // return{
  //   save: function(form){
  //     return $http.post('http://localhost:8080/signup',form,{
  //       method:'Post'
  //     });
  //   }
  // }
  return sendEmailForResetService;
});



services.factory('signUpService', function ($q, $http) {

  var signUpService = {};
  // Create a new deferred object
  var defer = $q.defer();
  signUpService.create = function (bodyData) {
    var myobject = {
      email: bodyData.email,
      password: bodyData.password,
      username: bodyData.username,
      firstname: bodyData.firstname,
      lastname: bodyData.lastname
    };

    var jsonObj = angular.toJson(myobject);
    var url = "http://localhost:8200/signup";

    return $http.post(url, jsonObj);

  };

  // return{
  //   save: function(form){
  //     return $http.post('http://localhost:8080/signup',form,{
  //       method:'Post'
  //     });
  //   }
  // }
  return signUpService;
});

services.factory('crossPageService', function ($rootScope) {
  this.reorder = 'false';

  this.getReorder = function () {
    return this.reorder;
  };

  this.setReorder = function (reorder) {
    this.reorder = reorder;
  };

  this.prepForBroadcast = function (reorder) {
    this.setReorder(reorder);
    $rootScope.$broadcast('handleBroadcast');
  };

  return this;
});

services.factory('pageNameService', function () {
  this.pageName = 'login';
  return {
    getPageName: function () {
      return this.pageName;
    },
    setPageName: function (pageName) {
      this.pageName = pageName;
    }

  };

});

services.factory('socketService', function ($rootScope, $log, $q) {
  this.socketConn = '';
  this.getSocketConn = function () {
    return this.socketConn;
  }
  this.setSocketConn = function (socketConn) {
    this.socketConn = socketConn;
  }

  this.loadRealTimeQuotes = function (msgArr) {
    var d = $q.defer();
    var ws = new WebSocket("ws://127.0.0.1:8181/");
    this.setSocketConn(ws);
    $log.log("Web Socket connection has been established successfully");
    ws.onopen = function (event) {
      //ws.send('{"action":"subscribe","symbol":"uwti"}');
      for(var i in msgArr){
        ws.send(msgArr[i]);
      }
    };

    ws.onmessage = function (event) {
      //[{"symbol": "uwti","ask": 66.92539153943089,"bid": 10.900888923043798,"bidsize": 347,"asksize": 354}]
      $log.log("received a message", event.data);
      var stockObjArr = JSON.parse(event.data);

      d.notify(stockObjArr);
      // d.resolve(stockObjArr);
    };

    ws.onclose = function (event) {
      $log.log("connection closed");
    };
    return d.promise;
  }

  return this;

});


services.factory('quotesService', function ($q, $http) {
  // Create a quotes service to simplify how to load data from Yahoo Finance
  var quotesService = {};

  quotesService.get = function (symbols) {
    // Convert the symbols array into the format required for YQL
    symbols = ['YHOO'];
    symbols = symbols.map(function (symbol) {
      return "'" + symbol.toUpperCase() + "'";
    });
    // Create a new deferred object
    //var defer = $q.defer();
    // Make the http request
    // $http.get('https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.quotes where symbol in (' + symbols.join(',') + ')&format=json&env=http://datatables.org/alltables.env')
    //   .success(function (quotes) {
    //
    //     //  $http.get('https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid=2502265&format=json&env=http://datatables.org/alltables.env')
    //     //    .success(function(quotes) {
    //     // The API is funny, if only one result is returned it is an object, multiple results are an array. This forces it to be an array for consistency
    //     if (quotes.query.count === 1) {
    //       quotes.query.results.quote = [quotes.query.results.quote];
    //     }
    //     // Resolve the promise with the data
    //     defer.resolve(quotes.query.results.quote);
    //   }).error(function (error) {
    //   // If an error occurs, reject the promise with the error
    //   defer.reject(error);
    // });
    // Return the promise
    //defer.resolve;
    //return defer.promise;
  };

  return quotesService;
});

services.factory('localStorageService', function () {

  // Helper methods to manage an array of data through localstorage
  return {
    // This pulls out an item from localstorage and tries to parse it as JSON strings
    get: function LocalStorageServiceGet(key, defaultValue) {
      var stored = localStorage.getItem(key);
      try {
        stored = angular.fromJson(stored);
      } catch (error) {
        stored = null;
      }
      console.log("local storage:" + stored);
      if (defaultValue && stored === null) {
        stored = defaultValue;
      }
      return stored;
    },
    // This stores data into localstorage, but converts values to a JSON string first
    update: function LocalStorageServiceUpdate(key, value) {
      if (value) {
        localStorage.setItem(key, angular.toJson(value));
      }
    },
    // This will remove a key from localstorage
    clear: function LocalStorageServiceClear(key) {
      localStorage.removeItem(key);
    },
    generateMsgArr: function LocalStorageServiceGenMsgArr(action, symbols) {
      var retArr = [];
      var msgObj = {};

      for (var i in symbols) {
        msgObj = {action:action, symbol:symbols[i]};
        retArr.push(angular.toJson(msgObj));
      }

      return retArr;
    }
  };

});



