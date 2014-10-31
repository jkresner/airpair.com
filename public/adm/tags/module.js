/**
* ADMTags Module
*
* Description
*/
angular.module('ADMTags', ['ngRoute', 'ngFx', 'APSvcAdmin', 'APFilters', 'ui.bootstrap'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/v1/adm/tags', {
				template: require('./tags.html'),
				controller: 'TagsCtrl as tags',
				resolve: {
					tags: ['AdmDataService', function(AdmDataService){
						return AdmDataService.getAllTags()
							.then(function(resp) {
								return resp.data;
							});
					}]
				}
			});
	}])

	.controller('TagsCtrl', ['$scope', '$debounce', 'tags', 'AdmDataService',
		function($scope, $debounce, tags, AdmDataService){
			this.filter = {};
			this.tags = tags;
			var getCount = () => this.tags.length;
			this.editmode = false;

			this.resetEdit = () => {
				this.edit.show = false;
				this.editmode = false;
				this.edit.staleTag = '';
				this.tag = '';
				this.edit.create = false;
			};

			this.create = (tag) => {
				AdmDataService.createTag(tag, (newTag) => {
					this.tags.unshift(newTag);
					this.count = getCount();
					this.resetEdit();
				});
			};

			this.deleteTag = (id) => {
				AdmDataService.deleteTag(id, () => {
					var index = _.findIndex(this.tags, { _id: id });
					this.tags.splice(index, 1);
					this.edit.show = false;
					this.editmode = false;
					this.count = getCount();
				});
			};

			var extendNonNull = (a, ...rest) => {
				_.forEach(rest, o => {
					_.forEach(o, (val, key) => {
						if(!!val) {
							a[key] = val;
						}
					});
				});
				return a;
			};

			this.doneEditing = () => {
				var tag = this.edit.tag;
				tag = extendNonNull(this.edit.staleTag, tag);
				AdmDataService.updateTag(tag, resp => {
					_.extend(this.edit.tag, resp);
					this.resetEdit();
				});
			};

			$scope.$watch('search', (newValue, oldValue) =>{
			    if (newValue === oldValue) { return; }
			    $debounce(applySearch, 350);
			});

			var applySearch = () => {
				this.filter.search = {name: $scope.search};
			};
			// for child directives, bind to scope and not this
			this.edit = { show: false };
			this.enableEdit = (tag = {})=>{
				if (_.isEmpty(tag)) {
					this.editmode = true;
					this.edit.create = true;
				}
				this.edit.tag = tag;
				this.edit.staleTag = _.extend({},tag);
				this.edit.show = true;
				this.edit.where = _.findIndex(this.tags, { _id: tag._id });
			};
			this.count = getCount();
	}])
	.directive('contenteditable', [function() {
		return {
			require: "ngModel",
	    link: function(scope, element, attrs, ngModel) {

	      function read() {
	        ngModel.$setViewValue(element.html());
	      }

	      ngModel.$render = function() {
	        element.html(ngModel.$viewValue || "");
	      };

	      element.bind("blur keyup change", function() {
	        scope.$apply(read);
	      });
    	}
		};
	}])
    .factory('$debounce', ['$rootScope', '$browser', '$q', '$exceptionHandler',
    	function($rootScope, $browser, $q, $exceptionHandler) {
    		// Filtering a big list in ngRepeat just sucks,
    		// Debounce will stop the auto filtering and start in a
    		// specified delay in ms
        var deferreds = {},
            methods = {},
            uuid = 0;

        function debounce(fn, delay, invokeApply) {
          var deferred = $q.defer(),
              promise = deferred.promise,
              skipApply = (angular.isDefined(invokeApply) && !invokeApply),
              timeoutId, cleanup,
              methodId, bouncing = false;

          // check we dont have this method already registered
          angular.forEach(methods, function(value, key) {
            if(angular.equals(methods[key].fn, fn)) {
                bouncing = true;
                methodId = key;
            }
          });

          // not bouncing, then register new instance
          if(!bouncing) {
            methodId = uuid++;
            methods[methodId] = {fn: fn};
          } else {
            // clear the old timeout
            deferreds[methods[methodId].timeoutId].reject('bounced');
            $browser.defer.cancel(methods[methodId].timeoutId);
          }

          var debounced = function() {
            // actually executing? clean method bank
            delete methods[methodId];

            try {
                deferred.resolve(fn());
            } catch(e) {
                deferred.reject(e);
                $exceptionHandler(e);
            }

            if (!skipApply) $rootScope.$apply();
          };

          timeoutId = $browser.defer(debounced, delay);

          // track id with method
          methods[methodId].timeoutId = timeoutId;

          cleanup = function(reason) {
             delete deferreds[promise.$$timeoutId];
          };

          promise.$$timeoutId = timeoutId;
          deferreds[timeoutId] = deferred;
          promise.then(cleanup, cleanup);

          return promise;
        }

        // similar to angular's $timeout cancel
        debounce.cancel = function(promise) {
          if (promise && promise.$$timeoutId in deferreds) {
             deferreds[promise.$$timeoutId].reject('canceled');
             return $browser.defer.cancel(promise.$$timeoutId);
          }
          return false;
      	};
      	return debounce;
    }]);
