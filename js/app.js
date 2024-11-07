(function () {
    'use strict';

    angular.module('NarrowItDownApp',[])
    .controller('NarrowItDownController',NarrowItDownController)
    .service('MenuSearchService',MenuSearchService)
    .constant('ApiBasePath',"https://coursera-jhu-default-rtdb.firebaseio.com")
    .directive('foundItems',FoundItemsDirective);
    
    function FoundItemsDirective(){
        var ddo = {
            templateUrl: 'foundItems.html',
            scope: {
                found: '<',
                onRemove: '&'
            },
          controller: FoundItemsDirectiveController,
          controllerAs: 'list',
          bindToController: true
        };
        return ddo;
      };
    
        function FoundItemsDirectiveController(){
          var list = this;
        }
    
        MenuSearchService.$inject = ['$http', 'ApiBasePath'];
        function MenuSearchService($http, ApiBasePath){
          var service = this;
          service.foundItems = [];
          service.getMatchedMenuItems = function (){
              var response = $http({
                  method: "GET",
                  url: (ApiBasePath + "/menu_items.json")
              });
              return response;
          }
        }
        
        NarrowItDownController.$inject = ['MenuSearchService'];
        function NarrowItDownController(MenuSearchService){
          var item = this;
          item.searchTerm ="";
          item.found = [];
    
          item.getItems = function () {
            item.nothingFound = "";
            item.isEmpty= true;
              if(item.found.length !== 0) {
                  item.found.length = 0;
              }
              var promise = MenuSearchService.getMatchedMenuItems();
              promise
              .then(function(response){
                  var completeList = [];
                  completeList = response.data;
                  angular.forEach(completeList, function(element){
                      angular.forEach(element.menu_items, function(searchItem){
                          if (item.searchTerm.length === 0) {
                            item.nothingFound = "Nothing Found";
                          } else if (searchItem.description.toLowerCase().indexOf(item.searchTerm.toLowerCase()) !== -1) {
                            item.found.push(searchItem);
                          };
                      });
                  });

                  if (item.found.length === 0) {
                        item.isEmpty= true;
                    } else { item.isEmpty= false;}
              })
              .catch(function(error){
                  console.log(error)
              })
          }

          item.removeItem = function(itemIndex){
              item.found.splice(itemIndex, 1);
          };
        };
   } 
)();