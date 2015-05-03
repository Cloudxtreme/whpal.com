var app = angular.module('backendApp', [
    'ui.router',
    'ngSanitize',
    'smart-table',
    'ui.bootstrap',
  ])
  .run(['$rootScope', '$state', '$stateParams', '$http', 'VPS', 'Cloud',
    function($rootScope, $state, $stateParams, $http, VPS, Cloud) {
      $rootScope.title = 'WHPAL: Web Hosting Listing';
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
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {
      $locationProvider.hashPrefix('!');
      $urlRouterProvider.otherwise('/vps-listing')
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
        controller: ['$rootScope', '$scope', '$stateParams', 'vps', 'VPS', 'plans',
          function($rootScope, $scope, $stateParams, vps, VPS, plans) {
            $scope.vps = vps.data;
            $rootScope.title = $scope.vps.provider.name + " - " + $scope.vps.name + ' ' + $scope.vps.ram + 'GB RAM VPS';
            if ($scope.vps.location !== '') {
              $rootScope.description = $scope.vps.provider.name + ' ' + $scope.vps.ram + 'GB RAM VPS ' + $scope.vps.hdspace + ' GB ' + $scope.vps.hdtype + ' in ' + $scope.vps.location.split('|')[0] + ' for $' + $scope.vps.price + '/month';
            } else {
              $rootScope.description = $scope.vps.provider.name + ' ' + $scope.vps.ram + 'GB RAM VPS ' + $scope.vps.hdspace + ' GB ' + $scope.vps.hdtype + ' for $' + $scope.vps.price + '/month';
            }
            $rootScope.keywords = 'VPS, hosting, web hosting, CDN';
            $rootScope.currentAction = $scope.vps.provider.name + " - " + $scope.vps.name;
            $scope.plans = plans.data;
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
        controller: ['$rootScope', '$scope', '$stateParams', 'vps', 'VPS',
          function($rootScope, $scope, $stateParams, vps, VPS) {
            $rootScope.title = 'WHPAL: Web Hosting Listing';
            $rootScope.description = 'WHPal provides a comprehensive list of web hosting service. You may even sort, filter and compare different plans.';
            $rootScope.keywords = 'VPS, hosting, web hosting, CDN';

            function vpsFilter(rows, criteria) {
              var filtered = [];
              angular.forEach(rows, function(row) {
                if (row.price < criteria.minprice || row.price > criteria.maxprice) {
                  return;
                }
                if (row.cpu < criteria.mincpu || row.cpu > criteria.maxcpu) {
                  return;
                }
                if (row.ram < criteria.minram || row.ram > criteria.maxram) {
                  return;
                }
                if (row.hdspace < criteria.minhd || row.hdspace > criteria.maxhd) {
                  return;
                }
                if (row.bandwidth < criteria.minbandwidth || row.bandwidth > criteria.maxbandwidth) {
                  return;
                }
                // if (criteria.boolhdd || criteria.boolssd || criteria.boolhybrid) {
                //   var bfiltered = false;
                //   if (criteria.boolhdd && row.hdtype === 'HDD') {
                //     bfiltered = true;
                //   }
                //   if (criteria.boolssd && row.hdtype === 'SSD') {
                //     bfiltered = true;
                //   }
                //   if (criteria.boolhybrid && row.hdtype === 'Hybrid') {
                //     bfiltered = true;
                //   }
                //   if (bfiltered === false) {
                //     return;
                //   }
                // }
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
                // if (criteria.boolovz || criteria.boolxen || criteria.boolkvm || criteria.boolwin) {
                //   var bfiltered = false;
                //   if (criteria.boolovz && row.virtualization === 'OpenVZ') {
                //     bfiltered = true;
                //   }
                //   if (criteria.boolxen && row.virtualization === 'XEN') {
                //     bfiltered = true;
                //   }
                //   if (criteria.boolkvm && row.virtualization === 'KVM') {
                //     bfiltered = true;
                //   }
                //   if (criteria.boolwin && row.virtualization === 'Windows') {
                //     bfiltered = true;
                //   }
                //   console.log(bfiltered);
                //   if (bfiltered === false) {
                //     return;
                //   }
                // }
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
              maxram: 64,
              boolovz: false,
              boolxen: false,
              boolwin: false,
              boolkvm: false,
              boolhdd: false,
              boolssd: false,
              boolhybrid: false,
              hdtype: 'All',
              platform: 'All',
              minbandwidth: 0,
              maxbandwidth: 10000,
              minhd: 0,
              maxhd: 1000,
              mincpu: 0,
              maxcpu: 16,
              minprice: 0,
              maxprice: 1000,
              location: '',
            }
            angular.copy(vps.data, $scope.vps);
            $scope.displayedVPS = [].concat($scope.vps);
            $scope.$watch('criteria', function() {
              $scope.vps = vpsFilter(vps.data, $scope.criteria);
              $scope.displayedVPS = [].concat($scope.vps);
            }, true);
            $scope.toggleHDD = function() {
              $scope.criteria.boolhdd = !$scope.criteria.boolhdd;
            }
            $scope.toggleSSD = function() {
              $scope.criteria.boolssd = !$scope.criteria.boolssd;
            }
            $scope.toggleHybrid = function() {
              $scope.criteria.boolhybrid = !$scope.criteria.boolhybrid;
            }
            $scope.toggleOVZ = function() {
              $scope.criteria.boolovz = !$scope.criteria.boolovz;
            }
            $scope.toggleXEN = function() {
              $scope.criteria.boolxen = !$scope.criteria.boolxen;
            }
            $scope.toggleKVM = function() {
              $scope.criteria.boolkvm = !$scope.criteria.boolkvm;
            }
            $scope.toggleWindows = function() {
              $scope.criteria.boolwin = !$scope.criteria.boolwin;
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
              $scope.criteria.maxram = parseFloat($(this).val()[1]).toFixed(1);
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
              $scope.criteria.maxprice = parseInt($(this).val()[1], 10);
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
          cloud: ['Cloud', '$stateParams', function(VPS, $stateParams) {
            return VPS.get($stateParams.id.match(/\d+/)[0]);
          }],
          plans: ['Cloud', '$stateParams', function(VPS, $stateParams) {
            return VPS.similar($stateParams.id.match(/\d+/)[0]);
          }]
        },
        templateUrl: "/frontend/partials/cloud-detail.html",
        url: "/cloud/{id}",
        controller: ['$rootScope', '$scope', '$stateParams', 'cloud', 'Cloud', 'plans',
          function($rootScope, $scope, $stateParams, cloud, VPS, plans) {
            $scope.cloud = cloud.data;
            $rootScope.title = $scope.cloud.provider.name + " - " + $scope.cloud.name + ' ' + $scope.cloud.ram + 'GB RAM Cloud';
            if ($scope.cloud.location !== '') {
              $rootScope.description = $scope.cloud.provider.name + ' ' + $scope.cloud.ram + 'GB Cloud ' + $scope.cloud.hdspace + ' GB ' + $scope.cloud.hdtype + ' in ' + $scope.cloud.location.split('|')[0] + ' for $' + $scope.cloud.monthPrice + '/month';
            } else {
              $rootScope.description = $scope.cloud.provider.name + ' ' + $scope.cloud.ram + 'GB Cloud ' + $scope.cloud.hdspace + ' GB ' + $scope.cloud.hdtype + ' for $' + $scope.cloud.monthPrice + '/month';
            }
            $rootScope.keywords = 'VPS, hosting, web hosting, CDN';
            $rootScope.currentAction = $scope.cloud.provider.name + " - " + $scope.cloud.name;
            $scope.plans = plans.data;
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
        controller: ['$rootScope', '$scope', '$stateParams', 'cloud', 'Cloud',
          function($rootScope, $scope, $stateParams, cloud, Cloud) {
            $rootScope.title = 'WHPAL: Web Hosting Listing';
            $rootScope.description = 'WHPal provides a comprehensive list of web hosting service. You may even sort, filter and compare different plans.';
            $rootScope.keywords = 'VPS, hosting, web hosting, CDN';

            function cloudFilter(rows, criteria) {
              var filtered = [];
              angular.forEach(rows, function(row) {
                if (row.monthPrice < criteria.minprice || row.monthPrice > criteria.maxprice) {
                  return;
                }
                if (row.cpu < criteria.mincpu || row.cpu > criteria.maxcpu) {
                  return;
                }
                if (row.ram < criteria.minram || row.ram > criteria.maxram) {
                  return;
                }
                if (row.hdspace < criteria.minhd || row.hdspace > criteria.maxhd) {
                  return;
                }
                if (row.bandwidth < criteria.minbandwidth || row.bandwidth > criteria.maxbandwidth) {
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
              maxram: 64,
              hdtype: 'All',
              minbandwidth: 0,
              maxbandwidth: 10000,
              minhd: 0,
              maxhd: 1000,
              mincpu: 0,
              maxcpu: 16,
              minprice: 0,
              maxprice: 1000,
              location: '',
            }
            angular.copy(cloud.data, $scope.cloud);
            $scope.displayedCloud = [].concat($scope.cloud);
            $scope.$watch('criteria', function() {
              $scope.cloud = cloudFilter(cloud.data, $scope.criteria);
              $scope.displayedCloud = [].concat($scope.cloud);
            }, true);
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
              $scope.criteria.maxram = parseFloat($(this).val()[1]).toFixed(1);
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
              $scope.criteria.maxprice = parseInt($(this).val()[1], 10);
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
      if (input >= 10000) {
        return '10000+ GB';
      } else if (input === 0) {
        return 'No traffic included';
      } else {
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