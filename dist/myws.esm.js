import e from"mitt";
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
***************************************************************************** */var o=function(){return o=Object.assign||function(e){for(var o,n=1,r=arguments.length;n<r;n++)for(var t in o=arguments[n])Object.prototype.hasOwnProperty.call(o,t)&&(e[t]=o[t]);return e},o.apply(this,arguments)},n=0,r=function(o){var r=o.heart_interval,t=void 0===r?5e4:r,s=o.api,c=o.open,a=o.vue_emit_name||{onopen:"ws_open",onmessage:"ws_message",onerror:"ws_error",onclose:"ws_close"},i=e(),l=null,u=!0;try{u="string"==typeof c?JSON.parse(c):c}catch(e){u=!0,console.error("the open property should be a truly value.")}if(u&&s){var m=new WebSocket(s);return m.onopen=function(e){console.log("ws connected..."),n=0,i.emit(a.onopen,e),m.send("heart"),clearInterval(l),l=setInterval((function(){m.send("heart")}),"string"==typeof t?Number.parseInt(t):t),o.onopen&&o.onopen(e)},m.onmessage=function(e){var n=JSON.parse(e.data);i.emit(a.onmessage,n),o.onmessage&&o.onmessage(n)},m.onerror=function(e){console.log("ws error!"),i.emit(a.onerror,e),clearInterval(l),o.onerror&&o.onerror(e)},m.onclose=function(e){console.log("ws closed!"),function(e,o){e.emit("ws_reconnect",o)}(i,e),i.emit(a.onclose,e),clearInterval(l),o.onclose&&o.onclose(e)},{WS:m,WsBus:i}}return{WsBus:i}},t=function(e,s){void 0===s&&(s={}),s.vue_emit_name=o(o({},{onopen:"ws_open",onmessage:"ws_message",onerror:"ws_error",onclose:"ws_close"}),s.vue_emit_name);var c=r(s);if(c){e.prototype.$ws=c;var a=c.WsBus,i=s.reconnect_limit,l=void 0===i?30:i,u=s.reconnect_limit_msg,m=s.reconnect_msg;a.on("ws_reconnect",(function(){if(n>l){var o=u||"The number of ws reconnections has exceeded ".concat(l,"，you can refresh to reconnect the ws server!");console.warn(o)}else setTimeout((function(){++n;var o="ws reconnect the ".concat(n,"th time ...");"function"==typeof m?o=m(n):m&&(o=m),console.log(o),t(e,s)}),s.reconnect_interval||3e3)}))}},s={install:t};export{n as WS_CONNECT_COUNT,r as createWebSocket,s as wsInstaller};
