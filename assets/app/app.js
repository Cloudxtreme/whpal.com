var app = angular.module('backendApp', [
    'ui.router',
    'ngSanitize'
  ])
  .run(['$rootScope', '$state', '$stateParams', '$http',
    function($rootScope, $state, $stateParams, $http) {
      //$http.defaults.headers.common.UserToken = localStorage.getItem('token');
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }
  ])
  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/vps');
      $stateProvider.state("backend_vps", {
        resolve: {
          vps: ['VPS', '$stateParams', function(VPS, $stateParams) {
            return VPS.index();
          }]
        },
        templateUrl: "/partials/vps.html",
        url: "/vps",
        controller: ['$rootScope', '$scope', '$stateParams', 'vps', 'VPS',
          function($rootScope, $scope, $stateParams, vps, VPS) {
            $rootScope.currentAction = "VPS Management";
            $scope.vps = vps.data;
            $scope.deleteVPS = function(id) {
              VPS.delete(id);
              for (i = 0; i < $scope.vps.length; i++) {
                if (id === $scope.vps[i].id) {
                  $scope.vps.splice(i, 1);
                  break;
                }
              }
            }
          }
        ]
      });
      $stateProvider.state("backend_vps_edit", {
        resolve: {
          vps: ['VPS', '$stateParams', function(VPS, $stateParams) {
            if ($stateParams.id) {
              return VPS.get($stateParams.id);
            }
            return;
          }]
        },
        templateUrl: "/partials/vps_detail.html",
        url: "/vps/detail/{id}",
        controller: ['$rootScope', '$scope', '$stateParams', 'vps', 'VPS',
          function($rootScope, $scope, $stateParams, vps, VPS) {
            $rootScope.currentAction = "VPS Management";
            $scope.vps = {};
            $scope.copyVPS = function($event) {
              var tempProvider = $scope.vps.provider;
              VPS.create($scope.vps).then(function(res) {
                $scope.vps = res.data;
                $scope.vps.provider = tempProvider;
                $scope.msg = "Copied";
              });
              $event.preventDefault();
            }
            if ($stateParams.id) {
              $scope.vps = vps.data;
              $scope.vps.provider = $scope.vps.provider.name || '';
              $scope.updateVPS = function() {
                VPS.update($scope.vps).then(function(res) {
                  $scope.msg = "Updated";
                });
              }
            } else {
              $scope.vps.location = '';
              $scope.vps.remark = '';
              $scope.vps.virtualization = 'OpenVZ';
              $scope.updateVPS = function() {
                var tempProvider = $scope.vps.provider;
                VPS.create($scope.vps).then(function(res) {
                  $scope.vps = res.data;
                  $scope.vps.provider = tempProvider;
                  $scope.vps = res.data;
                  $scope.msg = "Created";
                });
              }
            }
          }
        ]
      });
      $stateProvider.state("backend_coupon", {
        resolve: {
          coupon: ['Coupon', '$stateParams', function(Coupon, $stateParams) {
            return Coupon.index();
          }]
        },
        templateUrl: "/partials/coupon.html",
        url: "/coupon",
        controller: ['$rootScope', '$scope', '$stateParams', 'coupon', 'Coupon',
          function($rootScope, $scope, $stateParams, coupon, Coupon) {
            $rootScope.currentAction = "Coupon Management";
            $scope.coupon = coupon.data;
            $scope.deleteCoupon = function(id) {
              Provider.delete(id);
              for (i = 0; i < $scope.coupon.length; i++) {
                if (id === $scope.coupon[i].id) {
                  $scope.coupon.splice(i, 1);
                  break;
                }
              }
            }
          }
        ]
      });
      $stateProvider.state("backend_coupon_edit", {
        resolve: {
          coupon: ['Coupon', '$stateParams', function(Coupon, $stateParams) {
            if ($stateParams.id) {
              return Coupon.get($stateParams.id);
            }
            return;
          }]
        },
        templateUrl: "/partials/coupon_detail.html",
        url: "/coupon/detail/{id}",
        controller: ['$rootScope', '$scope', '$stateParams', 'coupon', 'Coupon',
          function($rootScope, $scope, $stateParams, coupon, Coupon) {
            $rootScope.currentAction = "Coupon Management";
            $scope.coupon = {};
            if ($stateParams.id) {
              $scope.coupon = coupon.data;
              $scope.coupon.provider = $scope.coupon.provider.name || '';
              $scope.updateCoupon= function() {
                Coupon.update($scope.coupon).then(function(res) {
                  $scope.msg = "Updated";
                });
              }
            } else {
              $scope.updateCoupon = function() {
                Coupon.create($scope.coupon).then(function(res) {
                  $scope.msg = "Created";
                });
              }
            }
          }
        ]
      });
      $stateProvider.state("backend_provider", {
        resolve: {
          provider: ['Provider', '$stateParams', function(Provider, $stateParams) {
            return Provider.index();
          }]
        },
        templateUrl: "/partials/provider.html",
        url: "/provider",
        controller: ['$rootScope', '$scope', '$stateParams', 'provider', 'Provider',
          function($rootScope, $scope, $stateParams, provider, Provider) {
            $rootScope.currentAction = "Provider Management";
            $scope.provider = provider.data;
            $scope.deleteProvider = function(id) {
              Provider.delete(id);
              for (i = 0; i < $scope.provider.length; i++) {
                if (id === $scope.provider[i].id) {
                  $scope.provider.splice(i, 1);
                  break;
                }
              }
            }
          }
        ]
      });
      $stateProvider.state("backend_provider_edit", {
        resolve: {
          provider: ['Provider', '$stateParams', function(Provider, $stateParams) {
            if ($stateParams.id) {
              return Provider.get($stateParams.id);
            }
            return;
          }]
        },
        templateUrl: "/partials/provider_detail.html",
        url: "/provider/detail/{id}",
        controller: ['$rootScope', '$scope', '$stateParams', 'provider', 'Provider',
          function($rootScope, $scope, $stateParams, provider, Provider) {
            $rootScope.currentAction = "Provider Management";
            $scope.provider = {};
            if ($stateParams.id) {
              $scope.provider = provider.data;
              $scope.updateProvider = function() {
                Provider.update($scope.provider).then(function(res) {
                  $scope.msg = "Updated";
                });
              }
            } else {
              $scope.updateProvider = function() {
                Provider.create($scope.provider).then(function(res) {
                  $scope.msg = "Created";
                });
              }
            }
          }
        ]
      });
      $stateProvider.state("backend_cloud", {
        resolve: {
          cloud: ['Cloud', '$stateParams', function(Cloud, $stateParams) {
            return Cloud.index();
          }]
        },
        templateUrl: "/partials/cloud.html",
        url: "/cloud",
        controller: ['$rootScope', '$scope', '$stateParams', 'cloud', 'Cloud',
          function($rootScope, $scope, $stateParams, cloud, Cloud) {
            $rootScope.currentAction = "VPS Management";
            $scope.cloud = cloud.data;
            $scope.deleteCloud = function(id) {
              Cloud.delete(id);
              for (i = 0; i < $scope.cloud.length; i++) {
                if (id === $scope.cloud[i].id) {
                  $scope.cloud.splice(i, 1);
                  break;
                }
              }
            }
          }
        ]
      });
      $stateProvider.state("backend_cloud_edit", {
        resolve: {
          cloud: ['Cloud', '$stateParams', function(Cloud, $stateParams) {
            if ($stateParams.id) {
              return Cloud.get($stateParams.id);
            }
            return;
          }]
        },
        templateUrl: "/partials/cloud_detail.html",
        url: "/cloud/detail/{id}",
        controller: ['$rootScope', '$scope', '$stateParams', 'cloud', 'Cloud',
          function($rootScope, $scope, $stateParams, cloud, Cloud) {
            $rootScope.currentAction = "Cloud Management";
            $scope.cloud = {};
            $scope.copyCloud = function($event) {
              var tempProvider = $scope.cloud.provider;
              Cloud.create($scope.cloud).then(function(res) {
                $scope.cloud = res.data;
                $scope.cloud.provider = tempProvider;
                $scope.msg = "Copied";
              });
              $event.preventDefault();
            }
            if ($stateParams.id) {
              $scope.cloud = cloud.data;
              $scope.cloud.provider = $scope.cloud.provider.name || '';
              $scope.updateCloud = function() {
                Cloud.update($scope.cloud).then(function(res) {
                  $scope.msg = "Updated";
                });
              }
            } else {
              $scope.cloud.maxCpu = 0;
              $scope.cloud.maxRam = 0;
              $scope.cloud.maxHd = 0;
              $scope.cloud.location = '';
              $scope.cloud.cpuCharge = '';
              $scope.cloud.ramCharge = '';
              $scope.cloud.hdCharge = '';
              $scope.cloud.bandwidthCharge = '';
              $scope.cloud.ipv4Charge = '';
              $scope.cloud.ipv6Charge = '';
              $scope.cloud.hourPrice = 0;
              $scope.cloud.remark = '';
              $scope.updateCloud = function() {
                var tempProvider = $scope.cloud.provider;
                Cloud.create($scope.cloud).then(function(res) {
                  $scope.cloud = res.data;
                  $scope.cloud.provider = tempProvider;
                  $scope.cloud = res.data;
                  $scope.msg = "Created";
                });
              }
            }
          }
        ]
      });
    }
  ]);

app.factory('VPS', ['$http', function($http) {
  var factory = {};
  factory.index = function() {
    return $http.get('/vps/index');
  };
  factory.get = function(id) {
    return $http.get('/vps/detail/' + id);
  };
  factory.create = function(vps) {
    return $http.post('/vps/create/', vps);
  };
  factory.update = function(vps) {
    return $http.post('/vps/update/', vps);
  };
  factory.delete = function(id) {
    return $http.post('/vps/delete/' + id);
  };
  return factory;
}]);

app.factory('Cloud', ['$http', function($http) {
  var factory = {};
  factory.index = function() {
    return $http.get('/cloud/index');
  };
  factory.get = function(id) {
    return $http.get('/cloud/detail/' + id);
  };
  factory.create = function(cloud) {
    return $http.post('/cloud/create/', cloud);
  };
  factory.update = function(cloud) {
    return $http.post('/cloud/update/', cloud);
  };
  factory.delete = function(id) {
    return $http.post('/cloud/delete/' + id);
  };
  return factory;
}]);
app.factory('Provider', ['$http', function($http) {
  var factory = {};
  factory.index = function() {
    return $http.get('/provider/index');
  };
  factory.get = function(id) {
    return $http.get('/provider/detail/' + id);
  };
  factory.create = function(provider) {
    return $http.post('/provider/create/', provider);
  };
  factory.update = function(provider) {
    return $http.post('/provider/update/', provider);
  };
  factory.delete = function(id) {
    return $http.post('/provider/delete/' + id);
  };
  return factory;
}]);
app.factory('Coupon', ['$http', function($http) {
  var factory = {};
  factory.index = function() {
    return $http.get('/coupon/index');
  };
  factory.get = function(id) {
    return $http.get('/coupon/detail/' + id);
  };
  factory.create = function(coupon) {
    return $http.post('/coupon/create/', coupon);
  };
  factory.update = function(coupon) {
    return $http.post('/coupon/update/', coupon);
  };
  factory.delete = function(id) {
    return $http.post('/coupon/delete/' + id);
  };
  return factory;
}]);
app.filter('capitalizeFirst',
  function() {
    return function(input, scope) {
      var text = input.substring(0, 1).toUpperCase() + input.substring(1).toLowerCase();
      return text;
    }
  });

app.controller('mainController', ['$rootScope', '$scope', '$http',
  function($rootScope, $scope, $http) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      $scope.loading = true;
      $scope.finish = false;
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $scope.loading = false;
      $scope.finish = true;
    });
  }
]);