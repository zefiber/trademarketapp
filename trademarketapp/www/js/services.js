var services = angular.module('tradeapp.services', [])

services.factory('Chats', function() {
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
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});

services.factory('crossPageService', function($rootScope){
  this.reorder = 'false';

  this.getReorder = function(){
    return this.reorder;
  };

  this.setReorder = function(reorder){
    this.reorder = reorder;
  };

  this.prepForBroadcast = function(reorder){
    this.setReorder(reorder);
    $rootScope.$broadcast('handleBroadcast');
  };

  return this;
});

services.factory('pageNameService', function(){
  this.pageName = 'login';
  return {
    getPageName: function() {
      return this.pageName;
    },
    setPageName: function(pageName){
      this.pageName = pageName;
    }

  };

});

services.factory('quotesService', function($q, $http){
  // Create a quotes service to simplify how to load data from Yahoo Finance
  var quotesService = {};

  quotesService.get = function(symbols) {
    // Convert the symbols array into the format required for YQL
    symbols = symbols.map(function(symbol) {
      return "'" + symbol.toUpperCase() + "'";
    });
    // Create a new deferred object
    var defer = $q.defer();
    // Make the http request
    $http.get('https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.quotes where symbol in (' + symbols.join(',') + ')&format=json&env=http://datatables.org/alltables.env')
      .success(function(quotes) {

      //  $http.get('https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid=2502265&format=json&env=http://datatables.org/alltables.env')
      //    .success(function(quotes) {
      // The API is funny, if only one result is returned it is an object, multiple results are an array. This forces it to be an array for consistency
      if (quotes.query.count === 1) {
        quotes.query.results.quote = [quotes.query.results.quote];
      }
      // Resolve the promise with the data
      defer.resolve(quotes.query.results.quote);
    }).error(function(error) {
      // If an error occurs, reject the promise with the error
      defer.reject(error);
    });
    // Return the promise
    return defer.promise;
  };

  return quotesService;
});

services.factory('localStorageService', function() {

  // Helper methods to manage an array of data through localstorage
  return {
    // This pulls out an item from localstorage and tries to parse it as JSON strings
    get: function LocalStorageServiceGet(key, defaultValue) {
      var stored = localStorage.getItem(key);
      try {
        stored = angular.fromJson(stored);
      } catch(error) {
        stored = null;
      }
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
    }
  };

});

