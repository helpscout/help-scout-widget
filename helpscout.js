(function() {
    (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            define(factory);
        } else {
            root.HelpScout = factory();
        }
    }(this, function () {
/**
 * almond 0.2.6 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {

            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        if (config.deps) {
            req(config.deps, config.callback);
        }
        return req;
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("../almond", function(){});

(function() {
  var __slice = [].slice;

  define('utils',{
    extend: function() {
      var key, obj, objs, out, val, _i, _len;
      out = arguments[0], objs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      out = out || {};
      for (_i = 0, _len = objs.length; _i < _len; _i++) {
        obj = objs[_i];
        for (key in obj) {
          val = obj[key];
          if (obj.hasOwnProperty(key)) {
            out[key] = val;
          }
        }
      }
      return out;
    }
  });

}).call(this);

(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define('api',['utils'], function(utils) {
    var HelpScoutAPI;
    return HelpScoutAPI = (function() {
      function HelpScoutAPI(options) {
        var apiKey;
        if (options == null) {
          options = {};
        }
        apiKey = options.apiKey;
        if (!apiKey) {
          throw new Error('Bro, gimme an API key. Just do it. Do it.');
          return;
        }
        console.warn('BTW this is really not secure. Hopefully Help Scout comes out with API scoping.');
        this.base64AuthKey = btoa(apiKey + ':X');
        utils.extend(this, options);
        return;
      }

      HelpScoutAPI.prototype.urlRoot = 'https://api.helpscout.net';

      HelpScoutAPI.prototype.version = 'v1';

      HelpScoutAPI.prototype.resources = ['conversations', 'customers', 'mailboxes', 'search', 'tags', 'users', 'workflows'];

      HelpScoutAPI.prototype.request = function(options) {
        var data, method, resource, resourcesStr;
        resource = options.resource, method = options.method, data = options.data;
        if (__indexOf.call(this.resources, resource) < 0) {
          resourcesStr = this.resources.join(' ,');
          throw new Error("That's not a real endpoint. Should be one of " + resourcesStr);
        }
        return this._request(this._getRequestOptions(options));
      };

      HelpScoutAPI.prototype._getRequestOptions = function(options) {
        if (!options) {
          return options;
        }
        return {
          url: this.getUrl(options.resource),
          type: options.method,
          dataType: 'json',
          data: options.data,
          headers: {
            Authorization: 'Basic ' + this.base64AuthKey
          }
        };
      };

      HelpScoutAPI.prototype.getUrl = function(resource) {
        var part, r, validParts, _i, _len, _ref;
        validParts = [];
        r = resource ? "" + resource + ".json" : '';
        _ref = [this.urlRoot, this.version, r];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          part = _ref[_i];
          if (part) {
            validParts.push(part);
          }
        }
        return validParts.join('/');
      };

      HelpScoutAPI.prototype._request = (typeof jQuery !== "undefined" && jQuery !== null ? jQuery.ajax : void 0) || function() {
        return console.warn('You need to use jQuery or implement some kind of request library.');
      };

      return HelpScoutAPI;

    })();
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('conversations',['api', 'utils'], function(HelpScoutAPI, utils) {
    var ConversationsAPI;
    return ConversationsAPI = (function(_super) {
      __extends(ConversationsAPI, _super);

      function ConversationsAPI() {
        return ConversationsAPI.__super__.constructor.apply(this, arguments);
      }

      ConversationsAPI.prototype.create = function(options) {
        var body, customer, mailboxId, maxSubjectLen, subject;
        customer = options.customer, mailboxId = options.mailboxId, body = options.body;
        maxSubjectLen = 100;
        subject = body;
        if (subject.length > maxSubjectLen) {
          subject = body.substring(0, maxSubjectLen - 3) + '...';
        }
        return this.request({
          method: 'post',
          data: {
            customer: customer,
            subject: body.substring(0, 50) + '...',
            mailbox: {
              id: mailboxId
            },
            threads: [
              {
                type: 'customer',
                createdBy: utils.extend({
                  type: 'customer'
                }, customer),
                body: body
              }
            ]
          }
        });
      };

      ConversationsAPI.prototype.request = function(options) {
        if (options != null) {
          if (options.resource == null) {
            options.resource = 'conversations';
          }
        }
        return ConversationsAPI.__super__.request.call(this, options);
      };

      return ConversationsAPI;

    })(HelpScoutAPI);
  });

}).call(this);

(function() {
  define('view',[],function() {
    var WidgetView, getFormData, viewCounter;
    viewCounter = 0;
    getFormData = function(formEl) {
      var data, el, _i, _len, _ref;
      data = {};
      _ref = formEl.elements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        if (el.type !== 'submit') {
          data[el.name] = el.value;
        }
      }
      return data;
    };
    return WidgetView = (function() {
      function WidgetView(options) {
        if (options == null) {
          options = {};
        }
        this.id = 'v' + viewCounter;
        viewCounter++;
        this.el = document.createElement('div');
        this.el.classList.add('hs-widget');
        this.el.classList.add('hs-position-' + options.position);
        this.render();
        document.body.appendChild(this.el);
        return this;
      }

      WidgetView.prototype.render = function() {
        this.el.classList.remove('hs-widget-active');
        this.el.classList.remove('hs-widget-form-success-active');
        this.el.innerHTML = this.template();
        this.el.querySelector('.hs-widget-icon').addEventListener('click', this.toggle.bind(this));
        this.el.querySelector('.hs-widget-close').addEventListener('click', this.render.bind(this));
        this.el.querySelector('.hs-widget-form').addEventListener('submit', this.submit.bind(this));
        return this;
      };

      WidgetView.prototype.template = function(context) {
        var color, email;
        if (context == null) {
          context = {};
        }
        color = context.color, email = context.email;
        if (color == null) {
          color = '#4f9ae5';
        }
        if (email == null) {
          email = '';
        }
        return "<div class=\"hs-widget-icon\">\n    <svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"39px\" height=\"39px\" viewBox=\"0 0 39 39\" enable-background=\"new 0 0 39 39\" xml:space=\"preserve\">\n        <g>\n            <path fill=\"rgba(46, 49, 51, 0.6)\" d=\"M31.425,34.514c-0.432-0.944-0.579-2.007-0.591-2.999c4.264-3.133,7.008-7.969,7.008-13.409\n                C37.842,8.658,29.594,1,19.421,1S1,8.658,1,18.105c0,9.446,7.932,16.79,18.105,16.79c1.845,0,3.94,0.057,5.62-0.412\n                c0.979,1.023,2.243,2.3,2.915,2.791c3.785,2.759,7.571,0,7.571,0S32.687,37.274,31.425,34.514z\" style=\"fill: " + color + ";\"></path>\n            <g>\n                <g>\n                    <path fill=\"#FFFFFF\" d=\"M16.943,19.467c0-3.557,4.432-3.978,4.432-6.058c0-0.935-0.723-1.721-2.383-1.721\n                        c-1.508,0-2.773,0.725-3.709,1.87l-2.441-2.743c1.598-1.9,4.01-2.924,6.602-2.924c3.891,0,6.271,1.959,6.271,4.765\n                        c0,4.4-5.037,4.732-5.037,7.265c0,0.481,0.243,0.994,0.574,1.266l-3.316,0.965C17.303,21.459,16.943,20.522,16.943,19.467z\n                         M16.943,26.19c0-1.326,1.114-2.441,2.44-2.441c1.327,0,2.442,1.115,2.442,2.441c0,1.327-1.115,2.441-2.442,2.441\n                        C18.058,28.632,16.943,27.518,16.943,26.19z\" style=\"fill: rgb(255, 255, 255);\"></path>\n                </g>\n            </g>\n        </g>\n    </svg>\n</div>\n<div class=\"hs-widget-form-container\">\n    <form class=\"hs-widget-form\">\n        <h4>Send us a message</h4>\n        <p>We love hearing from you.</p>\n        <input class=\"hs-widget-form-control\" type=\"email\" name=\"email\" value=\"" + email + "\" placeholder=\"Your email\" required autofocus/>\n        <textarea class=\"hs-widget-form-control\" name=\"body\" placeholder=\"Hey there! I need help with...\" required></textarea>\n        <div class=\"hs-widget-btns\">\n            <button class=\"hs-widget-btn\" type=\"submit\">Let us know</button>\n        </div>\n    </form>\n    <div class=\"hs-widget-form-success\">\n        <br><br><br><br>\n        <h4>We've got you covered.</h4>\n        <p>One of us will reach out to you by email or phone shortly. Just hang tight!</p>\n        <button class=\"hs-widget-btn hs-widget-close\">Got it!</button>\n    </div>\n</div>";
      };

      WidgetView.prototype.toggle = function() {
        if (this.el.classList.contains('hs-widget-active')) {
          this.hide();
        } else {
          this.show();
        }
        return this;
      };

      WidgetView.prototype.show = function() {
        this.el.classList.add('hs-widget-active');
        return this;
      };

      WidgetView.prototype.hide = function() {
        this.el.classList.remove('hs-widget-active');
        return this;
      };

      WidgetView.prototype.submit = function(e) {
        var data;
        e.preventDefault();
        data = getFormData(this.el.querySelector('.hs-widget-form'));
        this.onSubmit(data);
        return false;
      };

      WidgetView.prototype.onSubmit = function(data) {};

      WidgetView.prototype.showSuccess = function() {
        return this.el.classList.add('hs-widget-form-success-active');
      };

      WidgetView.prototype.remove = function() {
        return this.el.remove();
      };

      return WidgetView;

    })();
  });

}).call(this);

(function() {
  define('main',['conversations', 'view'], function(HelpScout, WidgetView) {
    var Interface;
    return Interface = (function() {
      function Interface(options) {
        var api, init, views;
        api = new HelpScout(options);
        views = [];
        init = function(options) {
          var view;
          view = new WidgetView(options);
          view.onSubmit = function(data) {
            var req;
            req = api.create({
              mailboxId: options.mailboxId,
              customer: {
                email: data.email
              },
              body: data.body
            });
            return req.then(this.showSuccess.bind(this));
          };
          views.push(view);
          return view;
        };
        return {
          init: init,
          views: views
        };
      }

      return Interface;

    })();
  });

}).call(this);

        return require('main');
    }));
})();