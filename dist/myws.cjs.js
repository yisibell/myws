"use strict";var e=require("mitt"),o="ws_reconnect",n=function(n){var s=n.heart_interval,r=void 0===s?5e4:s,t=n.api,c=n.open,a=n.ws_bus_emit_names||{onopen:"ws_open",onmessage:"ws_message",onerror:"ws_error",onclose:"ws_close"},i=e(),l=null,_=!0;try{_="string"==typeof c?JSON.parse(c):c}catch(e){_=!0,console.error("the open property should be a truly value.")}if(_&&t){var u=new WebSocket(t,n.protocols);return u.onopen=function(e){console.log("ws connected..."),i.emit(a.onopen,e),n.onopen&&n.onopen(e),u.send("heart"),clearInterval(l),l=setInterval((function(){u.send("heart")}),"string"==typeof r?Number.parseInt(r):r)},u.onmessage=function(e){var o=JSON.parse(e.data);i.emit(a.onmessage,o),n.onmessage&&n.onmessage(o)},u.onerror=function(e){console.log("ws error!"),i.emit(a.onerror,e),clearInterval(l),n.onerror&&n.onerror(e)},u.onclose=function(e){console.log("ws closed!"),function(e,n){e.emit(o,n)}(i,e),i.emit(a.onclose,e),clearInterval(l),n.onclose&&n.onclose(e)},{WS:u,WsBus:i}}return{WsBus:i}};exports.WS_CONNECT_COUNT=0;var s=function(e,r){e.ws_bus_emit_names=Object.assign({onopen:"ws_open",onmessage:"ws_message",onerror:"ws_error",onclose:"ws_close"},e.ws_bus_emit_names);var t=n(e);if(t){var c=t.WsBus,a=e.reconnect_limit,i=void 0===a?30:a,l=e.reconnect_limit_msg,_=e.reconnect_msg;return c.on(e.ws_bus_emit_names.onopen,(function(){var e;void 0===(e=0)&&(e=0),exports.WS_CONNECT_COUNT=e})),c.on(o,(function(){if(exports.WS_CONNECT_COUNT>i){var o=l||"The number of ws reconnections has exceeded ".concat(i,"，you can refresh to reconnect the ws server!");console.warn(o)}else setTimeout((function(){++exports.WS_CONNECT_COUNT;var o="ws reconnect the ".concat(exports.WS_CONNECT_COUNT,"th time ...");"function"==typeof _?o=_(exports.WS_CONNECT_COUNT):_&&(o=_),console.log(o),s(e,r)}),e.reconnect_interval||3e3)})),r(t),t}},r={install:function(e,o){void 0===o&&(o={}),s(o,(function(o){e.prototype.$ws=o}))}};exports.createWebSocket=n,exports.initMyws=s,exports.wsInstaller=r;
