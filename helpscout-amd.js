(function() {
    (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            define(factory);
        } else {
            root.HelpScout = factory();
        }
    }(this, function () {
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