var app = angular.module('backendApp', [
    'ui.router',
    'ngSanitize',
    'smart-table',
    'ui.bootstrap',
    'angulartics',
    'angulartics.google.analytics'
  ])
  .run(['$rootScope', '$state', '$stateParams', '$http', 'VPS', 'Cloud',
    function($rootScope, $state, $stateParams, $http, VPS, Cloud) {
      $rootScope.title = 'WHPal: Web Hosting Listing';
      $rootScope.description = 'WHPal provides a comprehensive list of web hosting service. You may even sort, filter and compare different plans.';
      $rootScope.keywords = 'VPS, hosting, web hosting, CDN';
      VPS.total().then(function(res) {
        $rootScope.vpsCount = res.data.total;
      });
      Cloud.total().then(function(res) {
        $rootScope.cloudCount = res.data.total;
      });
      //$http.defaults.headers.common.UserToken = localStorage.getItem('token');
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$analyticsProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider, $analyticsProvider) {
      $analyticsProvider.virtualPageviews(false);
      $locationProvider.hashPrefix('!');
      $urlRouterProvider.otherwise('/index');
      $stateProvider.state("backend_home", {
        resolve: {
          plans: ['$http', function($http) {
            return $http.get('/site/plans');
          }]
        },
        templateUrl: "/frontend/partials/home.html",
        url: "/index",
        controller: ['$rootScope', '$scope', '$stateParams', 'plans', '$analytics',
          function($rootScope, $scope, $stateParams, plans, $analytics) {
            $rootScope.title = 'WHPal: Web Hosting Listing';
            $rootScope.description = 'WHPal provides a comprehensive list of web hosting service. You may even sort, filter and compare different plans.';
            $rootScope.keywords = 'VPS, hosting, web hosting, CDN';
            $rootScope.currentAction = "Web Hosting Pal";
            $scope.vpsPlans = plans.data.vps;
            $scope.cloudPlans = plans.data.cloud;
            $analytics.pageTrack('/index');
          }
        ]
      });
      $stateProvider.state("backend_provider_detail", {
        resolve: {
          provider: ['Provider', '$stateParams', function(Provider, $stateParams) {
            return Provider.get($stateParams.id.match(/\d+/)[0]);
          }],
          plans: ['Provider', '$stateParams', function(Provider, $stateParams) {
            return Provider.plans($stateParams.id.match(/\d+/)[0]);
          }]
        },
        templateUrl: "/frontend/partials/provider-detail.html",
        url: "/provider/{id}",
        controller: ['$rootScope', '$scope', '$stateParams', 'provider', 'plans', '$analytics',
          function($rootScope, $scope, $stateParams, provider, plans, $analytics) {
            $rootScope.keywords = 'VPS, hosting, web hosting, CDN';
            $scope.provider = provider.data;
            $rootScope.currentAction = $scope.provider.name;
            $rootScope.title = $scope.provider.name + ' information | WHPal';
            $rootScope.description = 'The hosting plans and coupons provided by '+$scope.provider.name;
            $scope.vpsPlans = plans.data.vps;
            $scope.cloudPlans = plans.data.cloud;
            $scope.coupons = plans.data.coupon;
            $analytics.pageTrack('/provider/'+$stateParams.id);
          }
        ]
      });
      $stateProvider.state("backend_vps_detail", {
        resolve: {
          vps: ['VPS', '$stateParams', function(VPS, $stateParams) {
            return VPS.get($stateParams.id.match(/\d+/)[0]);
          }],
          plans: ['VPS', '$stateParams', function(VPS, $stateParams) {
            return VPS.similar($stateParams.id.match(/\d+/)[0]);
          }]
        },
        templateUrl: "/frontend/partials/vps-detail.html",
        url: "/vps/{id}",
        controller: ['$rootScope', '$scope', '$stateParams', 'vps', 'VPS', 'plans', '$analytics',
          function($rootScope, $scope, $stateParams, vps, VPS, plans, $analytics) {
            $scope.vps = vps.data;
            $scope.platform = '';
            if ($scope.vps.virtualization !== 'Unknown') {
              $scope.platform = " " + $scope.vps.virtualization + " ";
            }
            $rootScope.title = $scope.vps.provider.name + " - " + $scope.vps.name + ' ' + $scope.vps.ram + 'GB RAM ' + $scope.platform + 'VPS | WHPal';
            if ($scope.vps.location !== '') {
              $rootScope.description = $scope.vps.provider.name + ' ' + $scope.vps.ram + 'GB RAM ' + $scope.platform + 'VPS ' + $scope.vps.hdspace + ' GB ' + $scope.vps.hdtype + ' in ' + $scope.vps.location.split('|')[0] + ' for $' + $scope.vps.price + '/month';
            } else {
              $rootScope.description = $scope.vps.provider.name + ' ' + $scope.vps.ram + 'GB RAM ' + $scope.platform + 'VPS ' + $scope.vps.hdspace + ' GB ' + $scope.vps.hdtype + ' for $' + $scope.vps.price + '/month';
            }
            $rootScope.keywords = 'VPS, hosting, web hosting, CDN';
            $rootScope.currentAction = $scope.vps.provider.name + " - " + $scope.vps.name;
            $scope.plans = plans.data;
            $analytics.pageTrack('/vps/' + $stateParams.id);
          }
        ]
      });
      $stateProvider.state("backend_vps", {
        resolve: {
          vps: ['VPS', '$stateParams', function(VPS, $stateParams) {
            return VPS.index();
          }],
        },
        templateUrl: "/frontend/partials/vps.html",
        url: "/vps-listing",
        controller: ['$rootScope', '$scope', '$stateParams', 'vps', 'VPS', '$analytics',
          function($rootScope, $scope, $stateParams, vps, VPS, $analytics) {
            $rootScope.title = 'VPS Hosting Listing | WHPal';
            $rootScope.description = 'WHPal provides a comprehensive list of web hosting service. You may even sort, filter and compare different plans.';
            $rootScope.keywords = 'VPS, hosting, web hosting, CDN';
            $analytics.pageTrack('/vps-lsting');

            function vpsFilter(rows, criteria) {
              var filtered = [];
              angular.forEach(rows, function(row) {
                if (row.price < criteria.minprice || (row.price > criteria.maxprice && criteria.maxprice < 100)) {
                  return;
                }
                if (row.cpu < criteria.mincpu || row.cpu > criteria.maxcpu) {
                  return;
                }
                if (row.ram < criteria.minram || (row.ram > criteria.maxram && criteria.maxram < 16)) {
                  return;
                }
                if (row.hdspace < criteria.minhd || row.hdspace > criteria.maxhd) {
                  return;
                }
                if (row.bandwidth < criteria.minbandwidth || (row.bandwidth > criteria.maxbandwidth && criteria.maxbandwidth < 10000)) {
                  return;
                }
                if (criteria.hdtype !== 'All') {
                  if (criteria.hdtype !== row.hdtype) {
                    return;
                  }
                }
                if (criteria.platform !== 'All') {
                  if (criteria.platform !== row.virtualization) {
                    return;
                  }
                }
                if (criteria.location !== '' && row.location.toLowerCase().indexOf(criteria.location.toLowerCase()) <= -1) {
                  return;
                }
                filtered.push(row);
              });
              return filtered;
            };
            $rootScope.currentAction = "VPS Hosting";
            $scope.criteria = {
              minram: 0,
              maxram: 16,
              hdtype: 'All',
              platform: 'All',
              minbandwidth: 0,
              maxbandwidth: 10000,
              minhd: 0,
              maxhd: 1000,
              mincpu: 0,
              maxcpu: 16,
              minprice: 0,
              maxprice: 100,
              location: '',
              _maxram: '16+',
              _maxprice: '100+'
            }
            angular.copy(vps.data, $scope.vps);
            $scope.displayedVPS = [].concat($scope.vps);
            $scope.$watch('criteria', function() {
              $scope.vps = vpsFilter(vps.data, $scope.criteria);
              $scope.displayedVPS = [].concat($scope.vps);
            }, true);
            $scope.compareItems = [];
            $scope.compareTableWidth = 700;
            $scope.compareTable = false;
            $scope.compare = function(id) {
              for (i = 0; i < $scope.vps.length; i++) {
                if (id === $scope.vps[i].id) {
                  $theVPS = $scope.vps[i];
                  break;
                }
              }
              for (i = 0; i < $scope.compareItems.length; i++) {
                if (id === $scope.compareItems[i].id) {
                  $theVPS = $scope.compareItems[i];
                  $scope.compareTable = true;
                  return false;
                }
              }
              $scope.compareItems.push($theVPS);
              $scope.compareTableWidth = 350 * $scope.compareItems.length;
              if ($scope.compareTableWidth === 350)
                $scope.compareTableWidth = 700;
              $scope.compareTable = true;
              console.log($scope.compareItems);
            }
            $scope.removeCompare = function(id) {
              for (i = 0; i < $scope.compareItems.length; i++) {
                if (id === $scope.compareItems[i].id) {
                  $scope.compareItems.splice(i, 1);
                  break;
                }
              }
              $scope.compareTableWidth = 350 * $scope.compareItems.length;
              if ($scope.compareTableWidth === 350)
                $scope.compareTableWidth = 700;
              if ($scope.compareItems.length === 0) {
                $scope.compareTable = false;
              }
            }
            $('.cpuslider').noUiSlider({
              start: [$scope.criteria.minram, $scope.criteria.maxram],
              step: 1,
              connect: true,
              range: {
                'min': $scope.criteria.mincpu,
                'max': $scope.criteria.maxcpu
              }
            });
            $('.cpuslider').on('change', function() {
              $scope.criteria.mincpu = parseInt($(this).val()[0], 10);
              $scope.criteria.maxcpu = parseInt($(this).val()[1], 10);
              $scope.$apply();
            });
            $('.hdslider').noUiSlider({
              start: [$scope.criteria.minram, $scope.criteria.maxhd],
              step: 50,
              connect: true,
              range: {
                'min': $scope.criteria.minhd,
                'max': $scope.criteria.maxhd
              }
            });
            $('.hdslider').on('change', function() {
              $scope.criteria.minhd = parseInt($(this).val()[0], 10);
              $scope.criteria.maxhd = parseInt($(this).val()[1], 10);
              $scope.$apply();
            });
            $('.ramslider').noUiSlider({
              start: [$scope.criteria.minram, $scope.criteria.maxram],
              step: 0.5,
              connect: true,
              range: {
                'min': $scope.criteria.minram,
                'max': $scope.criteria.maxram
              }
            });
            $('.ramslider').on('change', function() {
              $scope.criteria.minram = parseFloat($(this).val()[0]).toFixed(1);
              $scope.criteria.maxram = $scope.criteria._maxram = parseFloat($(this).val()[1]).toFixed(1);
              if ($scope.criteria._maxram >= 16) {
                $scope.criteria._maxram = '16+';
              }
              $scope.$apply();
            });
            $('.priceslider').noUiSlider({
              start: [$scope.criteria.minprice, $scope.criteria.maxprice],
              step: 5,
              connect: true,
              range: {
                'min': $scope.criteria.minprice,
                'max': $scope.criteria.maxprice
              }
            });
            $('.priceslider').on('change', function() {
              $scope.criteria.minprice = parseInt($(this).val()[0], 10);
              $scope.criteria.maxprice = $scope.criteria._maxprice = parseInt($(this).val()[1], 10);
              if ($scope.criteria._maxprice >= 100) {
                $scope.criteria._maxprice = '100+';
              }
              $scope.$apply();
            });

            $('.bwslider').noUiSlider({
              start: [$scope.criteria.minbandwidth, $scope.criteria.maxbandwidth],
              step: 50,
              connect: true,
              range: {
                'min': $scope.criteria.minbandwidth,
                'max': $scope.criteria.maxbandwidth
              }
            });
            $('.bwslider').on('change', function() {
              $scope.criteria.minbandwidth = parseInt($(this).val()[0], 10);
              $scope.criteria.maxbandwidth = parseInt($(this).val()[1], 10);
              $scope.$apply();
            });
          }
        ]
      });
      $stateProvider.state("backend_cloud_detail", {
        resolve: {
          cloud: ['Cloud', '$stateParams', function(Cloud, $stateParams) {
            return Cloud.get($stateParams.id.match(/\d+/)[0]);
          }],
          plans: ['Cloud', '$stateParams', function(Cloud, $stateParams) {
            return Cloud.similar($stateParams.id.match(/\d+/)[0]);
          }]
        },
        templateUrl: "/frontend/partials/cloud-detail.html",
        url: "/cloud/{id}",
        controller: ['$rootScope', '$scope', '$stateParams', 'cloud', 'Cloud', 'plans', '$analytics',
          function($rootScope, $scope, $stateParams, cloud, Cloud, plans, $analytics) {
            $scope.cloud = cloud.data;
            $rootScope.title = $scope.cloud.provider.name + " - " + $scope.cloud.name + ' ' + $scope.cloud.ram + 'GB RAM Cloud | WHPal';
            if ($scope.cloud.location !== '') {
              $rootScope.description = $scope.cloud.provider.name + ' ' + $scope.cloud.ram + 'GB Cloud ' + $scope.cloud.hdspace + ' GB ' + $scope.cloud.hdtype + ' in ' + $scope.cloud.location.split('|')[0] + ' for $' + $scope.cloud.monthPrice + '/month';
            } else {
              $rootScope.description = $scope.cloud.provider.name + ' ' + $scope.cloud.ram + 'GB Cloud ' + $scope.cloud.hdspace + ' GB ' + $scope.cloud.hdtype + ' for $' + $scope.cloud.monthPrice + '/month';
            }
            $rootScope.keywords = 'VPS, hosting, web hosting, CDN';
            $rootScope.currentAction = $scope.cloud.provider.name + " - " + $scope.cloud.name;
            $scope.plans = plans.data;
            $analytics.pageTrack('/cloud/' + $stateParams.id);
          }
        ]
      });
      $stateProvider.state("backend_cloud", {
        resolve: {
          cloud: ['Cloud', '$stateParams', function(Cloud, $stateParams) {
            return Cloud.index();
          }],
        },
        templateUrl: "/frontend/partials/cloud.html",
        url: "/cloud-listing",
        controller: ['$rootScope', '$scope', '$stateParams', 'cloud', 'Cloud', '$analytics',
          function($rootScope, $scope, $stateParams, cloud, Cloud, $analytics) {
            $rootScope.title = 'Cloud Hosting Listing | WHPal';
            $rootScope.description = 'WHPal provides a comprehensive list of web hosting service. You may even sort, filter and compare different plans.';
            $rootScope.keywords = 'VPS, hosting, web hosting, CDN';
            $analytics.pageTrack('/cloud-listing');

            function cloudFilter(rows, criteria) {
              var filtered = [];
              angular.forEach(rows, function(row) {
                if (row.monthPrice < criteria.minprice || (row.monthPrice > criteria.maxprice && criteria.maxprice < 100)) {
                  return;
                }
                if (row.cpu < criteria.mincpu || row.cpu > criteria.maxcpu) {
                  return;
                }
                if (row.ram < criteria.minram || (row.ram > criteria.maxram && criteria.maxram < 16)) {
                  return;
                }
                if (row.hdspace < criteria.minhd || (row.hdspace > criteria.maxhd && criteria.maxhd < 1000)) {
                  return;
                }
                if (row.bandwidth < criteria.minbandwidth || (row.bandwidth > criteria.maxbandwidth && criteria.maxbandwidth < 10000)) {
                  return;
                }
                if (criteria.hdtype !== 'All') {
                  if (criteria.hdtype !== row.hdtype) {
                    return;
                  }
                }
                if (criteria.location !== '' && row.location.toLowerCase().indexOf(criteria.location.toLowerCase()) <= -1) {
                  return;
                }
                filtered.push(row);
              });
              return filtered;
            };
            $rootScope.currentAction = "Cloud Hosting";
            $scope.criteria = {
              minram: 0,
              maxram: 16,
              hdtype: 'All',
              minbandwidth: 0,
              maxbandwidth: 10000,
              minhd: 0,
              maxhd: 1000,
              mincpu: 0,
              maxcpu: 24,
              minprice: 0,
              maxprice: 100,
              location: '',
              _maxram: '16+',
              _maxprice: '100+',
            }
            angular.copy(cloud.data, $scope.cloud);
            $scope.displayedCloud = [].concat($scope.cloud);
            $scope.$watch('criteria', function() {
              $scope.cloud = cloudFilter(cloud.data, $scope.criteria);
              $scope.displayedCloud = [].concat($scope.cloud);
            }, true);
            $('.cpuslider').noUiSlider({
              start: [$scope.criteria.minram, $scope.criteria.maxcpu],
              step: 1,
              connect: true,
              range: {
                'min': $scope.criteria.mincpu,
                'max': $scope.criteria.maxcpu
              }
            });
            $('.cpuslider').on('change', function() {
              $scope.criteria.mincpu = parseInt($(this).val()[0], 10);
              $scope.criteria.maxcpu = parseInt($(this).val()[1], 10);
              $scope.$apply();
            });
            $('.hdslider').noUiSlider({
              start: [$scope.criteria.minram, $scope.criteria.maxhd],
              step: 50,
              connect: true,
              range: {
                'min': $scope.criteria.minhd,
                'max': $scope.criteria.maxhd
              }
            });
            $('.hdslider').on('change', function() {
              $scope.criteria.minhd = parseInt($(this).val()[0], 10);
              $scope.criteria.maxhd = parseInt($(this).val()[1], 10);
              $scope.$apply();
            });
            $('.ramslider').noUiSlider({
              start: [$scope.criteria.minram, $scope.criteria.maxram],
              step: 0.5,
              connect: true,
              range: {
                'min': $scope.criteria.minram,
                'max': $scope.criteria.maxram
              }
            });
            $('.ramslider').on('change', function() {
              $scope.criteria.minram = parseFloat($(this).val()[0]).toFixed(1);
              $scope.criteria.maxram = $scope.criteria._maxram = parseFloat($(this).val()[1]).toFixed(1);
              if ($scope.criteria._maxram >= 16) {
                $scope.criteria._maxram = '16+';
              }
              $scope.$apply();
            });
            $('.priceslider').noUiSlider({
              start: [$scope.criteria.minprice, $scope.criteria.maxprice],
              step: 5,
              connect: true,
              range: {
                'min': $scope.criteria.minprice,
                'max': $scope.criteria.maxprice
              }
            });
            $('.priceslider').on('change', function() {
              $scope.criteria.minprice = parseInt($(this).val()[0], 10);
              $scope.criteria.maxprice = $scope.criteria._maxprice = parseInt($(this).val()[1], 10);
              if ($scope.criteria._maxprice >= 100) {
                $scope.criteria._maxprice = '100+';
              }
              $scope.$apply();
            });

            $('.bwslider').noUiSlider({
              start: [$scope.criteria.minbandwidth, $scope.criteria.maxbandwidth],
              step: 50,
              connect: true,
              range: {
                'min': $scope.criteria.minbandwidth,
                'max': $scope.criteria.maxbandwidth
              }
            });
            $('.bwslider').on('change', function() {
              $scope.criteria.minbandwidth = parseInt($(this).val()[0], 10);
              $scope.criteria.maxbandwidth = parseInt($(this).val()[1], 10);
              $scope.$apply();
            });
          }
        ]
      });
      $stateProvider.state("backend_about_us", {
        templateUrl: "/frontend/partials/about-us.html",
        url: "/about-us",
        controller: ['$rootScope', '$scope', '$stateParams',
          function($rootScope, $scope, $stateParams) {
            $rootScope.title = 'About US | WHPal';
            $rootScope.currentAction = "About US";
          }
        ]
      });
    }
  ]);

app.factory('VPS', ['$http', function($http) {
  var factory = {};
  factory.total = function() {
    return $http.get('/vps/total');
  }
  factory.index = function() {
    return $http.get('/vps/index');
  };
  factory.get = function(id) {
    return $http.get('/vps/detail/' + id);
  };
  factory.similar = function(id) {
    return $http.get('/vps/similar/' + id);
  };
  return factory;
}]);

app.factory('Cloud', ['$http', function($http) {
  var factory = {};
  factory.total = function() {
    return $http.get('/cloud/total');
  }
  factory.index = function() {
    return $http.get('/cloud/index');
  };
  factory.get = function(id) {
    return $http.get('/cloud/detail/' + id);
  };
  factory.similar = function(id) {
    return $http.get('/cloud/similar/' + id);
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
  factory.plans = function(id) {
    return $http.get('/provider/plans/' + id);
  };
  return factory;
}]);
app.filter('cpuFilter',
  function() {
    return function(input, scope) {
      if (input === 0) {
        return 'Unknown';
      } else {
        return input + ' Core';
      }
    }
  });
app.filter('cpuChargeFilter',
  function() {
    return function(input, scope) {
      if (input === '') {
        return '';
      } else {
        return '<br />' + input;
      }
    }
  });

app.filter('hdChargeFilter',
  function() {
    return function(input, scope) {
      if (input === '') {
        return '';
      } else {
        return input;
      }
    }
  });
app.filter('ramFilter',
  function() {
    return function(input, scope) {
      if (input === 0) {
        return '';
      } else {
        return input + ' GB';
      }
    }
  });
app.filter('portSpeedFilter',
  function() {
    return function(input, scope) {
      if (input === 0) {
        return 'Unknown';
      } else {
        return input + ' Mbps';
      }
    }
  });

app.filter('ipv4Filter',
  function() {
    return function(input, scope) {
      if (input === 0) {
        return 'Unknown<br />';
      } else {
        return input + ' IPv4<br />';
      }
    }
  });

app.filter('bwFilter',
  function() {
    return function(input, scope) {
      if (input === 0) {
        return 'No traffic included';
      } else {
        if (input === 1000000) {
          return 'Unmetered';
        }
        return input + ' GB';
      }
    }
  });

app.filter('ramChargeFilter',
  function() {
    return function(input, scope) {
      if (input === '') {
        return '';
      } else {
        return '' + input;
      }
    }
  });
app.filter('bwChargeFilter',
  function() {
    return function(input, scope) {
      if (input === '') {
        return '';
      } else {
        return '' + input;
      }
    }
  });
app.filter('ipChargeFilter',
  function() {
    return function(input, scope) {
      if (input === '') {
        return '';
      } else {
        return '' + input;
      }
    }
  });
app.filter('ipv6Filter',
  function() {
    return function(input, scope) {
      if (input === 0) {
        return '';
      } else {
        return input + ' IPv6';
      }
    }
  });
app.filter('locationFilter',
  function() {
    return function(input, scope) {
      return input.split('|')[0];
    }
  });

app.filter('locationDetailFilter',
  function() {
    return function(input, scope) {
      var allLocations = '';
      var regex = /\|/g;
      return input.replace(regex, '<br />');
    }
  });
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

app.filter('dateFilter',
  function() {
    return function(input, scope) {
      var date = new Date(input);
      if(date.getFullYear() > 2020){
        return 'Never / Not mentioned';
      }
      return date.getFullYear() + '-' + pad(date.getMonth() + 1, 2) + '-' + pad(date.getDate(), 2);
    }
  });
app.controller('mainController', ['$rootScope', '$scope', '$http',
  function($rootScope, $scope, $http) {
    var body = $("html, body");
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      $scope.loading = true;
      $scope.finish = false;
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $scope.currentTab = toState.name;
      $scope.loading = false;
      $scope.finish = true;
    });
    $("body").on("mouseover", ".left-menu", function() {
      $('.left-menu').addClass('left-menu-hover');
    }).on("mouseleave", ".left-menu", function() {
      $('.left-menu').removeClass('left-menu-hover');
    });
    $("body").on("click", ".left-menu-logo", function(event) {
      $('.left-menu').addClass('left-menu-hover');
      event.stopPropagation();
    });

    $("body").on("click", ".main", function() {
      $('.left-menu').removeClass('left-menu-hover');
    });

    $("body").on("click", ".res-menu", function(event) {
      $('.left-menu').addClass('left-menu-hover');
      event.stopPropagation();
    });
    $("body").on("click", ".left-menu a", function(event) {
      $('.left-menu').removeClass('left-menu-hover');
      event.stopPropagation();
    });
    $("body").on("click", ".scrollTop", function(event) {
      body.scrollTop(0);
    });
  }
]);