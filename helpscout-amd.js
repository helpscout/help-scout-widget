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
      function WidgetView() {
        this.id = 'v' + viewCounter;
        viewCounter++;
        this.el = document.createElement('div');
        this.el.classList.add('hs-widget');
        this.render();
        document.body.appendChild(this.el);
        return this;
      }

      WidgetView.prototype.render = function() {
        this.el.classList.remove('hs-widget-active');
        this.el.classList.remove('hs-widget-form-success-active');
        this.el.innerHTML = this.template;
        this.el.querySelector('.hs-widget-icon').addEventListener('click', this.toggle.bind(this));
        this.el.querySelector('.hs-widget-close').addEventListener('click', this.render.bind(this));
        this.el.querySelector('.hs-widget-form').addEventListener('submit', this.submit.bind(this));
        return this;
      };

      WidgetView.prototype.template = "<div class=\"hs-widget-icon\">?</div>\n<div class=\"hs-widget-form-container\">\n    <form class=\"hs-widget-form\">\n        <h4>Send us a message</h4>\n        <p>We love hearing from you.</p>\n        <input class=\"hs-widget-form-control\" type=\"email\" name=\"email\" value=\"\" placeholder=\"Your email\" required autofocus/>\n        <textarea class=\"hs-widget-form-control\" name=\"body\" placeholder=\"Hey there! I need help with...\" required></textarea>\n        <div class=\"hs-widget-btns\">\n            <button class=\"hs-widget-btn\" type=\"submit\">Let us know</button>\n        </div>\n    </form>\n    <div class=\"hs-widget-form-success\">\n        <br><br><br><br>\n        <h4>We've got you covered.</h4>\n        <p>One of us will reach out to you by email or phone shortly. Just hang tight!</p>\n        <button class=\"hs-widget-btn hs-widget-close\">Got it!</button>\n    </div>\n</div>";

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