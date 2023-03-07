"use strict";function e(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}Object.defineProperty(exports,"__esModule",{value:!0});var o=e(require("mitt")),n=function(e){var n=e.heart_interval,r=void 0===n?5e4:n,s=e.api,t=e.open,c=e.ws_bus_emit_names||{onopen:"ws_open",onmessage:"ws_message",onerror:"ws_error",onclose:"ws_close"},a=o.default(),i=null,l=!0;try{l="string"==typeof t?JSON.parse(t):t}catch(e){l=!0,console.error("the open property should be a truly value.")}if(l&&s){var _=new WebSocket(s);return _.onopen=function(o){console.log("ws connected..."),a.emit(c.onopen,o),_.send("heart"),clearInterval(i),i=setInterval((function(){_.send("heart")}),"string"==typeof r?Number.parseInt(r):r),e.onopen&&e.onopen(o)},_.onmessage=function(o){var n=JSON.parse(o.data);a.emit(c.onmessage,n),e.onmessage&&e.onmessage(n)},_.onerror=function(o){console.log("ws error!"),a.emit(c.onerror,o),clearInterval(i),e.onerror&&e.onerror(o)},_.onclose=function(o){console.log("ws closed!"),function(e,o){e.emit("ws_reconnect",o)}(a,o),a.emit(c.onclose,o),clearInterval(i),e.onclose&&e.onclose(o)},{WS:_,WsBus:a}}return{WsBus:a}};exports.WS_CONNECT_COUNT=0;var r=function(e,o){e.ws_bus_emit_names=Object.assign({onopen:"ws_open",onmessage:"ws_message",onerror:"ws_error",onclose:"ws_close"},e.ws_bus_emit_names);var s=n(e);if(s){var t=s.WsBus,c=e.reconnect_limit,a=void 0===c?30:c,i=e.reconnect_limit_msg,l=e.reconnect_msg;return t.on(e.ws_bus_emit_names.onopen,(function(){exports.WS_CONNECT_COUNT=0})),t.on("ws_reconnect",(function(){if(exports.WS_CONNECT_COUNT>a){var n=i||"The number of ws reconnections has exceeded ".concat(a,"，you can refresh to reconnect the ws server!");console.warn(n)}else setTimeout((function(){++exports.WS_CONNECT_COUNT;var n="ws reconnect the ".concat(exports.WS_CONNECT_COUNT,"th time ...");"function"==typeof l?n=l(exports.WS_CONNECT_COUNT):l&&(n=l),console.log(n),r(e,o)}),e.reconnect_interval||3e3)})),o(s),s}},s={install:function(e,o){void 0===o&&(o={}),r(o,(function(o){e.prototype.$ws=o}))}};exports.createWebSocket=n,exports.initMyws=r,exports.wsInstaller=s;
