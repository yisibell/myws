
<p align="center">
  <a href="https://www.npmjs.org/package/myws">
    <img src="https://img.shields.io/npm/v/myws.svg">
  </a>
  <a href="https://npmcharts.com/compare/myws?minimal=true">
    <img src="https://img.shields.io/npm/dm/myws.svg">
  </a>
  <br>
</p>


# myws

A tiny websocket client library.

- [Release Notes](./CHANGELOG.md).

# Features

- Automatically reconnect when websocket fails.
- Support event subscription mode, receive messages by listening to events.
- Support **Typescript**.

# Installation

```bash
# yarn
$ yarn add myws

# npm
$ npm i myws
```

# Usage

## Manual initialization

```ts
import { initMyws } from 'myws'

let $ws;

initMyws({}, (wsInstance) => {
  $ws = wsInstance
})
```

## In Vue projects

对于 在 `vue` 项目中使用 `WebSocket` 客户端服务，`myws` 做了特殊支持。你可以将 `myws` 作为 **Vue plugin** 进行使用。

为了规范化，请在你的项目中创建 `src/service/ws.js` 文件，该文件中用于存放该项目的 `WebSocket` 服务逻辑。

```js
// src/service/ws.js

import Vue from 'vue'
import { wsInstaller } from 'myws' // WebSocket 服务

// 一些常量可以放在环境变量中
const open = process.env.VUE_APP_WS_OPEN
const api = process.env.VUE_APP_WS_API
const heart_interval = process.env.VUE_APP_WS_INTERVAL

Vue.use(wsInstaller, {
  // 是否开启 ws，默认关闭。
  open,

  // ws 服务地址，必需。
  api,

  // ws 心跳间隔，毫秒数，默认 50000。
  heart_interval,

  /**
   * ws 重连间隔，毫秒数，默认 3000。
   */
  reconnect_interval: 3000,

  // 自动重连次数限制, Number, 默认 30。
  reconnect_limit: 30,

  // 超出重连次数时的提示文本。
  reconnect_limit_msg: '',

  // 每次尝试重连 ws 时的提示文本, 也可以是一个函数，该函数会被传入当前的重连计数。
  reconnect_msg: '',

  // 自定义在响应 ws 消息时，WsBus 的 emit 事件名。
  ws_bus_emit_names: {
    onopen: 'ws_open', // WsBus.on('ws_open', () => {})
    onmessage: 'ws_message', // WsBus.on('ws_message', () => {})
    onerror: 'ws_error',
    onclose: 'ws_close'
  },

  // 接收 message 时回调
  onmessage(data) {
    console.log(data)
    // 在这里你可以写一些特定的业务逻辑
    // 比如调用一个绑定客户端的接口，使得后端服务知道当前使用 WebSocket 服务的用户是谁。
    // ...
  },

  // WebSocket 连接时回调。
  onopen(e) {},

  // WebSocket 出错时回调。
  onerror(err) {},

  // WebSocket 关闭时回调。
  onclose(e) {}
})

```

然后在 `main.js` 中导入 `src/service/ws.js`。

```js
// main.js
import '@/service/ws'

// ...
```

这样，`WebSocket` 就会正常注册，并且在所有 `vue` 组件实例中你都可以接收到来自 `WebSocket` 服务发送的消息，像这样：

```html
<script>
  export default {
    mounted() {
      const { WsBus, WS } = this.$ws
      // 当前 WebSocket 实例
      // TIPS: 如果连接失败或者未开启，WS 将会是 undefined
      console.log(WS)

      WsBus.on('ws_message', (data) => {
        // 请保证后端发送的是 JSON 格式的数据，因为我们会在方法内部通过 `JSON.parse` 方法解析它。
        console.log(data)
      })
    },
  }
</script>
```


