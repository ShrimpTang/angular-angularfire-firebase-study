angular.module('app', ['firebase', 'ngRoute'])
    .run(function ($rootScope, $location) {
        $rootScope.$on('$routeChangeError', function (e, next, prev,  err) {
            if(err === 'AUTH_REQUIRED'){
                $location.path('/login')
            }
        })

    })
    .config(function ($routeProvider) {
        $routeProvider
            .when('/home', {
                template: '<home categorise="$resolve.categorise" expenses-in-order="$resolve.expensesInOrder"></home>',
                resolve:{
                    expensesInOrder: function (fbRef,$firebaseAuthService, expenseList) {
                        return $firebaseAuthService.$requireAuth().then(function () {
                            return expenseList(fbRef.getExpensesRef().orderByChild("name")).$loaded();
                        })
                    },
                    categorise: function (fbRef,$firebaseAuthService,$firebaseArray) {
                        return $firebaseAuthService.$requireAuth().then(function () {
                            var query = fbRef.getCategoryRef().orderByChild('name');
                            return $firebaseArray(query).$loaded();
                        })
                    }
                }
            })
            .when('/userpref', {
                template: '<edit-user-pref user-preferences="$resolve.userPreferences"></edit-user-pref>',
                resolve: {
                    userPreferences: function (fbRef, $firebaseObject,$firebaseAuthService) {
                        return $firebaseAuthService.$requireAuth().then(function () {
                            return $firebaseObject(fbRef.getPreferencesRef()).$loaded();
                        })

                    }

                }
            })
            .when('/categorise',{
                template:'<category-list categories="$resolve.categorise"></category-list>',
                resolve:{
                    categorise: function (fbRef,$firebaseAuthService,$firebaseArray) {
                        return $firebaseAuthService.$requireAuth().then(function () {
                            var query = fbRef.getCategoryRef().orderByChild('name');
                            return $firebaseArray(query).$loaded();
                        })
                    }
                }
            })
            .when('/login', {
                template: '<login current-auth="$resolve.currentAuth"></login>',
                resolve: {
                    currentAuth: function ($firebaseAuthService) {
                        return $firebaseAuthService.$waitForAuth()
                    }
                }
            })  .when('/logout', {
                template: '<logout></logout>'
            })

            .otherwise('/home')
    });