"use strict";function e(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}Object.defineProperty(exports,"__esModule",{value:!0});var o=e(require("mitt")),n=function(){return n=Object.assign||function(e){for(var o,n=1,r=arguments.length;n<r;n++)for(var t in o=arguments[n])Object.prototype.hasOwnProperty.call(o,t)&&(e[t]=o[t]);return e},n.apply(this,arguments)};
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */exports.WS_CONNECT_COUNT=0;var r=function(e){var n=e.heart_interval,r=void 0===n?5e4:n,t=e.api,s=e.open,c=e.vue_emit_name||{onopen:"ws_open",onmessage:"ws_message",onerror:"ws_error",onclose:"ws_close"},a=o.default(),i=null,l=!0;try{l="string"==typeof s?JSON.parse(s):s}catch(e){l=!0,console.error("the open property should be a truly value.")}if(l&&t){var u=new WebSocket(t);return u.onopen=function(o){console.log("ws connected..."),exports.WS_CONNECT_COUNT=0,a.emit(c.onopen,o),u.send("heart"),clearInterval(i),i=setInterval((function(){u.send("heart")}),"string"==typeof r?Number.parseInt(r):r),e.onopen&&e.onopen(o)},u.onmessage=function(o){var n=JSON.parse(o.data);a.emit(c.onmessage,n),e.onmessage&&e.onmessage(n)},u.onerror=function(o){console.log("ws error!"),a.emit(c.onerror,o),clearInterval(i),e.onerror&&e.onerror(o)},u.onclose=function(o){console.log("ws closed!"),function(e,o){e.emit("ws_reconnect",o)}(a,o),a.emit(c.onclose,o),clearInterval(i),e.onclose&&e.onclose(o)},{WS:u,WsBus:a}}return{WsBus:a}},t=function(e,o){void 0===o&&(o={}),o.vue_emit_name=n(n({},{onopen:"ws_open",onmessage:"ws_message",onerror:"ws_error",onclose:"ws_close"}),o.vue_emit_name);var s=r(o);if(s){e.prototype.$ws=s;var c=s.WsBus,a=o.reconnect_limit,i=void 0===a?30:a,l=o.reconnect_limit_msg,u=o.reconnect_msg;c.on("ws_reconnect",(function(){if(exports.WS_CONNECT_COUNT>i){var n=l||"The number of ws reconnections has exceeded ".concat(i,"，you can refresh to reconnect the ws server!");console.warn(n)}else setTimeout((function(){++exports.WS_CONNECT_COUNT;var n="ws reconnect the ".concat(exports.WS_CONNECT_COUNT,"th time ...");"function"==typeof u?n=u(exports.WS_CONNECT_COUNT):u&&(n=u),console.log(n),t(e,o)}),o.reconnect_interval||3e3)}))}},s={install:t};exports.createWebSocket=r,exports.wsInstaller=s;
