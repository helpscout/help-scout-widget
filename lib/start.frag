(function() {
    (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            define(factory);
        } else {
            root.HelpScout = factory();
        }
    }(this, function () {
