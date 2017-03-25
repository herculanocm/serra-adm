angular.module('son')
    .directive('sidebar', ['$window', 'APP_MEDIAQUERY', function($window, mq) {

        var $win  = $($window);
        var $html = $('html');
        var $body = $('body');
        var $scope;
        var $sidebar;

        return {
            restrict: 'EA',
            template: '<nav class="sidebar" ng-transclude></nav>',
            transclude: true,
            replace: true,
            link: function(scope, element, attrs) {

                $scope   = scope;
                $sidebar = element;

                var eventName = isTouch() ? 'click' : 'mouseenter' ;
                $sidebar.on( eventName, '.nav > li', function() {
                    if( isSidebarCollapsed() && !isMobile() )
                        toggleMenuItem( $(this) );
                });

                scope.$on('closeSidebarMenu', function() {
                    removeFloatingNav();
                    $('.sidebar li.open').removeClass('open');
                });
            }
        };


        // Open the collapse sidebar submenu items when on touch devices
        // - desktop only opens on hover
        function toggleTouchItem($element){
            $element
                .siblings('li')
                .removeClass('open')
                .end()
                .toggleClass('open');
        }

        // Handles hover to open items under collapsed menu
        // -----------------------------------
        function toggleMenuItem($listItem) {

            removeFloatingNav();

            var ul = $listItem.children('ul');

            if( !ul.length ) return;
            if( $listItem.hasClass('open') ) {
                toggleTouchItem($listItem);
                return;
            }

            var $aside = $('.aside');
            var mar =  $scope.app.layout.isFixed ?  parseInt( $aside.css('margin-top'), 0) : 0;

            var subNav = ul.clone().appendTo( $aside );

            toggleTouchItem($listItem);

            var itemTop = ($listItem.position().top + mar) - $sidebar.scrollTop();
            var vwHeight = $win.height();

            subNav
                .addClass('nav-floating')
                .css({
                    position: $scope.app.layout.isFixed ? 'fixed' : 'absolute',
                    top:      itemTop,
                    bottom:   (subNav.outerHeight(true) + itemTop > vwHeight) ? 0 : 'auto'
                });

            subNav.on('mouseleave', function() {
                toggleTouchItem($listItem);
                subNav.remove();
            });

        }

        function removeFloatingNav() {
            $('.sidebar-subnav.nav-floating').remove();
        }

        function isTouch() {
            return $html.hasClass('touch');
        }
        function isSidebarCollapsed() {
            return $body.hasClass('aside-collapsed');
        }
        function isSidebarToggled() {
            return $body.hasClass('aside-toggled');
        }
        function isMobile() {
            return $win.width() < mq.tablet;
        }
    }])
    .directive('scrollable', function(){
        return {
            restrict: 'EA',
            link: function(scope, elem, attrs) {
                var defaultHeight = 250;
                elem.slimScroll({
                    height: (attrs.height || defaultHeight)
                });
            }
        };
    })
    .directive('animate', function($window){

        'use strict';

        var $scroller = $(window).add('body, .wrapper');

        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {

                // Parse animations params and attach trigger to scroll
                var $elem     = $(elem),
                    offset    = $elem.data('offset'),
                    delay     = $elem.data('delay')     || 100, // milliseconds
                    animation = $elem.data('play')      || 'bounce';

                if(typeof offset !== 'undefined') {

                    // test if the element starts visible
                    testAnimation($elem);
                    // test on scroll
                    $scroller.scroll(function(){
                        testAnimation($elem);
                    });

                }

                // Test an element visibilty and trigger the given animation
                function testAnimation(element) {
                    if ( !element.hasClass('anim-running') &&
                        $.Utils.isInView(element, {topoffset: offset})) {
                        element
                            .addClass('anim-running');

                        setTimeout(function() {
                            element
                                .addClass('anim-done')
                                .animo( { animation: animation, duration: 0.7} );
                        }, delay);

                    }
                }

                // Run click triggered animations
                $elem.on('click', function() {

                    var $elem     = $(this),
                        targetSel = $elem.data('target'),
                        animation = $elem.data('play') || 'bounce',
                        target    = $(targetSel);

                    if(target && target) {
                        target.animo( { animation: animation } );
                    }

                });
            }
        };

    })
    .directive('markdownarea', function() {
        'use strict';
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var area         = $(element),
                    Markdownarea = $.fn["markdownarea"],
                    options      = $.Utils.options(attrs.markdownarea);

                var obj = new Markdownarea(area, $.Utils.options(attrs.markdownarea));

            }
        };
    })
.directive('href', function() {

        return {
            restrict: 'A',
            compile: function(element, attr) {
                return function(scope, element) {
                    if(attr.ngClick || attr.href === '' || attr.href === '#'){
                        element.on('click', function(e){
                            e.preventDefault();
                            e.stopPropagation();
                        });
                    }
                };
            }
        };
    })
.directive('cgcCuston', function() {
    return {
        require:'ngModel',
        link: function (scope,elem, attrs, ctrl) {
            elem.on('keyup focus', function (event) {
                var value=elem.val();
                var tamanho=value.length;
                var numeroCGC='';
                var novo='';





                // console.log('Valor '+value);
                if(value.length == 0 || value == undefined){
                    elem.val('___.___.___-__');
                }else if(event.keyCode !=8 &&
                    event.keyCode !=37 &&
                    event.keyCode !=39 &&
                    event.keyCode !=38 &&
                    event.keyCode !=40 &&
                    event.keyCode !=17 &&
                    event.keyCode !=18 &&
                    event.keyCode !=91 &&
                    event.keyCode !=16 &&
                    event.keyCode !=46 &&
                    event.keyCode !=27 &&
                    event.keyCode !=99 &&
                    value.length > 0) {


                    for (var i = 0; i < tamanho; i++) {
                        var c = '';
                        c = value.slice(i, i + 1);
                        if (isNaN(c) == false) {
                            //console.log('é numero  pos : '+i+ " letra : "+c);
                            numeroCGC += c;

                        } else {
                            //console.log('não é numero  pos : '+i+ " letra : "+c);
                        }
                    }

                    //console.log('aqui '+numeroCGC+' Tamnha:'+numeroCGC.length);


                    if (numeroCGC.length == 1) {
                        novo = numeroCGC.slice(0, 1) + '__.___.___-__';
                    } else if (numeroCGC.length == 2) {
                        novo = numeroCGC.slice(0, 2) + '_.___.___-__';
                    } else if (numeroCGC.length == 3) {
                        novo = numeroCGC.slice(0, 3) + '.___.___-__';
                    } else if (numeroCGC.length == 4) {
                        novo = numeroCGC.slice(0, 3) + '.' + numeroCGC.slice(3, 4) + '__.___-__';
                    } else if (numeroCGC.length == 5) {
                        novo = numeroCGC.slice(0, 3) + '.' + numeroCGC.slice(3, 5) + '_.___-__';
                    } else if (numeroCGC.length == 6) {
                        novo = numeroCGC.slice(0, 3) + '.' + numeroCGC.slice(3, 6) + '.___-__';
                    } else if (numeroCGC.length == 7) {
                        novo = numeroCGC.slice(0, 3) + '.' + numeroCGC.slice(3, 6) + '.' + numeroCGC.slice(6, 7) + '__-__';
                    } else if (numeroCGC.length == 8) {
                        novo = numeroCGC.slice(0, 3) + '.' + numeroCGC.slice(3, 6) + '.' + numeroCGC.slice(6, 8) + '_-__';
                    } else if (numeroCGC.length == 9) {
                        novo = numeroCGC.slice(0, 3) + '.' + numeroCGC.slice(3, 6) + '.' + numeroCGC.slice(6, 9) + '-__';
                    } else if (numeroCGC.length == 10) {
                        novo = numeroCGC.slice(0, 3) + '.' + numeroCGC.slice(3, 6) + '.' + numeroCGC.slice(6, 9) + '-' + numeroCGC.slice(9, 10) + '_';
                    } else if (numeroCGC.length == 11) {
                        novo = numeroCGC.slice(0, 3) + '.' + numeroCGC.slice(3, 6) + '.' + numeroCGC.slice(6, 9) + '-' + numeroCGC.slice(9, 11);
                    } else if (numeroCGC.length == 12) {
                        //console.log('13');
                        novo = numeroCGC.slice(0, 2) + '.' + numeroCGC.slice(2, 5) + '.' + numeroCGC.slice(5, 8) + '/' + numeroCGC.slice(8) + '-__';
                    } else if (numeroCGC.length == 13) {
                        //console.log('13 : '+numeroCGC);
                        novo = numeroCGC.slice(0, 2) + '.' + numeroCGC.slice(2, 5) + '.' + numeroCGC.slice(5, 8) + '/' + numeroCGC.slice(8, 12) + '-' + numeroCGC.slice(12, 13) + '_';
                    } else if (numeroCGC.length == 14) {
                        // console.log('13 : '+numeroCGC);
                        novo = numeroCGC.slice(0, 2) + '.' + numeroCGC.slice(2, 5) + '.' + numeroCGC.slice(5, 8) + '/' + numeroCGC.slice(8, 12) + '-' + numeroCGC.slice(12,14);
                    } else if (numeroCGC.length > 14) {
                        // console.log('13 : '+numeroCGC);
                        novo = numeroCGC.slice(0, 2) + '.' + numeroCGC.slice(2, 5) + '.' + numeroCGC.slice(5, 8) + '/' + numeroCGC.slice(8, 12) + '-' + numeroCGC.slice(12, 14);
                    }
                    elem.val(novo);
                }


                // console.log('Novo '+novo);


            });
            /*
             elem.on('blur', function () {
             var value=elem.val();
             console.log('valor '+value);
             if(value.indexOf('://')== -1){
             value="http://"+value;

             }
             });
             */
        }
    };
})
.directive('toggleFullscreen', function() {
    'use strict';

    return {
        restrict: 'A',
        link: function(scope, element, attrs) {

            element.on('click', function (e) {
                e.preventDefault();

                if (screenfull.enabled) {

                    screenfull.toggle();

                    // Switch icon indicator
                    if(screenfull.isFullscreen)
                        $(this).children('em').removeClass('fa-expand').addClass('fa-compress');
                    else
                        $(this).children('em').removeClass('fa-compress').addClass('fa-expand');

                } else {
                    $.error('Fullscreen not enabled');
                }

            });
        }
    };

})
.directive('loadCss', function() {
    'use strict';

    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.on('click', function (e) {
                if(element.is('a')) e.preventDefault();
                var uri = attrs.loadCss,
                    link;

                if(uri) {
                    link = createLink(uri);
                    if ( !link ) {
                        $.error('Error creating stylesheet link element.');
                    }
                }
                else {
                    $.error('No stylesheet location defined.');
                }

            });

        }
    };

    function createLink(uri) {
        var linkId = 'autoloaded-stylesheet',
            oldLink = $('#'+linkId).attr('id', linkId + '-old');

        $('head').append($('<link/>').attr({
            'id':   linkId,
            'rel':  'stylesheet',
            'href': uri
        }));

        if( oldLink.length ) {
            oldLink.remove();
        }

        return $('#'+linkId);
    }


})
.directive('searchOpen', ['navSearch', function(navSearch) {
    'use strict';

    return {
        restrict: 'A',
        controller: function($scope, $element) {
            $element
                .on('click', function (e) { e.stopPropagation(); })
                .on('click', navSearch.toggle);
        }
    };

}]).directive('searchDismiss', ['navSearch', function(navSearch) {
    'use strict';

    var inputSelector = '.navbar-form input[type="text"]';

    return {
        restrict: 'A',
        controller: function($scope, $element) {

            $(inputSelector)
                .on('click', function (e) { e.stopPropagation(); })
                .on('keyup', function(e) {
                    if (e.keyCode == 27) // ESC
                        navSearch.dismiss();
                });

            // click anywhere closes the search
            $(document).on('click', navSearch.dismiss);
            // dismissable options
            $element
                .on('click', function (e) { e.stopPropagation(); })
                .on('click', navSearch.dismiss);
        }
    };

}])
    .directive('notify', function($window){

        return {
            restrict: 'A',
            controller: function ($scope, $element) {

                $element.on('click', function (e) {
                    e.preventDefault();
                    notifyNow($element);
                });

            }
        };

        function notifyNow(elem) {
            var $element = $(elem),
                message = $element.data('message'),
                options = $element.data('options');

            if(!message)
                $.error('Notify: No message specified');

            $.notify(message, options || {});
        }


    })
    .directive('toggleState', ['toggleStateService', function(toggle) {
        'use strict';

        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                var $body = $('body');

                $(element)
                    .on('click', function (e) {
                        e.preventDefault();
                        var classname = attrs.toggleState;

                        if(classname) {
                            if( $body.hasClass(classname) ) {
                                $body.removeClass(classname);
                                if( ! attrs.noPersist)
                                    toggle.removeState(classname);
                            }
                            else {
                                $body.addClass(classname);
                                if( ! attrs.noPersist)
                                    toggle.addState(classname);
                            }

                        }

                    });
            }
        };

    }])
    .directive('paneltool', function(){
        var templates = {
            /* jshint multistr: true */
            collapse:"<a href='#' panel-collapse='' data-toggle='tooltip' title='Collapse Panel' ng-click='{{panelId}} = !{{panelId}}' ng-init='{{panelId}}=false'> \
                <em ng-show='{{panelId}}' class='fa fa-plus'></em> \
                <em ng-show='!{{panelId}}' class='fa fa-minus'></em> \
              </a>",
            dismiss: "<a href='#' panel-dismiss='' data-toggle='tooltip' title='Close Panel'>\
               <em class='fa fa-times'></em>\
             </a>",
            refresh: "<a href='#' panel-refresh='' data-toggle='tooltip' data-spinner='{{spinner}}' title='Refresh Panel'>\
               <em class='fa fa-refresh'></em>\
             </a>"
        };

        return {
            restrict: 'E',
            template: function( elem, attrs ){
                var temp = '';
                if(attrs.toolCollapse)
                    temp += templates.collapse.replace(/{{panelId}}/g, (elem.parent().parent().attr('id')) );
                if(attrs.toolDismiss)
                    temp += templates.dismiss;
                if(attrs.toolRefresh)
                    temp += templates.refresh.replace(/{{spinner}}/g, attrs.toolRefresh);
                return temp;
            },
            // scope: true,
            // transclude: true,
            link: function (scope, element, attrs) {
                element.addClass('pull-right');
            }
        };
    })
    /**=========================================================
     * Dismiss panels * [panel-dismiss]
     =========================================================*/
    .directive('panelDismiss', function(){
        'use strict';
        return {
            restrict: 'A',
            controller: function ($scope, $element) {
                var removeEvent   = 'panel-remove',
                    removedEvent  = 'panel-removed';

                $element.on('click', function () {

                    // find the first parent panel
                    var parent = $(this).closest('.panel');

                    if($.support.animation) {
                        parent.animo({animation: 'bounceOut'}, removeElement);
                    }
                    else removeElement();

                    function removeElement() {
                        // Trigger the event and finally remove the element
                        $.when(parent.trigger(removeEvent, [parent]))
                            .done(destroyPanel);
                    }

                    function destroyPanel() {
                        var col = parent.parent();
                        parent.remove();
                        // remove the parent if it is a row and is empty and not a sortable (portlet)
                        col
                            .trigger(removedEvent) // An event to catch when the panel has been removed from DOM
                            .filter(function() {
                                var el = $(this);
                                return (el.is('[class*="col-"]:not(.sortable)') && el.children('*').length === 0);
                            }).remove();

                    }
                });
            }
        };
    })
    /**=========================================================
     * Collapse panels * [panel-collapse]
     =========================================================*/
    .directive('panelCollapse', ['$timeout', function($timeout){
        'use strict';

        var storageKeyName = 'panelState',
            storage;

        return {
            restrict: 'A',
            // transclude: true,
            controller: function ($scope, $element) {

                // Prepare the panel to be collapsible
                var $elem   = $($element),
                    parent  = $elem.closest('.panel'), // find the first parent panel
                    panelId = parent.attr('id');

                storage = $scope.$storage;

                // Load the saved state if exists
                var currentState = loadPanelState( panelId );
                if ( typeof currentState !== undefined) {
                    $timeout(function(){
                            $scope[panelId] = currentState; },
                        10);
                }

                // bind events to switch icons
                $element.bind('click', function() {

                    savePanelState( panelId, !$scope[panelId] );

                });
            }
        };

        function savePanelState(id, state) {
            if(!id) return false;
            var data = angular.fromJson(storage[storageKeyName]);
            if(!data) { data = {}; }
            data[id] = state;
            storage[storageKeyName] = angular.toJson(data);
        }

        function loadPanelState(id) {
            if(!id) return false;
            var data = angular.fromJson(storage[storageKeyName]);
            if(data) {
                return data[id];
            }
        }

    }])
    /**=========================================================
     * Refresh panels
     * [panel-refresh] * [data-spinner="standard"]
     =========================================================*/
    .directive('panelRefresh', function(){
        'use strict';

        return {
            restrict: 'A',
            controller: function ($scope, $element) {

                var refreshEvent   = 'panel-refresh',
                    csspinnerClass = 'csspinner',
                    defaultSpinner = 'standard';

                // method to clear the spinner when done
                function removeSpinner() {
                    this.removeClass(csspinnerClass);
                }

                // catch clicks to toggle panel refresh
                $element.on('click', function () {
                    var $this   = $(this),
                        panel   = $this.parents('.panel').eq(0),
                        spinner = $this.data('spinner') || defaultSpinner
                        ;

                    // start showing the spinner
                    panel.addClass(csspinnerClass + ' ' + spinner);

                    // attach as public method
                    panel.removeSpinner = removeSpinner;

                    // Trigger the event and send the panel object
                    $this.trigger(refreshEvent, [panel]);

                });

            }
        };
    })

;