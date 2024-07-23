
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

# Basic Usage

``` ts
import { initMyws } from 'myws'

const mywsInstance = initMyws({
  open: ture,
  api: 'wss://server/some/path',
  // ...
})
```

# In Vue2

``` ts
import Vue from 'vue'
import { wsInstaller } from 'myws'

Vue.use(wsInstaller, {
  open: true,
  api: 'wss://server/some/path'
  // ...
})
```

# Options

| Key | Type | Default Value | Description  |
| :---: | :---: | :---: | :---:  |
| `open` | `boolean`, `string`, `number` | `true` | 是否开启 ws |
| `api` |  `string` | - |  ws 服务地址 |
| `protocols` |  `string`, `string[]` | `undefined` |  一个协议字符串或者一个包含协议字符串的数组。 |
| `heart_interval` |  `number` | `50000` | ws 心跳间隔，毫秒数。 |
| `heart_data` |  `() => any` | `undefined` | ws 心跳时传递的参数。 |
| `reconnect_interval` |  `number` | `3000` | ws 重连间隔，毫秒数。 |
| `reconnect_limit` |  `number` | `30` | 自动重连次数限制。|
| `reconnect_limit_msg` |  `string` | - | 超出重连次数时的提示文本。|
| `reconnect_msg` |  `string`, `(count: number) => string` | - | 每次尝试重连 ws 时的提示文本, 也可以是一个函数，该函数会被传入当前的重连计数。|
| `ws_bus_emit_names` |  `Record<string, string>` | - | 自定义在响应 ws 消息时，WsBus 的 emit 事件名。|
| `onmessage` |  `(data: any) => void` | - | 接收 message 时回调。|
| `onopen` |  `(e: Event) => void` | - | WebSocket 连接时回调。|
| `onerror` |  `(e: Event) => void` | - | WebSocket 出错时回调。|
| `onclose` |  `(e: Event) => void` | - | WebSocket 关闭时回调。|


# CHANGE LOGS

see [change logs](./CHANGELOG.md) here.


