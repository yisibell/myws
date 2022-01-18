import Options from './interface/options'
import { VueConstructor } from 'vue'
import defaultEmitNameMap from './defaultEmitNameMap'
import { CreateWebSocket, WsBusEmitter } from './interface'
import mitt from 'mitt'

// ws 重连计数
export let WS_CONNECT_COUNT = 0

// ws 重连事件名
const WS_RECONNECT_EMIT_NAME = 'ws_reconnect'

// ws 重连触发间隔
const WS_RECONNECT_INTERVAL = 3000

// 重连发布
const emitWsReconnect = (WsBus: WsBusEmitter, data: any) => {
  return WsBus.emit(WS_RECONNECT_EMIT_NAME, data)
}

// ws 创建函数
const createWebSocket: CreateWebSocket = (options: Options) => {
  const { heart_interval = 50000, api, open } = options

  const emitNameMap = options.vue_emit_name || defaultEmitNameMap()

  // create emitter instance
  const WsBus = mitt()

  let timer: any = null
  let isOpenWs: string | number | boolean = true

  try {
    isOpenWs = typeof open === 'string' ? JSON.parse(open) : open
  } catch (err) {
    isOpenWs = true
    console.error('the open property should be a truly value.')
  }

  if (isOpenWs && api) {
    const WS = new WebSocket(api)

    WS.onopen = function (e) {
      console.log('ws connected...')

      WS_CONNECT_COUNT = 0

      WsBus.emit(emitNameMap.onopen, e)

      WS.send('heart')

      clearInterval(timer)

      timer = setInterval(
        () => {
          WS.send('heart')
        },
        typeof heart_interval === 'string'
          ? Number.parseInt(heart_interval)
          : heart_interval
      )

      options.onopen && options.onopen(e)
    }

    WS.onmessage = function (e) {
      const json_data = JSON.parse(e.data)
      WsBus.emit(emitNameMap.onmessage, json_data)
      options.onmessage && options.onmessage(json_data)
    }

    WS.onerror = function (e) {
      console.log('ws error!')
      WsBus.emit(emitNameMap.onerror, e)
      clearInterval(timer)
      options.onerror && options.onerror(e)
    }

    WS.onclose = function (e) {
      console.log('ws closed!')
      emitWsReconnect(WsBus, e)
      WsBus.emit(emitNameMap.onclose, e)
      clearInterval(timer)
      options.onclose && options.onclose(e)
    }

    return { WS, WsBus }
  }
}

// ws 安装函数
const install = (Vue: VueConstructor, options: Options = {}) => {
  options.vue_emit_name = {
    ...defaultEmitNameMap(),
    ...options.vue_emit_name,
  }

  const $ws = createWebSocket(options)

  if (!$ws) return

  Vue.prototype.$ws = $ws
  const { WsBus } = $ws
  const { reconnect_limit = 30, reconnect_limit_msg, reconnect_msg } = options

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
      install(Vue, options)
    }, WS_RECONNECT_INTERVAL)
  })
}

// vue 2.x 插件安装器
const wsInstaller = {
  install,
}

export { wsInstaller, createWebSocket }
