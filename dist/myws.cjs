'use strict';

function mitt(n){return {all:n=n||new Map,on:function(t,e){var i=n.get(t);i?i.push(e):n.set(t,[e]);},off:function(t,e){var i=n.get(t);i&&(e?i.splice(i.indexOf(e)>>>0,1):n.set(t,[]));},emit:function(t,e){var i=n.get(t);i&&i.slice().map(function(n){n(e);}),(i=n.get("*"))&&i.slice().map(function(n){n(t,e);});}}}

var defaultEmitNameMap = function () { return ({
    onopen: 'ws_open',
    onmessage: 'ws_message',
    onerror: 'ws_error',
    onclose: 'ws_close',
}); };

var WS_RECONNECT_EMIT_NAME = 'ws_reconnect';
var emitWsReconnect = function (WsBus, data) {
    return WsBus.emit(WS_RECONNECT_EMIT_NAME, data);
};
var createWebSocket = function (options) {
    var _a = options.heart_interval, heart_interval = _a === void 0 ? 50000 : _a, api = options.api, open = options.open;
    var emitNameMap = options.ws_bus_emit_names || defaultEmitNameMap();
    var WsBus = mitt();
    var heartTimer = 0;
    var isOpenWs = true;
    try {
        isOpenWs = typeof open === 'string' ? JSON.parse(open) : open;
    }
    catch (err) {
        isOpenWs = true;
        console.error('the open property should be a truly value.');
    }
    if (isOpenWs && api) {
        var WS_1 = new WebSocket(api, options.protocols);
        WS_1.onopen = function (e) {
            console.log('ws connected...');
            WsBus.emit(emitNameMap.onopen, e);
            options.onopen && options.onopen(e);
            var heartData = options.heart_data ? options.heart_data() : 'heart';
            WS_1.send(heartData);
            clearInterval(heartTimer);
            heartTimer = setInterval(function () {
                WS_1.send(heartData);
            }, +heart_interval);
        };
        WS_1.onmessage = function (e) {
            var json_data = JSON.parse(e.data);
            WsBus.emit(emitNameMap.onmessage, json_data);
            options.onmessage && options.onmessage(json_data);
        };
        WS_1.onerror = function (e) {
            console.log('ws error!');
            WsBus.emit(emitNameMap.onerror, e);
            clearInterval(heartTimer);
            options.onerror && options.onerror(e);
        };
        WS_1.onclose = function (e) {
            console.log('ws closed!');
            emitWsReconnect(WsBus, e);
            WsBus.emit(emitNameMap.onclose, e);
            clearInterval(heartTimer);
            options.onclose && options.onclose(e);
        };
        return { WS: WS_1, WsBus: WsBus };
    }
    return { WsBus: WsBus };
};

exports.WS_CONNECT_COUNT = 0;
var setWsConnectCount = function (count) {
    if (count === void 0) { count = 0; }
    exports.WS_CONNECT_COUNT = count;
};
var initMyws = function (options, initCallback) {
    options.ws_bus_emit_names = Object.assign(defaultEmitNameMap(), options.ws_bus_emit_names);
    var $ws = createWebSocket(options);
    if (!$ws)
        return;
    var WsBus = $ws.WsBus;
    var _a = options.reconnect_limit, reconnect_limit = _a === void 0 ? 30 : _a, reconnect_limit_msg = options.reconnect_limit_msg, reconnect_msg = options.reconnect_msg;
    WsBus.on(options.ws_bus_emit_names.onopen, function () {
        setWsConnectCount(0);
    });
    WsBus.on(WS_RECONNECT_EMIT_NAME, function () {
        if (exports.WS_CONNECT_COUNT > reconnect_limit) {
            var msg = reconnect_limit_msg ||
                "The number of ws reconnections has exceeded ".concat(reconnect_limit, "\uFF0Cyou can refresh to reconnect the ws server!");
            console.warn(msg);
            return;
        }
        setTimeout(function () {
            ++exports.WS_CONNECT_COUNT;
            var msg = "ws reconnect the ".concat(exports.WS_CONNECT_COUNT, "th time ...");
            if (typeof reconnect_msg === 'function') {
                msg = reconnect_msg(exports.WS_CONNECT_COUNT);
            }
            else if (reconnect_msg) {
                msg = reconnect_msg;
            }
            console.log(msg);
            initMyws(options, initCallback);
        }, options.reconnect_interval || 3000);
    });
    initCallback && initCallback($ws);
    return $ws;
};
var install = function (Vue, options) {
    if (options === void 0) { options = {}; }
    initMyws(options, function (wsInstance) {
        Vue.prototype.$ws = wsInstance;
    });
};
var wsInstaller = {
    install: install,
};

exports.createWebSocket = createWebSocket;
exports.initMyws = initMyws;
exports.wsInstaller = wsInstaller;
