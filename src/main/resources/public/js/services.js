angular.module('son')
    .service('navSearch', function() {
        var navbarFormSelector = 'form.navbar-form';
        return {
            toggle: function() {

                var navbarForm = $(navbarFormSelector);

                navbarForm.toggleClass('open');

                var isOpen = navbarForm.hasClass('open');

                navbarForm.find('input')[isOpen ? 'focus' : 'blur']();

            },

            dismiss: function() {
                $(navbarFormSelector)
                    .removeClass('open')      // Close control
                    .find('input[type="text"]').blur() // remove focus
                    .val('')                    // Empty input
                ;
            }
        };

    })
    .service('toggleStateService', ['$rootScope', function($rootScope) {

        var storageKeyName  = 'toggleState';

        // Helper object to check for words in a phrase //
        var WordChecker = {
            hasWord: function (phrase, word) {
                return new RegExp('(^|\\s)' + word + '(\\s|$)').test(phrase);
            },
            addWord: function (phrase, word) {
                if (!this.hasWord(phrase, word)) {
                    return (phrase + (phrase ? ' ' : '') + word);
                }
            },
            removeWord: function (phrase, word) {
                if (this.hasWord(phrase, word)) {
                    return phrase.replace(new RegExp('(^|\\s)*' + word + '(\\s|$)*', 'g'), '');
                }
            }
        };

        // Return service public methods
        return {
            // Add a state to the browser storage to be restored later
            addState: function(classname){
                var data = angular.fromJson($rootScope.$storage[storageKeyName]);

                if(!data)  {
                    data = classname;
                }
                else {
                    data = WordChecker.addWord(data, classname);
                }

                $rootScope.$storage[storageKeyName] = angular.toJson(data);
            },

            // Remove a state from the browser storage
            removeState: function(classname){
                var data = $rootScope.$storage[storageKeyName];
                // nothing to remove
                if(!data) return;

                data = WordChecker.removeWord(data, classname);

                $rootScope.$storage[storageKeyName] = angular.toJson(data);
            },

            // Load the state string and restore the classlist
            restoreState: function($elem) {
                var data = angular.fromJson($rootScope.$storage[storageKeyName]);

                // nothing to restore
                if(!data) return;
                $elem.addClass(data);
            }

        };

    }])
    .service('APIInterceptor', function($rootScope, UserService) {
        var service = this;
        service.request = function(config) {
            var currentUser = UserService.getCurrentUser(),
                access_token = currentUser ? currentUser.access_token : null;
            if (access_token) {
                config.headers.authorization = access_token;
            }
            return config;
        };
        service.responseError = function(response) {
            if (response.status === 401) {
                $rootScope.$broadcast('unauthorized');
            }
            return response;
        };
    })
    .service('browser', function(){
        "use strict";

        var matched, browser;

        var uaMatch = function( ua ) {
            ua = ua.toLowerCase();

            var match = /(opr)[\/]([\w.]+)/.exec( ua ) ||
                /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
                /(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
                /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
                /(msie) ([\w.]+)/.exec( ua ) ||
                ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec( ua ) ||
                ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
                [];

            var platform_match = /(ipad)/.exec( ua ) ||
                /(iphone)/.exec( ua ) ||
                /(android)/.exec( ua ) ||
                /(windows phone)/.exec( ua ) ||
                /(win)/.exec( ua ) ||
                /(mac)/.exec( ua ) ||
                /(linux)/.exec( ua ) ||
                /(cros)/i.exec( ua ) ||
                [];

            return {
                browser: match[ 3 ] || match[ 1 ] || "",
                version: match[ 2 ] || "0",
                platform: platform_match[ 0 ] || ""
            };
        };

        matched = uaMatch( window.navigator.userAgent );
        browser = {};

        if ( matched.browser ) {
            browser[ matched.browser ] = true;
            browser.version = matched.version;
            browser.versionNumber = parseInt(matched.version);
        }

        if ( matched.platform ) {
            browser[ matched.platform ] = true;
        }

        // These are all considered mobile platforms, meaning they run a mobile browser
        if ( browser.android || browser.ipad || browser.iphone || browser[ "windows phone" ] ) {
            browser.mobile = true;
        }

        // These are all considered desktop platforms, meaning they run a desktop browser
        if ( browser.cros || browser.mac || browser.linux || browser.win ) {
            browser.desktop = true;
        }

        // Chrome, Opera 15+ and Safari are webkit based browsers
        if ( browser.chrome || browser.opr || browser.safari ) {
            browser.webkit = true;
        }

        // IE11 has a new token so we will assign it msie to avoid breaking changes
        if ( browser.rv )
        {
            var ie = "msie";

            matched.browser = ie;
            browser[ie] = true;
        }

        // Opera 15+ are identified as opr
        if ( browser.opr )
        {
            var opera = "opera";

            matched.browser = opera;
            browser[opera] = true;
        }

        // Stock Android browsers are marked as Safari on Android.
        if ( browser.safari && browser.android )
        {
            var android = "android";

            matched.browser = android;
            browser[android] = true;
        }

        // Assign the name and platform variable
        browser.name = matched.browser;
        browser.platform = matched.platform;


        return browser;

    })
;
