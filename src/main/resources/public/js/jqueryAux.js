function initExternalEvents(calElement){
    // Panel with the external events list
    var externalEvents = $('.external-events');

    // init the external events in the panel
    new ExternalEvent(externalEvents.children('div'));

    // External event color is danger-red by default
    var currColor = '#f6504d';
    // Color selector button
    var eventAddBtn = $('.external-event-add-btn');
    // New external event name input
    var eventNameInput = $('.external-event-name');
    // Color switchers
    var eventColorSelector = $('.external-event-color-selector .circle');

    // Trash events Droparea
    $('.external-events-trash').droppable({
        accept:       '.fc-event',
        activeClass:  'active',
        hoverClass:   'hovered',
        tolerance:    'touch',
        drop: function(event, ui) {

            // You can use this function to send an ajax request
            // to remove the event from the repository

            if(draggingEvent) {
                var eid = draggingEvent.id || draggingEvent._id;
                // Remove the event
                calElement.fullCalendar('removeEvents', eid);
                // Remove the dom element
                ui.draggable.remove();
                // clear
                draggingEvent = null;
            }
        }
    });

    eventColorSelector.click(function(e) {
        e.preventDefault();
        var $this = $(this);

        // Save color
        currColor = $this.css('background-color');
        // De-select all and select the current one
        eventColorSelector.removeClass('selected');
        $this.addClass('selected');
    });

    eventAddBtn.click(function(e) {
        e.preventDefault();

        // Get event name from input
        var val = eventNameInput.val();
        // Dont allow empty values
        if ($.trim(val) === '') return;

        // Create new event element
        var newEvent = $('<div/>').css({
            'background-color': currColor,
            'border-color':     currColor,
            'color':            '#fff'
        })
            .html(val);

        // Prepends to the external events list
        externalEvents.prepend(newEvent);
        // Initialize the new event element
        new ExternalEvent(newEvent);
        // Clear input
        eventNameInput.val('');
    });
};
function createDemoEvents() {
    // Date for the calendar events (dummy data)
    var date = new Date();
    var d = date.getDate(),
        m = date.getMonth(),
        y = date.getFullYear();

    return  [
        {
            title: 'All Day Event',
            start: new Date(y, m, 1),
            backgroundColor: '#f56954', //red 
            borderColor: '#f56954' //red
        },
        {
            title: 'Long Event',
            start: new Date(y, m, d - 5),
            end: new Date(y, m, d - 2),
            backgroundColor: '#f39c12', //yellow
            borderColor: '#f39c12' //yellow
        },
        {
            title: 'Meeting',
            start: new Date(y, m, d, 10, 30),
            allDay: false,
            backgroundColor: '#0073b7', //Blue
            borderColor: '#0073b7' //Blue
        },
        {
            title: 'Lunch',
            start: new Date(y, m, d, 12, 0),
            end: new Date(y, m, d, 14, 0),
            allDay: false,
            backgroundColor: '#00c0ef', //Info (aqua)
            borderColor: '#00c0ef' //Info (aqua)
        },
        {
            title: 'Birthday Party',
            start: new Date(y, m, d + 1, 19, 0),
            end: new Date(y, m, d + 1, 22, 30),
            allDay: false,
            backgroundColor: '#00a65a', //Success (green)
            borderColor: '#00a65a' //Success (green)
        },
        {
            title: 'Open Google',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            url: 'http://google.com/',
            backgroundColor: '#3c8dbc', //Primary (light-blue)
            borderColor: '#3c8dbc' //Primary (light-blue)
        }
    ];
};



(function($, window, document){
    'use strict';

    $(document).on('panel-refresh', '.panel.panel-demo', function(e, panel){

        // perform any action when a .panel triggers a the refresh event
        setTimeout(function(){
            // when the action is done, just remove the spinner class
            panel.removeSpinner();
        }, 3000);

    });

}(jQuery, window, document));


/**
 * Notify Addon definition as jQuery plugin
 * Adapted version to work with Bootstrap classes
 * More information http://getuikit.com/docs/addons_notify.html
 */

(function($, window, document){

    var containers = {},
        messages   = {},

        notify     =  function(options){

            if ($.type(options) == 'string') {
                options = { message: options };
            }

            if (arguments[1]) {
                options = $.extend(options, $.type(arguments[1]) == 'string' ? {status:arguments[1]} : arguments[1]);
            }

            return (new Message(options)).show();
        },
        closeAll  = function(group, instantly){
            if(group) {
                for(var id in messages) { if(group===messages[id].group) messages[id].close(instantly); }
            } else {
                for(var id in messages) { messages[id].close(instantly); }
            }
        };

    var Message = function(options){

        var $this = this;

        this.options = $.extend({}, Message.defaults, options);

        this.uuid    = "ID"+(new Date().getTime())+"RAND"+(Math.ceil(Math.random() * 100000));
        this.element = $([
            // @geedmo: alert-dismissable enables bs close icon
            '<div class="uk-notify-message alert-dismissable">',
            '<a class="close">&times;</a>',
            '<div>'+this.options.message+'</div>',
            '</div>'

        ].join('')).data("notifyMessage", this);

        // status
        if (this.options.status) {
            this.element.addClass('alert alert-'+this.options.status);
            this.currentstatus = this.options.status;
        }

        this.group = this.options.group;

        messages[this.uuid] = this;

        if(!containers[this.options.pos]) {
            containers[this.options.pos] = $('<div class="uk-notify uk-notify-'+this.options.pos+'"></div>').appendTo('body').on("click", ".uk-notify-message", function(){
                $(this).data("notifyMessage").close();
            });
        }
    };


    $.extend(Message.prototype, {

        uuid: false,
        element: false,
        timout: false,
        currentstatus: "",
        group: false,

        show: function() {

            if (this.element.is(":visible")) return;

            var $this = this;

            containers[this.options.pos].show().prepend(this.element);

            var marginbottom = parseInt(this.element.css("margin-bottom"), 10);

            this.element.css({"opacity":0, "margin-top": -1*this.element.outerHeight(), "margin-bottom":0}).animate({"opacity":1, "margin-top": 0, "margin-bottom":marginbottom}, function(){

                if ($this.options.timeout) {

                    var closefn = function(){ $this.close(); };

                    $this.timeout = setTimeout(closefn, $this.options.timeout);

                    $this.element.hover(
                        function() { clearTimeout($this.timeout); },
                        function() { $this.timeout = setTimeout(closefn, $this.options.timeout);  }
                    );
                }

            });

            return this;
        },

        close: function(instantly) {

            var $this    = this,
                finalize = function(){
                    $this.element.remove();

                    if(!containers[$this.options.pos].children().length) {
                        containers[$this.options.pos].hide();
                    }

                    delete messages[$this.uuid];
                };

            if(this.timeout) clearTimeout(this.timeout);

            if(instantly) {
                finalize();
            } else {
                this.element.animate({"opacity":0, "margin-top": -1* this.element.outerHeight(), "margin-bottom":0}, function(){
                    finalize();
                });
            }
        },

        content: function(html){

            var container = this.element.find(">div");

            if(!html) {
                return container.html();
            }

            container.html(html);

            return this;
        },

        status: function(status) {

            if(!status) {
                return this.currentstatus;
            }

            this.element.removeClass('alert alert-'+this.currentstatus).addClass('alert alert-'+status);

            this.currentstatus = status;

            return this;
        }
    });

    Message.defaults = {
        message: "",
        status: "normal",
        timeout: 5000,
        group: null,
        pos: 'top-center'
    };


    $["notify"]          = notify;
    $["notify"].message  = Message;
    $["notify"].closeAll = closeAll;

    return notify;

}(jQuery, window, document));

// Markdown plugin defintion
// Customized to work with bootstrap 
// classnames
// ----------------------------------- 

(function($, window, document) {


    $("#cpfcnpj").keydown(function () {
        try {
            $("#cpfcnpj").unmask();
        } catch (e) {
        }

        var tamanho = $("#cpfcnpj").val().length;

        if (tamanho < 11) {
            $("#cpfcnpj").mask("999.999.999-99");
        } else {
            $("#cpfcnpj").mask("99.999.999/9999-99");
        }
    });

}(jQuery, window, document));

(function($, window, document){
    'use strict';

    var Markdownarea = function(element, options){

        var $element = $(element);

        if($element.data("markdownarea")) return;

        this.element = $element;
        this.options = $.extend({}, Markdownarea.defaults, options);

        this.marked     = this.options.marked || marked;
        this.CodeMirror = this.options.CodeMirror || CodeMirror;

        this.marked.setOptions({
            gfm           : true,
            tables        : true,
            breaks        : true,
            pedantic      : true,
            sanitize      : false,
            smartLists    : true,
            smartypants   : false,
            langPrefix    : 'lang-'
        });

        this.init();

        this.element.data("markdownarea", this);
    };

    $.extend(Markdownarea.prototype, {

        init: function(){

            var $this = this, tpl = Markdownarea.template;

            tpl = tpl.replace(/\{\:lblPreview\}/g, this.options.lblPreview);
            tpl = tpl.replace(/\{\:lblCodeview\}/g, this.options.lblCodeview);

            this.markdownarea = $(tpl);
            this.content      = this.markdownarea.find(".uk-markdownarea-content");
            this.toolbar      = this.markdownarea.find(".uk-markdownarea-toolbar");
            this.preview      = this.markdownarea.find(".uk-markdownarea-preview").children().eq(0);
            this.code         = this.markdownarea.find(".uk-markdownarea-code");

            this.element.before(this.markdownarea).appendTo(this.code);

            this.editor = this.CodeMirror.fromTextArea(this.element[0], this.options.codemirror);

            this.editor.markdownarea = this;

            this.editor.on("change", (function(){
                var render = function(){

                    var value   = $this.editor.getValue();

                    $this.currentvalue  = String(value);

                    $this.element.trigger("markdownarea-before", [$this]);

                    $this.applyPlugins();

                    $this.marked($this.currentvalue, function (err, markdown) {

                        if (err) throw err;

                        $this.preview.html(markdown);
                        $this.element.val($this.editor.getValue()).trigger("markdownarea-update", [$this]);
                    });
                };
                render();
                return $.Utils.debounce(render, 150);
            })());

            this.code.find(".CodeMirror").css("height", this.options.height);

            this._buildtoolbar();
            this.fit();

            $(window).on("resize", $.Utils.debounce(function(){
                $this.fit();
            }, 200));


            var previewContainer = $this.preview.parent(),
                codeContent      = this.code.find('.CodeMirror-sizer'),
                codeScroll       = this.code.find('.CodeMirror-scroll').on('scroll',$.Utils.debounce(function() {

                    if($this.markdownarea.attr("data-mode")=="tab") return;

                    // calc position
                    var codeHeight       = codeContent.height()   - codeScroll.height(),
                        previewHeight    = previewContainer[0].scrollHeight - previewContainer.height(),
                        ratio            = previewHeight / codeHeight,
                        previewPostition = codeScroll.scrollTop() * ratio;

                    // apply new scroll
                    previewContainer.scrollTop(previewPostition);
                }, 10));

            this.markdownarea.on("click", ".uk-markdown-button-markdown, .uk-markdown-button-preview", function(e){

                e.preventDefault();

                if($this.markdownarea.attr("data-mode")=="tab") {

                    $this.markdownarea.find(".uk-markdown-button-markdown, .uk-markdown-button-preview").removeClass("uk-active").filter(this).addClass("uk-active");

                    $this.activetab = $(this).hasClass("uk-markdown-button-markdown") ? "code":"preview";
                    $this.markdownarea.attr("data-active-tab", $this.activetab);
                }
            });

            this.preview.parent().css("height", this.code.height());
        },

        applyPlugins: function(){

            var $this   = this,
                plugins = Object.keys(Markdownarea.plugins),
                plgs    = Markdownarea.plugins;

            this.markers = {};

            if(plugins.length) {

                var lines = this.currentvalue.split("\n");

                plugins.forEach(function(name){
                    this.markers[name] = [];
                }, this);

                for(var line=0,max=lines.length;line<max;line++) {

                    (function(line){
                        plugins.forEach(function(name){

                            var i = 0;

                            lines[line] = lines[line].replace(plgs[name].identifier, function(){

                                var replacement =  plgs[name].cb({
                                    "area" : $this,
                                    "found": arguments,
                                    "line" : line,
                                    "pos"  : i++,
                                    "uid"  : [name, line, i, (new Date().getTime())+"RAND"+(Math.ceil(Math.random() *100000))].join('-'),
                                    "replace": function(strwith){
                                        var src   = this.area.editor.getLine(this.line),
                                            start = src.indexOf(this.found[0]),
                                            end   = start + this.found[0].length;

                                        this.area.editor.replaceRange(strwith, {"line": this.line, "ch":start}, {"line": this.line, "ch":end} );
                                    }
                                });

                                return replacement;
                            });
                        });
                    }(line));
                }

                this.currentvalue = lines.join("\n");

            }
        },

        _buildtoolbar: function(){

            if(!(this.options.toolbar && this.options.toolbar.length)) return;

            var $this = this, bar = [];

            this.options.toolbar.forEach(function(cmd){
                if(Markdownarea.commands[cmd]) {

                    var title = Markdownarea.commands[cmd].title ? Markdownarea.commands[cmd].title : cmd;

                    bar.push('<li><a data-markdownarea-cmd="'+cmd+'" title="'+title+'" data-toggle="tooltip">'+Markdownarea.commands[cmd].label+'</a></li>');

                    if(Markdownarea.commands[cmd].shortcut) {
                        $this.registerShortcut(Markdownarea.commands[cmd].shortcut, Markdownarea.commands[cmd].action);
                    }
                }
            });

            this.toolbar.html(bar.join("\n"));

            this.markdownarea.on("click", "a[data-markdownarea-cmd]", function(){
                var cmd = $(this).data("markdownareaCmd");

                if(cmd && Markdownarea.commands[cmd] && (!$this.activetab || $this.activetab=="code" || cmd=="fullscreen")) {
                    Markdownarea.commands[cmd].action.apply($this, [$this.editor]);
                }

            });
        },

        fit: function() {

            var mode = this.options.mode;

            if(mode=="split" && this.markdownarea.width() < this.options.maxsplitsize) {
                mode = "tab";
            }

            if(mode=="tab") {

                if(!this.activetab) {
                    this.activetab = "code";
                    this.markdownarea.attr("data-active-tab", this.activetab);
                }

                this.markdownarea.find(".uk-markdown-button-markdown, .uk-markdown-button-preview").removeClass("uk-active")
                    .filter(this.activetab=="code" ? '.uk-markdown-button-markdown':'.uk-markdown-button-preview').addClass("uk-active");

            }

            this.editor.refresh();
            this.preview.parent().css("height", this.code.height());

            this.markdownarea.attr("data-mode", mode);
        },

        registerShortcut: function(combination, callback){

            var $this = this;

            combination = $.isArray(combination) ? combination : [combination];

            for(var i=0,max=combination.length;i < max;i++) {
                var map = {};

                map[combination[i]] = function(){
                    callback.apply($this, [$this.editor]);
                };

                $this.editor.addKeyMap(map);
            }
        },

        getMode: function(){
            var pos = this.editor.getDoc().getCursor();

            return this.editor.getTokenAt(pos).state.base.htmlState ? 'html':'markdown';
        }
    });

    //jQuery plugin

    $.fn.markdownarea = function(options){

        return this.each(function(){

            var ele = $(this);

            if(!ele.data("markdownarea")) {
                var obj = new Markdownarea(ele, options);
            }
        });
    };

    var baseReplacer = function(replace, editor){
        var text     = editor.getSelection(),
            markdown = replace.replace('$1', text);

        editor.replaceSelection(markdown, 'end');
    };

    Markdownarea.commands = {
        "fullscreen": {
            "title"  : 'Fullscreen',
            "label"  : '<i class="fa fa-expand"></i>',
            "action" : function(editor){

                editor.markdownarea.markdownarea.toggleClass("uk-markdownarea-fullscreen");

                // dont use uk- to avoid rules declaration
                $('html').toggleClass("markdownarea-fullscreen");
                $('html, body').scrollTop(0);

                var wrap = editor.getWrapperElement();

                if(editor.markdownarea.markdownarea.hasClass("uk-markdownarea-fullscreen")) {

                    editor.state.fullScreenRestore = {scrollTop: window.pageYOffset, scrollLeft: window.pageXOffset, width: wrap.style.width, height: wrap.style.height};
                    wrap.style.width  = "";
                    wrap.style.height = editor.markdownarea.content.height()+"px";
                    document.documentElement.style.overflow = "hidden";

                } else {

                    document.documentElement.style.overflow = "";
                    var info = editor.state.fullScreenRestore;
                    wrap.style.width = info.width; wrap.style.height = info.height;
                    window.scrollTo(info.scrollLeft, info.scrollTop);
                }

                editor.refresh();
                editor.markdownarea.preview.parent().css("height", editor.markdownarea.code.height());
            }
        },

        "bold" : {
            "title"  : "Bold",
            "label"  : '<i class="fa fa-bold"></i>',
            "shortcut": ['Ctrl-B', 'Cmd-B'],
            "action" : function(editor){
                baseReplacer(this.getMode() == 'html' ? "<strong>$1</strong>":"**$1**", editor);
            }
        },
        "italic" : {
            "title"  : "Italic",
            "label"  : '<i class="fa fa-italic"></i>',
            "action" : function(editor){
                baseReplacer(this.getMode() == 'html' ? "<em>$1</em>":"*$1*", editor);
            }
        },
        "strike" : {
            "title"  : "Strikethrough",
            "label"  : '<i class="fa fa-strikethrough"></i>',
            "action" : function(editor){
                baseReplacer(this.getMode() == 'html' ? "<del>$1</del>":"~~$1~~", editor);
            }
        },
        "blockquote" : {
            "title"  : "Blockquote",
            "label"  : '<i class="fa fa-quote-right"></i>',
            "action" : function(editor){
                baseReplacer(this.getMode() == 'html' ? "<blockquote><p>$1</p></blockquote>":"> $1", editor);
            }
        },
        "link" : {
            "title"  : "Link",
            "label"  : '<i class="fa fa-link"></i>',
            "action" : function(editor){
                baseReplacer(this.getMode() == 'html' ? '<a href="http://">$1</a>':"[$1](http://)", editor);
            }
        },
        "picture" : {
            "title"  : "Picture",
            "label"  : '<i class="fa fa-picture-o"></i>',
            "action" : function(editor){
                baseReplacer(this.getMode() == 'html' ? '<img src="http://" alt="$1">':"![$1](http://)", editor);
            }
        },
        "listUl" : {
            "title"  : "Unordered List",
            "label"  : '<i class="fa fa-list-ul"></i>',
            "action" : function(editor){
                if(this.getMode() == 'markdown') baseReplacer("* $1", editor);
            }
        },
        "listOl" : {
            "title"  : "Ordered List",
            "label"  : '<i class="fa fa-list-ol"></i>',
            "action" : function(editor){
                if(this.getMode() == 'markdown') baseReplacer("1. $1", editor);
            }
        }
    };

    Markdownarea.defaults = {
        "mode"         : "split",
        "height"       : 500,
        "maxsplitsize" : 1000,
        "codemirror"   : { mode: 'gfm', tabMode: 'indent', tabindex: "2", lineWrapping: true, dragDrop: false, autoCloseTags: true, matchTags: true },
        "toolbar"      : [ "bold", "italic", "strike", "link", "picture", "blockquote", "listUl", "listOl" ],
        "lblPreview"   : "Preview",
        "lblCodeview"  : "Markdown"
    };

    Markdownarea.template = '<div class="uk-markdownarea uk-clearfix" data-mode="split">' +
        '<div class="uk-markdownarea-navbar">' +
        '<ul class="uk-markdownarea-navbar-nav uk-markdownarea-toolbar"></ul>' +
        '<div class="uk-markdownarea-navbar-flip">' +
        '<ul class="uk-markdownarea-navbar-nav">' +
        '<li class="uk-markdown-button-markdown"><a>{:lblCodeview}</a></li>' +
        '<li class="uk-markdown-button-preview"><a>{:lblPreview}</a></li>' +
        '<li><a data-markdownarea-cmd="fullscreen" data-toggle="tooltip" title="Zen Mode"><i class="fa fa-expand"></i></a></li>' +
        '</ul>' +
        '</div>' +
        '</div>' +
        '<div class="uk-markdownarea-content">' +
        '<div class="uk-markdownarea-code"></div>' +
        '<div class="uk-markdownarea-preview"><div></div></div>' +
        '</div>' +
        '</div>';

    Markdownarea.plugins   = {};
    Markdownarea.addPlugin = function(name, identifier, callback) {
        Markdownarea.plugins[name] = {"identifier":identifier, "cb":callback};
    };

    $.fn["markdownarea"] = Markdownarea;

    // init code
    $(function() {

        $("textarea[data-uk-markdownarea]").each(function() {
            var area = $(this), obj;

            if (!area.data("markdownarea")) {
                obj = new Markdownarea(area, $.Utils.options(area.attr("data-uk-markdownarea")));
            }
        });
    });

    return Markdownarea;

}(jQuery, window, document));
/**=========================================================
 * Module: utils.js
 * jQuery Utility functions library
 * adapted from the core of UIKit
 =========================================================*/

(function($, window, doc){
    'use strict';

    var $html = $("html"), $win = $(window);

    $.support.transition = (function() {

        var transitionEnd = (function() {

            var element = doc.body || doc.documentElement,
                transEndEventNames = {
                    WebkitTransition: 'webkitTransitionEnd',
                    MozTransition: 'transitionend',
                    OTransition: 'oTransitionEnd otransitionend',
                    transition: 'transitionend'
                }, name;

            for (name in transEndEventNames) {
                if (element.style[name] !== undefined) return transEndEventNames[name];
            }
        }());

        return transitionEnd && { end: transitionEnd };
    })();

    $.support.animation = (function() {

        var animationEnd = (function() {

            var element = doc.body || doc.documentElement,
                animEndEventNames = {
                    WebkitAnimation: 'webkitAnimationEnd',
                    MozAnimation: 'animationend',
                    OAnimation: 'oAnimationEnd oanimationend',
                    animation: 'animationend'
                }, name;

            for (name in animEndEventNames) {
                if (element.style[name] !== undefined) return animEndEventNames[name];
            }
        }());

        return animationEnd && { end: animationEnd };
    })();

    $.support.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback){ window.setTimeout(callback, 1000/60); };
    $.support.touch                 = (
        ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
        (window.DocumentTouch && document instanceof window.DocumentTouch)  ||
        (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
        (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
        false
    );
    $.support.mutationobserver      = (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null);

    $.Utils = {};

    $.Utils.debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    $.Utils.removeCssRules = function(selectorRegEx) {
        var idx, idxs, stylesheet, _i, _j, _k, _len, _len1, _len2, _ref;

        if(!selectorRegEx) return;

        setTimeout(function(){
            try {
                _ref = document.styleSheets;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    stylesheet = _ref[_i];
                    idxs = [];
                    stylesheet.cssRules = stylesheet.cssRules;
                    for (idx = _j = 0, _len1 = stylesheet.cssRules.length; _j < _len1; idx = ++_j) {
                        if (stylesheet.cssRules[idx].type === CSSRule.STYLE_RULE && selectorRegEx.test(stylesheet.cssRules[idx].selectorText)) {
                            idxs.unshift(idx);
                        }
                    }
                    for (_k = 0, _len2 = idxs.length; _k < _len2; _k++) {
                        stylesheet.deleteRule(idxs[_k]);
                    }
                }
            } catch (_error) {}
        }, 0);
    };

    $.Utils.isInView = function(element, options) {

        var $element = $(element);

        if (!$element.is(':visible')) {
            return false;
        }

        var window_left = $win.scrollLeft(),
            window_top  = $win.scrollTop(),
            offset      = $element.offset(),
            left        = offset.left,
            top         = offset.top;

        options = $.extend({topoffset:0, leftoffset:0}, options);

        if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
            left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
            return true;
        } else {
            return false;
        }
    };

    $.Utils.options = function(string) {

        if ($.isPlainObject(string)) return string;

        var start = (string ? string.indexOf("{") : -1), options = {};

        if (start != -1) {
            try {
                options = (new Function("", "var json = " + string.substr(start) + "; return JSON.parse(JSON.stringify(json));"))();
            } catch (e) {}
        }

        return options;
    };

    $.Utils.events       = {};
    $.Utils.events.click = $.support.touch ? 'tap' : 'click';

    $.langdirection = $html.attr("dir") == "rtl" ? "right" : "left";

    $(function(){

        // Check for dom modifications
        if(!$.support.mutationobserver) return;

        // Install an observer for custom needs of dom changes
        var observer = new $.support.mutationobserver($.Utils.debounce(function(mutations) {
            $(doc).trigger("domready");
        }, 300));

        // pass in the target node, as well as the observer options
        observer.observe(document.body, { childList: true, subtree: true });

    });

    // add touch identifier class
    $html.addClass($.support.touch ? "touch" : "no-touch");

}(jQuery, window, document));



/**=========================================================
 * correcao de bug do typehead
 =========================================================*/
angular.module("template/typeahead/typeahead-popup.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/typeahead/typeahead-popup.html",
        "<ul class=\"dropdown-menu\" ng-show=\"isOpen()\" ng-style=\"{top: position.top+'px', left: position.left+'px'}\" style=\"display: block;\" role=\"listbox\" aria-hidden=\"{{!isOpen()}}\">\n" +
        "    <li ng-repeat=\"match in matches track by $index\" ng-class=\"{active: isActive($index) }\" ng-mouseenter=\"selectActive($index)\" ng-click=\"selectMatch($index)\" role=\"option\" id=\"{{match.id}}\">\n" +
        "        <div typeahead-match index=\"$index\" match=\"match\" query=\"query\" template-url=\"templateUrl\"></div>\n" +
        "    </li>\n" +
        "</ul>");
}]);

