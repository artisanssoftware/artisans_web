(function() {
    var MutationObserver, Util, WeakMap,
        __bind = function(fn, me) {
            return function() {
                return fn.apply(me, arguments);
            };
        },
        __indexOf = [].indexOf || function(item) {
            for (var i = 0, l = this.length; i < l; i++) {
                if (i in this && this[i] === item) return i;
            }
            return -1;
        };

    Util = (function() {
        function Util() {}

        Util.prototype.extend = function(custom, defaults) {
            var key, value;
            for (key in defaults) {
                value = defaults[key];
                if (custom[key] == null) {
                    custom[key] = value;
                }
            }
            return custom;
        };

        Util.prototype.isMobile = function(agent) {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
        };

        return Util;

    })();

    WeakMap = this.WeakMap || this.MozWeakMap || (WeakMap = (function() {
        function WeakMap() {
            this.keys = [];
            this.values = [];
        }

        WeakMap.prototype.get = function(key) {
            var i, item, _i, _len, _ref;
            _ref = this.keys;
            for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
                item = _ref[i];
                if (item === key) {
                    return this.values[i];
                }
            }
        };

        WeakMap.prototype.set = function(key, value) {
            var i, item, _i, _len, _ref;
            _ref = this.keys;
            for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
                item = _ref[i];
                if (item === key) {
                    this.values[i] = value;
                    return;
                }
            }
            this.keys.push(key);
            return this.values.push(value);
        };

        return WeakMap;

    })());

    MutationObserver = this.MutationObserver || this.WebkitMutationObserver || this.MozMutationObserver || (MutationObserver = (function() {
        function MutationObserver() {
            console.warn('MutationObserver is not supported by your browser.');
            console.warn('WOW.js cannot detect dom mutations, please call .sync() after loading new content.');
        }

        MutationObserver.notSupported = true;

        MutationObserver.prototype.observe = function() {};

        return MutationObserver;

    })());

    this.WOW = (function() {
        WOW.prototype.defaults = {
            boxClass: 'wow',
            animateClass: 'animated',
            offset: 0,
            mobile: true,
            live: true
        };

        function WOW(options) {
            if (options == null) {
                options = {};
            }
            this.scrollCallback = __bind(this.scrollCallback, this);
            this.scrollHandler = __bind(this.scrollHandler, this);
            this.start = __bind(this.start, this);
            this.scrolled = true;
            this.config = this.util().extend(options, this.defaults);
            this.animationNameCache = new WeakMap();
        }

        WOW.prototype.init = function() {
            var _ref;
            this.element = window.document.documentElement;
            if ((_ref = document.readyState) === "interactive" || _ref === "complete") {
                this.start();
            } else {
                document.addEventListener('DOMContentLoaded', this.start);
            }
            return this.finished = [];
        };

        WOW.prototype.start = function() {
            var box, _i, _len, _ref;
            this.stopped = false;
            this.boxes = (function() {
                var _i, _len, _ref, _results;
                _ref = this.element.getElementsByClassName(this.config.boxClass);
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    box = _ref[_i];
                    _results.push(box);
                }
                return _results;
            }).call(this);
            this.all = (function() {
                var _i, _len, _ref, _results;
                _ref = this.boxes;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    box = _ref[_i];
                    _results.push(box);
                }
                return _results;
            }).call(this);
            if (this.boxes.length) {
                if (this.disabled()) {
                    this.resetStyle();
                } else {
                    _ref = this.boxes;
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        box = _ref[_i];
                        this.applyStyle(box, true);
                    }
                    window.addEventListener('scroll', this.scrollHandler, false);
                    window.addEventListener('resize', this.scrollHandler, false);
                    this.interval = setInterval(this.scrollCallback, 50);
                }
            }
            if (this.config.live) {
                return new MutationObserver((function(_this) {
                    return function(records) {
                        var node, record, _j, _len1, _results;
                        _results = [];
                        for (_j = 0, _len1 = records.length; _j < _len1; _j++) {
                            record = records[_j];
                            _results.push((function() {
                                var _k, _len2, _ref1, _results1;
                                _ref1 = record.addedNodes || [];
                                _results1 = [];
                                for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
                                    node = _ref1[_k];
                                    _results1.push(this.doSync(node));
                                }
                                return _results1;
                            }).call(_this));
                        }
                        return _results;
                    };
                })(this)).observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        };

        WOW.prototype.stop = function() {
            this.stopped = true;
            window.removeEventListener('scroll', this.scrollHandler, false);
            window.removeEventListener('resize', this.scrollHandler, false);
            if (this.interval != null) {
                return clearInterval(this.interval);
            }
        };

        WOW.prototype.sync = function(element) {
            if (MutationObserver.notSupported) {
                return this.doSync(this.element);
            }
        };

        WOW.prototype.doSync = function(element) {
            var box, _i, _len, _ref, _results;
            if (!this.stopped) {
                if (element == null) {
                    element = this.element;
                }
                if (element.nodeType !== 1) {
                    return;
                }
                element = element.parentNode || element;
                _ref = element.getElementsByClassName(this.config.boxClass);
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    box = _ref[_i];
                    if (__indexOf.call(this.all, box) < 0) {
                        this.applyStyle(box, true);
                        this.boxes.push(box);
                        this.all.push(box);
                        _results.push(this.scrolled = true);
                    } else {
                        _results.push(void 0);
                    }
                }
                return _results;
            }
        };

        WOW.prototype.show = function(box) {
            this.applyStyle(box);
            return box.className = "" + box.className + " " + this.config.animateClass;
        };

        WOW.prototype.applyStyle = function(box, hidden) {
            var delay, duration, iteration;
            duration = box.getAttribute('data-wow-duration');
            delay = box.getAttribute('data-wow-delay');
            iteration = box.getAttribute('data-wow-iteration');
            return this.animate((function(_this) {
                return function() {
                    return _this.customStyle(box, hidden, duration, delay, iteration);
                };
            })(this));
        };

        WOW.prototype.animate = (function() {
            if ('requestAnimationFrame' in window) {
                return function(callback) {
                    return window.requestAnimationFrame(callback);
                };
            } else {
                return function(callback) {
                    return callback();
                };
            }
        })();

        WOW.prototype.resetStyle = function() {
            var box, _i, _len, _ref, _results;
            _ref = this.boxes;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                box = _ref[_i];
                _results.push(box.setAttribute('style', 'visibility: visible;'));
            }
            return _results;
        };

        WOW.prototype.customStyle = function(box, hidden, duration, delay, iteration) {
            if (hidden) {
                this.cacheAnimationName(box);
            }
            box.style.visibility = hidden ? 'hidden' : 'visible';
            if (duration) {
                this.vendorSet(box.style, {
                    animationDuration: duration
                });
            }
            if (delay) {
                this.vendorSet(box.style, {
                    animationDelay: delay
                });
            }
            if (iteration) {
                this.vendorSet(box.style, {
                    animationIterationCount: iteration
                });
            }
            this.vendorSet(box.style, {
                animationName: hidden ? 'none' : this.cachedAnimationName(box)
            });
            return box;
        };

        WOW.prototype.vendors = ["moz", "webkit"];

        WOW.prototype.vendorSet = function(elem, properties) {
            var name, value, vendor, _results;
            _results = [];
            for (name in properties) {
                value = properties[name];
                elem["" + name] = value;
                _results.push((function() {
                    var _i, _len, _ref, _results1;
                    _ref = this.vendors;
                    _results1 = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        vendor = _ref[_i];
                        _results1.push(elem["" + vendor + (name.charAt(0).toUpperCase()) + (name.substr(1))] = value);
                    }
                    return _results1;
                }).call(this));
            }
            return _results;
        };

        WOW.prototype.vendorCSS = function(elem, property) {
            var result, style, vendor, _i, _len, _ref;
            style = window.getComputedStyle(elem);
            result = style.getPropertyCSSValue(property);
            _ref = this.vendors;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                vendor = _ref[_i];
                result = result || style.getPropertyCSSValue("-" + vendor + "-" + property);
            }
            return result;
        };

        WOW.prototype.animationName = function(box) {
            var animationName;
            try {
                animationName = this.vendorCSS(box, 'animation-name').cssText;
            } catch (_error) {
                animationName = window.getComputedStyle(box).getPropertyValue('animation-name');
            }
            if (animationName === 'none') {
                return '';
            } else {
                return animationName;
            }
        };

        WOW.prototype.cacheAnimationName = function(box) {
            return this.animationNameCache.set(box, this.animationName(box));
        };

        WOW.prototype.cachedAnimationName = function(box) {
            return this.animationNameCache.get(box);
        };

        WOW.prototype.scrollHandler = function() {
            return this.scrolled = true;
        };

        WOW.prototype.scrollCallback = function() {
            var box;
            if (this.scrolled) {
                this.scrolled = false;
                this.boxes = (function() {
                    var _i, _len, _ref, _results;
                    _ref = this.boxes;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        box = _ref[_i];
                        if (!(box)) {
                            continue;
                        }
                        if (this.isVisible(box)) {
                            this.show(box);
                            continue;
                        }
                        _results.push(box);
                    }
                    return _results;
                }).call(this);
                if (!(this.boxes.length || this.config.live)) {
                    return this.stop();
                }
            }
        };

        WOW.prototype.offsetTop = function(element) {
            var top;
            while (element.offsetTop === void 0) {
                element = element.parentNode;
            }
            top = element.offsetTop;
            while (element = element.offsetParent) {
                top += element.offsetTop;
            }
            return top;
        };

        WOW.prototype.isVisible = function(box) {
            var bottom, offset, top, viewBottom, viewTop;
            offset = box.getAttribute('data-wow-offset') || this.config.offset;
            viewTop = window.pageYOffset;
            viewBottom = viewTop + Math.min(this.element.clientHeight, innerHeight) - offset;
            top = this.offsetTop(box);
            bottom = top + box.clientHeight;
            return top <= viewBottom && bottom >= viewTop;
        };

        WOW.prototype.util = function() {
            return this._util != null ? this._util : this._util = new Util();
        };

        WOW.prototype.disabled = function() {
            return !this.config.mobile && this.util().isMobile(navigator.userAgent);
        };

        return WOW;

    })();

}).call(this);

(function() {

    "use strict";

    // Methods/polyfills.

    // classList | (c) @remy | github.com/remy/polyfills | rem.mit-license.org
    ! function() {
        function t(t) {
            this.el = t;
            for (var n = t.className.replace(/^\s+|\s+$/g, "").split(/\s+/), i = 0; i < n.length; i++) e.call(this, n[i])
        }

        function n(t, n, i) {
            Object.defineProperty ? Object.defineProperty(t, n, {
                get: i
            }) : t.__defineGetter__(n, i)
        }
        if (!("undefined" == typeof window.Element || "classList" in document.documentElement)) {
            var i = Array.prototype,
                e = i.push,
                s = i.splice,
                o = i.join;
            t.prototype = {
                add: function(t) {
                    this.contains(t) || (e.call(this, t), this.el.className = this.toString())
                },
                contains: function(t) {
                    return -1 != this.el.className.indexOf(t)
                },
                item: function(t) {
                    return this[t] || null
                },
                remove: function(t) {
                    if (this.contains(t)) {
                        for (var n = 0; n < this.length && this[n] != t; n++);
                        s.call(this, n, 1), this.el.className = this.toString()
                    }
                },
                toString: function() {
                    return o.call(this, " ")
                },
                toggle: function(t) {
                    return this.contains(t) ? this.remove(t) : this.add(t), this.contains(t)
                }
            }, window.DOMTokenList = t, n(Element.prototype, "classList", function() {
                return new t(this)
            })
        }
    }();

    // canUse
    window.canUse = function(p) {
        if (!window._canUse) window._canUse = document.createElement("div");
        var e = window._canUse.style,
            up = p.charAt(0).toUpperCase() + p.slice(1);
        return p in e || "Moz" + up in e || "Webkit" + up in e || "O" + up in e || "ms" + up in e
    };

    // window.addEventListener
    (function() {
        if ("addEventListener" in window) return;
        window.addEventListener = function(type, f) {
            window.attachEvent("on" + type, f)
        }
    })();

    var $body = document.querySelector('.header');

    // Slideshow Background.
    (function() {
        try {
            // Vars.
            var pos = 0,
                lastPos = 0,
                $wrapper, $bgs = [],
                $bg,
                k, v;

            // Create BG wrapper, BGs.
            $wrapper = document.createElement('div');
            $wrapper.id = 'bg';
            $body.appendChild($wrapper);

            for (k in settings.images) {
                // Create BG.
                $bg = document.createElement('div');
                $bg.style.backgroundImage = 'url("' + settings.images[k].valor + '")';
                $bg.style.backgroundPosition = 'center';
                $wrapper.appendChild($bg);

                // Add it to array.
                $bgs.push($bg);

            }

            // Main loop.
            $bgs[pos].classList.add('visible');
            $bgs[pos].classList.add('top');

            if ($bgs.length == 1 ||
                !canUse('transition'))
                return;

            var i = 0;

            window.setInterval(function() {

                lastPos = pos;
                pos++;

                // Wrap to beginning if necessary.
                if (pos >= $bgs.length)
                    pos = 0;

                // Swap top images.
                $bgs[lastPos].classList.remove('top');
                $bgs[pos].classList.add('visible');
                $bgs[pos].classList.add('top');

                // Hide last image after a short delay.
                window.setTimeout(function() {
                    $bgs[lastPos].classList.remove('visible');

                }, settings.delay / 2);

            }, settings.delay);

            setInterval(function() {
                $('#dinamicText').fadeOut(1000, function() {
                    $(this).text(settings.text[i].valor);
                }).fadeIn(500);

                (i >= settings.text.length - 1) ? i = 0: i++;
            }, 8000);

        } catch (e) {
            console.warn(e);
        }

    })();

})();

function preLoad(route) {
    layer1 = document.querySelector('.loader');
    layer2 = document.createElement('div');
    layer1.appendChild(layer2);
    layer2Gif = document.createElement('img');
    layer2Gif.className = 'bx_loader';
    layer2Gif.src = route + 'css/images/bx_loader.gif';
    layer2.appendChild(layer2Gif);
}

function getPath() {
    var path = null;

    try {
        path = location.href.replace(location.hostname, '').replace('http://', '').replace('/artesanos/', '').replace('/', '');
    } catch (e) {
        console.warn(e);
    }

    return path;
}

function moveUs() {
    try {
        if (getPath().selector == 'index.php')
            location.href = 'error/';

        $('html, body').stop().animate({
            scrollTop: $('#' + getPath()).offset().top
        }, 500);

        if (getPath() == 'home')
            writeText(document.querySelector('#dinamicTextDesc strong'), 80);
    } catch (e) {
        console.warn(e);
    }
}

function goIt(el, l) {
    try {
        if (l != '' || (el.getAttribute('data-refresh') != null && el.getAttribute('data-refresh') == 'true')) {
            location.href = l + el.getAttribute('data-href');
        } else {
            history.pushState(null, null, el.getAttribute('data-href'));
        }
        return moveUs();
    } catch (e) {
        console.warn(e);
    }
}

function ligboxForm() {
    $('.ligbox-form').show('slide');
}

function ligboxFormHide() {
    $('.ligbox-form').hide('slide', {
        direction: 'right'
    });
}

/*-------------------------------START BLOCKING ACTIONS--------------------------------

document.oncontextmenu = function(){
  return false
};

document.onselectstart=function(){
  return false;
};

document.ondragstart=function(){
  return false;
};

if (window.sidebar){
  document.onmousedown=function(e){
    return false;
  };
}
/*-------------------------------END BLOCKING ACTIONS--------------------------------*/

/*-------------------------------START SCRIPT TWITTER--------------------------------*/
! function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
        p = /^http:/.test(d.location) ? 'http' : 'https';
    if (!d.getElementById(id)) {
        js = d.createElement(s);
        js.id = id;
        js.src = p + '://platform.twitter.com/widgets.js';
        fjs.parentNode.insertBefore(js, fjs);
    }
}(document, 'script', 'twitter-wjs');
/*-------------------------------START SCRIPT TWITTER--------------------------------*/

/*-------------------------------START SCRIPT ANALYTICS GOOGLE--------------------------------*/
(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
ga('create', 'UA-11991680-4', 'ianlunn.github.io');
ga('send', 'pageview');
/*-------------------------------START SCRIPT ANALYTICS GOOGLE--------------------------------*/

/*-------------------------------START SCRIPT TO GET CALL--------------------------------*/
(function(v, p) {
    var s = document.createElement('script');
    s.src = 'https://app.toky.co/resources/widgets/toky-widget.js?v=' + v;
    s.onload = function() {
        Toky.load(p);
    };
    document.head.appendChild(s);
})('a4b7219e', {
    "$username": "ArtesanosSoftwa",
    "$bubble": true,
    "$position": "left",
    "$text": "Llámanos Gratis",
    "$color": "green"
})
/*-------------------------------END SCRIPT TO GET CALL--------------------------------*/

/*-------------------------------START SCRIPT TO GET TALK BY CHAT--------------------------------*/
var _smartsupp = _smartsupp || {};
_smartsupp.key = '0f7b940c4125924b117137385c2cdbf6e7ef76e4';
window.smartsupp || (function(d) {
    var s, c, o = smartsupp = function() {
        o._.push(arguments);
    };
    o._ = [];
    s = d.getElementsByTagName('script')[0];
    c = d.createElement('script');
    c.type = 'text/javascript';
    c.charset = 'utf-8';
    c.async = true;
    c.src = 'https://www.smartsuppchat.com/loader.js?';
    s.parentNode.insertBefore(c, s);
})(document);
/*-------------------------------END SCRIPT TO GET TALK BY CHAT--------------------------------*/
artisanSoft = {
    timeoutall: 0,
    _interval: null,
    timeout: 10000,
    count: 0,
    el: [],
    generalFeatures: [],
    movePKinterval: null,
    movePKtimeout: 5000,
    movePKsum: 0,
    movePKi: 0,
    movePKcount: 0,
    movePKstop: false,
    timeChange: 200,
    direction: ["200%", "-200%", "auto"],
    debchange: false,
    movePK: function() {
        artisanSoft.movePKcount = $(elements[10]).find('> ol').find('> li').length - 1;
        this.movePKinterval = setInterval(function() {
            $(elements[10]).find('> ol').animate({
                marginLeft: artisanSoft.movePKi++ >= artisanSoft.movePKcount ? ((artisanSoft.movePKsum = 0) + (artisanSoft.movePKi = 0)) : artisanSoft.movePKsum -= $(elements[10]).width() + 4
            }, 1000, 'easeInOutExpo');
        }, this.movePKtimeout);
    },

    create: function(el) {
        return document.createElement(el);
    },

    hideHall: function(f) {
        try {
            $(elements[7]).find('> p').find('span').each(function(_i, el) {
                setTimeout(function() {
                    $(el).css({
                        transition: artisanSoft.el[artisanSoft.count][_i][10],
                        transform: artisanSoft.el[artisanSoft.count][_i][12]
                    });
                    setTimeout(function() {
                        $(el).css({
                            transition: 'none'
                        }).animate({
                            top: artisanSoft.el[artisanSoft.count][_i][0].split(',')[0] + '%',
                            left: artisanSoft.el[artisanSoft.count][_i][1].split(',')[0] + '%',
                            right: artisanSoft.el[artisanSoft.count][_i][2].split(',')[0] + '%',
                            bottom: artisanSoft.el[artisanSoft.count][_i][3].split(',')[0] + '%',
                            opacity: artisanSoft.el[artisanSoft.count][_i][5],
                        }, artisanSoft.el[artisanSoft.count][_i][9], 'easeInOutBack');
                    }, artisanSoft.el[artisanSoft.count][_i][6]);
                }, artisanSoft.el[artisanSoft.count][_i][7]);
            });

            t = artisanSoft.direction[Math.floor(Math.random() * (artisanSoft.direction.length - 0)) + 0];
            b = t == 'auto' ? artisanSoft.direction[Math.floor(Math.random() * (artisanSoft.direction.length - 0)) + 0] : 'auto';
            t = b == 'auto' ? artisanSoft.direction[Math.floor(Math.random() * (artisanSoft.direction.length - 0)) + 0] : 'auto';
            b = t == 'auto' ? artisanSoft.direction[Math.floor(Math.random() * (artisanSoft.direction.length - 0)) + 0] : 'auto';
            l = artisanSoft.direction[Math.floor(Math.random() * (artisanSoft.direction.length - 0)) + 0];
            r = l == 'auto' ? artisanSoft.direction[Math.floor(Math.random() * (artisanSoft.direction.length - 0)) + 0] : 'auto';
            l = r == 'auto' ? artisanSoft.direction[Math.floor(Math.random() * (artisanSoft.direction.length - 0)) + 0] : 'auto';
            r = l == 'auto' ? artisanSoft.direction[Math.floor(Math.random() * (artisanSoft.direction.length - 0)) + 0] : 'auto';
            outtime = Math.floor(Math.random() * (1000 - 500)) + 500;

            $(elements[7]).find('> p').css({
                height: $(elements[7]).find('> p').find('> img').height()
            }).find('img').animate({
                marginTop: t,
                marginLeft: l,
                marginRight: r,
                marginBottom: b
            }, outtime, 'easeInOutBack');

            setTimeout(function() {
                return f();
            }, artisanSoft.timeoutall / 4);
        } catch (e) {
            location.href = location.href;
        }
    },

    newElement: function(i) {
        try {
            p = artisanSoft.create('p');

            $(elements[13]).animate({
                backgroundColor: '#000'
            }, 300, function() {

                img = new Image();
                img.src = artisanSoft.el[artisanSoft.count][artisanSoft.el[artisanSoft.count].length - 2];
                img.onload = function() {

                    for (_i = 0; _i < artisanSoft.el[artisanSoft.count][artisanSoft.el[artisanSoft.count].length - 1]; _i++) {
                        span = artisanSoft.create('span');
                        span.className = 'span-' + i;
                        span.style.top = artisanSoft.el[artisanSoft.count][_i][0].split(',')[0] + '%';
                        span.style.left = artisanSoft.el[artisanSoft.count][_i][1].split(',')[0] + '%';
                        span.style.right = artisanSoft.el[artisanSoft.count][_i][2].split(',')[0] + '%';
                        span.style.bottom = artisanSoft.el[artisanSoft.count][_i][3].split(',')[0] + '%';
                        span.style.opacity = artisanSoft.el[artisanSoft.count][_i][5];
                        span.style.background = artisanSoft.el[artisanSoft.count][_i][11];
                        span.innerHTML = artisanSoft.el[artisanSoft.count][_i][13];
                        p.appendChild(span);
                    }
                    artisanSoft.timeoutall = 0;

                    $(p).find('span').each(function(_i, el) {
                        setTimeout(function() {
                            $(el).animate({
                                top: artisanSoft.el[artisanSoft.count][_i][0].split(',')[1] + '%',
                                left: artisanSoft.el[artisanSoft.count][_i][1].split(',')[1] + '%',
                                right: artisanSoft.el[artisanSoft.count][_i][2].split(',')[1] + '%',
                                bottom: artisanSoft.el[artisanSoft.count][_i][3].split(',')[1] + '%',
                                opacity: 1,
                            }, artisanSoft.el[artisanSoft.count][_i][7], artisanSoft.el[artisanSoft.count][_i][8]);

                            setTimeout(function() {
                                $(el).css({
                                    transition: artisanSoft.el[artisanSoft.count][_i][10],
                                    transform: artisanSoft.el[artisanSoft.count][_i][4]
                                });
                            }, artisanSoft.el[artisanSoft.count][_i][7]);

                        }, artisanSoft.el[artisanSoft.count][_i][6]);

                        artisanSoft.timeoutall += artisanSoft.el[artisanSoft.count][_i][6];
                    });

                    clearInterval(artisanSoft._interval);
                    artisanSoft.timeout = artisanSoft.timeoutall;
                    artisanSoft.interval();

                    $(p).append(this);
                    $(elements[7]).html(null).append(p);
                    $(elements[13]).animate({
                        backgroundColor: 'rgba(0,0,0,0)'
                    }, 300);
                    $('.logo-text').animate({
                        color: artisanSoft.generalFeatures[artisanSoft.count][0]
                    }, artisanSoft.timeChange);
                    $('.logo-dec').animate({
                        color: artisanSoft.generalFeatures[artisanSoft.count][1]
                    }, artisanSoft.timeChange);
                    $('.navbar-scrolling').animate({
                        backgroundColor: artisanSoft.generalFeatures[artisanSoft.count][2]
                    }, artisanSoft.timeChange);
                    $('.navbar-default .navbar-nav>li>a').css({
                        color: artisanSoft.generalFeatures[artisanSoft.count][3],
                        fontWeight: artisanSoft.generalFeatures[artisanSoft.count][4]
                    }, artisanSoft.timeChange);
                    $('ol > li > span.a > span > a').animate({
                        backgroundColor: artisanSoft.generalFeatures[artisanSoft.count][5]
                    }, artisanSoft.timeChange);
                    $('.ligbox-form').animate({
                        backgroundColor: artisanSoft.generalFeatures[artisanSoft.count][6]
                    }, artisanSoft.timeChange);
                    $('.ligbox-form button').animate({
                        backgroundColor: artisanSoft.generalFeatures[artisanSoft.count][7]
                    }, artisanSoft.timeChange);
                    $('.ligbox-form span').animate({
                        color: artisanSoft.generalFeatures[artisanSoft.count][7]
                    }, artisanSoft.timeChange);
                    $('.ligbox-form input,.ligbox-form textarea').animate({
                        borderColor: artisanSoft.generalFeatures[artisanSoft.count][8]
                    }, artisanSoft.timeChange);
                    $('#contacto').animate({
                        backgroundColor: artisanSoft.generalFeatures[artisanSoft.count][9]
                    }, artisanSoft.timeChange);
                    $('#contacto button').animate({
                        backgroundColor: artisanSoft.generalFeatures[artisanSoft.count][10],
                        borderColor: artisanSoft.generalFeatures[artisanSoft.count][11]
                    }, artisanSoft.timeChange);
                    $('#contacto input,#contacto textarea').animate({
                        borderColor: artisanSoft.generalFeatures[artisanSoft.count][11]
                    }, artisanSoft.timeChange);
                    $('.slider a.control-left > div > p,.slider a.control-right > div > p').animate({
                        color: artisanSoft.generalFeatures[artisanSoft.count][12]
                    }, artisanSoft.timeChange);
                    $('.slider div:nth-child(4) > p > button').animate({
                        backgroundColor: artisanSoft.generalFeatures[artisanSoft.count][12]
                    }, artisanSoft.timeChange);
                    $('.slider div:nth-child(3),.slider div:nth-child(3) > div > p,.slider div:nth-child(3) > div > p > img').animate({
                        borderColor: artisanSoft.generalFeatures[artisanSoft.count][12]
                    }, artisanSoft.timeChange);
                    $('.slider div:nth-child(3) > div > p span').animate({
                        borderTopColor: artisanSoft.generalFeatures[artisanSoft.count][12]
                    }, artisanSoft.timeChange);
                    $('.slider div:nth-child(2) > div:nth-child(1)').animate({
                        color: artisanSoft.generalFeatures[artisanSoft.count][13]
                    }, artisanSoft.timeChange);
                };
            });
        } catch (e) {
            location.href = location.href;
        }
    },

    controls: function() {
        try {
            $(elements[14]).click(function(e) {
                if (artisanSoft.debchange) {
                    return false;
                } else {
                    artisanSoft.debchange = true;
                    clearInterval(artisanSoft._interval);
                    artisanSoft.hideHall(function() {
                        artisanSoft.newElement(artisanSoft.count-- <= 0 ? artisanSoft.count = artisanSoft.el.length - 1 : artisanSoft.count);
                        $(elements[14]).find('img').css({
                            transition: 'none'
                        }).animate({
                            marginLeft: '-100%'
                        }, 700, 'easeOutElastic', function() {
                            $(this).attr('src', artisanSoft.el[(artisanSoft.count - 1) >= 0 ? artisanSoft.count - 1 : artisanSoft.el.length - 1][artisanSoft.el[(artisanSoft.count - 1) >= 0 ? artisanSoft.count - 1 : artisanSoft.el.length - 1].length - 2]).animate({
                                transition: 'none',
                                marginLeft: '0'
                            }, 500, 'easeOutElastic', function() {
                                $(this).css({
                                    transition: '.5s ease-in'
                                });
                            });
                        });
                        artisanSoft.interval();
                        artisanSoft.debchange = false;
                    });
                }
            }).hover(function() {
                $(this).find('img').attr('src', artisanSoft.el[(artisanSoft.count - 1) >= 0 ? artisanSoft.count - 1 : artisanSoft.el.length - 1][artisanSoft.el[(artisanSoft.count - 1) >= 0 ? artisanSoft.count - 1 : artisanSoft.el.length - 1].length - 2]);
            });
            $(elements[15]).click(function(e) {
                if (artisanSoft.debchange) {
                    return false;
                } else {
                    artisanSoft.debchange = true;
                    clearInterval(artisanSoft._interval);
                    artisanSoft.hideHall(function() {
                        artisanSoft.newElement(artisanSoft.count++ >= artisanSoft.el.length - 1 ? artisanSoft.count = 0 : artisanSoft.count);
                        $(elements[15]).find('img').css({
                            transition: 'none'
                        }).animate({
                            marginLeft: '100%'
                        }, 700, 'easeOutElastic', function() {
                            $(this).attr('src', artisanSoft.el[(artisanSoft.count - 1) >= 0 ? artisanSoft.count - 1 : artisanSoft.el.length - 1][artisanSoft.el[(artisanSoft.count - 1) >= 0 ? artisanSoft.count - 1 : artisanSoft.el.length - 1].length - 2]).animate({
                                transition: 'none',
                                marginLeft: '0'
                            }, 500, 'easeOutElastic', function() {
                                $(this).css({
                                    transition: '.5s ease-in'
                                });
                            });
                        });
                        artisanSoft.interval();
                        artisanSoft.debchange = false;
                    });
                }
            }).hover(function() {
                $(this).find('img').attr('src', artisanSoft.el[(artisanSoft.count + 1) > (artisanSoft.el.length - 1) ? 0 : artisanSoft.count + 1][artisanSoft.el[(artisanSoft.count + 1) > (artisanSoft.el.length - 1) ? 0 : artisanSoft.count + 1].length - 2]);
            });

            $(elements[9]).find('.glyphicon-chevron-left').click(function(e) {
                if (artisanSoft.debchange) {
                    return false;
                } else {
                    artisanSoft.debchange = true;
                    clearInterval(artisanSoft.movePKinterval);
                    $(elements[10]).find('> ol').animate({
                        marginLeft: artisanSoft.movePKi-- <= 0 ? ((artisanSoft.movePKsum = 0) + (artisanSoft.movePKi = 0)) : artisanSoft.movePKsum += $(elements[10]).width() + 4
                    }, 300, 'easeInOutExpo', function() {
                        artisanSoft.movePK();
                        artisanSoft.debchange = false;
                    });
                }
            });

            $(elements[9]).find('.glyphicon-chevron-right').click(function(e) {
                if (artisanSoft.debchange) {
                    return false;
                } else {
                    artisanSoft.debchange = true;
                    clearInterval(artisanSoft.movePKinterval);
                    $(elements[10]).find('> ol').animate({
                        marginLeft: artisanSoft.movePKi++ >= artisanSoft.movePKcount ? artisanSoft.movePKsum + ((-artisanSoft.movePKcount) + (artisanSoft.movePKi = artisanSoft.movePKcount)) : artisanSoft.movePKsum -= $(elements[10]).width() + 4
                    }, 300, 'easeInOutExpo', function() {
                        artisanSoft.movePK();
                        artisanSoft.debchange = false;
                    });
                }
            });
            $(elements[10]).hover(function() {
                $('.slider div:nth-child(2) > div:nth-child(2)').css({
                    overflow: 'visible'
                });
                $(this).find('> ol > li').css({
                    opacity: 0
                });
                $(this).find('> ol > li').eq(artisanSoft.movePKi).css({
                    opacity: 1
                });
                clearInterval(artisanSoft.movePKinterval);
            }, function() {
                $('.slider div:nth-child(2) > div:nth-child(2)').css({
                    overflow: 'hidden'
                });
                $(this).find('> ol > li').css({
                    opacity: 1
                });
                artisanSoft.movePK();
            });
        } catch (e) {
            location.href = location.href;
        }
    },

    interval: function() {
        this._interval = setInterval(function() {
            try {
                artisanSoft.hideHall(function() {
                    artisanSoft.newElement(artisanSoft.count >= artisanSoft.el.length - 1 ? artisanSoft.count = 0 : artisanSoft.count++);
                });
            } catch (e) {
                location.href = location.href;
            }
        }, this.timeout);
    },

    start: function() {
        $(elements[7]).find('p').each(function(i, el) {
            artisanSoft.el[i] = [];
            spanCount = 0;
            $(el).find('span').each(function(_i, _el) {
                artisanSoft.el[i][_i] = [];
                artisanSoft.el[i][_i].push($(_el).data('top'));
                artisanSoft.el[i][_i].push($(_el).data('left'));
                artisanSoft.el[i][_i].push($(_el).data('right'));
                artisanSoft.el[i][_i].push($(_el).data('bottom'));
                artisanSoft.el[i][_i].push($(_el).data('transform'));
                artisanSoft.el[i][_i].push($(_el).data('opacity'));
                artisanSoft.el[i][_i].push($(_el).data('timeout'));
                artisanSoft.el[i][_i].push($(_el).data('timein'));
                artisanSoft.el[i][_i].push($(_el).data('easing'));
                artisanSoft.el[i][_i].push($(_el).data('timeoutout'));
                artisanSoft.el[i][_i].push($(_el).data('transition'));
                artisanSoft.el[i][_i].push($(_el).data('background'));
                artisanSoft.el[i][_i].push($(_el).data('transformout'));
                artisanSoft.el[i][_i].push($(_el).html());
                spanCount++;
            });
            $(el).find('> img').each(function(_i, _el) {
                artisanSoft.el[i].push($(_el).attr('src'));
                _p = artisanSoft.create('p');
                _img = new Image();
                _img.src = $(_el).attr('src');
                $(_p).append(_img).append(artisanSoft.create('span'));
                $(elements[12]).append(_p);
                $(_img).click(function() {
                    if (artisanSoft.debchange) {
                        return false;
                    } else {
                        artisanSoft.debchange = true;
                        clearInterval(artisanSoft._interval);
                        artisanSoft.hideHall(function() {
                            artisanSoft.newElement(artisanSoft.count = i);
                            artisanSoft.interval();
                            artisanSoft.debchange = false;
                        });
                    }
                });
                artisanSoft.generalFeatures[i] = [];
                artisanSoft.generalFeatures[i].push($(_el).data('headerlogo'));
                artisanSoft.generalFeatures[i].push($(_el).data('headerlogodes'));
                artisanSoft.generalFeatures[i].push($(_el).data('header'));
                artisanSoft.generalFeatures[i].push($(_el).data('headertext'));
                artisanSoft.generalFeatures[i].push($(_el).data('weightheader'));
                artisanSoft.generalFeatures[i].push($(_el).data('btnservice'));
                artisanSoft.generalFeatures[i].push($(_el).data('ligboxform'));
                artisanSoft.generalFeatures[i].push($(_el).data('ligboxbth'));
                artisanSoft.generalFeatures[i].push($(_el).data('ligboxborder'));
                artisanSoft.generalFeatures[i].push($(_el).data('footer'));
                artisanSoft.generalFeatures[i].push($(_el).data('footerbtn'));
                artisanSoft.generalFeatures[i].push($(_el).data('footerborder'));
                artisanSoft.generalFeatures[i].push($(_el).data('controls'));
                artisanSoft.generalFeatures[i].push($(_el).data('controlspck'));
            });
            artisanSoft.el[i].push(spanCount);
        });
        this.newElement(this.count);
        this.controls();
        this.interval();
        this.movePK();
    },

}

var elements = null;
$(window).load(function() {
    elements = document.getElementsByTagName('div');
    $('.loader').fadeOut('slow');
    if (getPath().indexOf("portaldeservicios")>=0|getPath().indexOf("descripcion")>=0) {
        $('nav').addClass('navbar-scrolling');
        artisanSoft.start();
    }
}).scroll(function(e) {
        if ($('html').scrollTop() > 120 | getPath().indexOf("portaldeservicios")>=0|getPath().indexOf("descripcion")>=0)
            $('nav').addClass('navbar-scrolling');
        else
            $('nav').removeClass('navbar-scrolling');
});;