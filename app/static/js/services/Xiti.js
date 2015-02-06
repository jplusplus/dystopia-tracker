var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular.module('dystopia-tracker.services').service('Xiti', [
  '$cookies',
  '$translate',
  function($cookies, $translate) {
    var Xiti;
    return new (Xiti = (function() {
      Xiti.prototype.currentPage =  [];
      Xiti.prototype.scriptLoaded = false;
      Xiti.prototype.lang = null;
      Xiti.prototype.config = {
        F: {
          xtsite: "544667",
          xtn2: "1",
          prefix: "dos_dystopia::"
        },
        D: {
          xtsite: "544667",
          xtn2: "2",
          prefix: "dos_dystopia::"
        },
        E: {
          xtsite: "544667",
          xtn2: "3",
          prefix: "dos_dystopia::"
        }
      };

      function Xiti() {
        // Instance methodes
        this.loadPage = __bind(this.loadPage, this);
        this.updateConfig = __bind(this.updateConfig, this);
        this.getConfig = __bind(this.getConfig, this);
        this.setLanguage = __bind(this.setLanguage, this);
      }

      Xiti.prototype.getConfig = function(lang) {
        return this.config[lang || this.lang];
      };

      Xiti.prototype.setLanguage = function(lang) {
        if(lang !== this.lang) {
          this.updateConfig(lang);
          this.loadScript();
        }
      };

      Xiti.prototype.updateConfig = function(lang) {
        this.lang = lang || $translate.use() || this.lang || "E"
        var config = this.getConfig(this.lang);
        window.xtnv = document;
        window.xtsd = config.xtsd || "http://logc136";
        window.xtsite = config.xtsite || "544667";
        window.xtn2 = config.xtn2 || "1";
        window.xtpage = "";
        window.xtdi = "";
        window.xt_multc = "";
        window.xt_an = "";
        window.xt_ac = "";
        if (window.xtparam == null) {
          window.xtparam = "";
        }
        return window.xtparam += "&ac=" + xt_ac + "&an=" + xt_an + xt_multc;
      };

      Xiti.prototype.loadScript = function() {
        if(!this.scriptLoaded && this.lang !== null) {
          var at;
          at = document.createElement("script");
          at.type = "text/javascript";
          at.async = true;
          at.src = "http://www.arte.tv/guide/javascripts/xtcore.js";
          this.scriptLoaded = true
          return angular.element("header").append(at);
        }
      };

      Xiti.prototype.loadPage = function() {
        var args, xtpage;
        args = Array.prototype.slice.call(arguments);
        if(this.lang && this.currentPage.join("::") !== args.join("::")) {
          var currentPage = args.join("::");
          this.currentPage = args;
          xtpage = this.getConfig().prefix + currentPage;
          if (this.img != null) {
            angular.element(this.img).remove();
          }
          this.img = document.createElement("img");
          this.img.height = 1;
          this.img.width = 1;
          this.img.src = window.xtsd + ".xiti.com/";
          this.img.src += "hit.xiti?s=" + window.xtsite;
          this.img.src += "&s2=" + this.getConfig(this.lang).xtn2;
          this.img.src += "&p=" + xtpage;
          this.img.src += "&di=" + window.xtdi;
          return angular.element("body").append(this.img);
        }
      };

      Xiti.prototype.trackClick = function(ev, name, level) {
        if (level == null) {
          level = window.xtn2;
        }
        window.xt_click(ev.target, 'C', level, name, 'N');
        return true;
      };

      return Xiti;

    })());
  }
]);
