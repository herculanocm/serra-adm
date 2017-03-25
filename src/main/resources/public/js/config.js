angular.module('son')
    .config(['cfpLoadingBarProvider','$httpProvider', function(cfpLoadingBarProvider,$httpProvider) {
        cfpLoadingBarProvider.includeBar = true;
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.latencyThreshold = 500;
        cfpLoadingBarProvider.parentSelector = '.wrapper > section';

        $httpProvider.interceptors.push("timesInterceptor");


    }]);



//CreateUserController