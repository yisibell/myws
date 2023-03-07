import type Options from './interface/options'
import type { VueConstructor } from 'vue'
import { createWebSocket, WS_RECONNECT_EMIT_NAME } from './createWebsocket'
import defaultEmitNameMap from './defaultEmitNameMap'
import type { CreateWebSocketReturns } from './interface'

// ws 重连计数
export let WS_CONNECT_COUNT = 0

const setWsConnectCount = (count = 0) => {
  WS_CONNECT_COUNT = count
}

const initMyws = (
  options: Options,
  initCallback: (ws: CreateWebSocketReturns) => void
) => {
  options.ws_bus_emit_names = Object.assign(
    defaultEmitNameMap(),
    options.ws_bus_emit_names
  )

  const $ws = createWebSocket(options)

  if (!$ws) return

  const { WsBus } = $ws
  const { reconnect_limit = 30, reconnect_limit_msg, reconnect_msg } = options

  WsBus.on(options.ws_bus_emit_names.onopen, () => {
    setWsConnectCount(0)
  })

  WsBus.on(WS_RECONNECT_EMIT_NAME, () => {
    if (WS_CONNECT_COUNT > reconnect_limit) {
      const msg =
        reconnect_limit_msg ||
        `The number of ws reconnections has exceeded ${reconnect_limit}，you can refresh to reconnect the ws server!`

      console.warn(msg)
      return
    }

    setTimeout(() => {
      ++WS_CONNECT_COUNT

      let msg = `ws reconnect the ${WS_CONNECT_COUNT}th time ...`

      if (typeof reconnect_msg === 'function') {
        msg = reconnect_msg(WS_CONNECT_COUNT)
      } else if (reconnect_msg) {
        msg = reconnect_msg
      }

      console.log(msg)

      initMyws(options, initCallback)
    }, options.reconnect_interval || 3000)
  })

  initCallback($ws)

  return $ws
}

// ws 安装函数
const install = (Vue: VueConstructor, options: Options = {}) => {
  initMyws(options, (wsInstance) => {
    Vue.prototype.$ws = wsInstance
  })
}

// vue 2.x 插件安装器
const wsInstaller = {
  install,
}

export { wsInstaller, createWebSocket, initMyws }
