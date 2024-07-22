import type { CreateWebSocket, WsBusEmitter } from './interface'
import mitt from 'mitt'
import defaultEmitNameMap from './defaultEmitNameMap'
import type Options from './interface/options'

// ws 重连事件名
export const WS_RECONNECT_EMIT_NAME = 'ws_reconnect'

// 重连发布
const emitWsReconnect = (WsBus: WsBusEmitter, data: any) => {
  return WsBus.emit(WS_RECONNECT_EMIT_NAME, data)
}

// ws 创建函数
const createWebSocket: CreateWebSocket = (options: Options) => {
  const { heart_interval = 50000, api, open } = options

  const emitNameMap = options.ws_bus_emit_names || defaultEmitNameMap()

  // create emitter instance
  const WsBus = mitt()

  let heartTimer: number = 0
  let isOpenWs: string | number | boolean = true

  try {
    isOpenWs = typeof open === 'string' ? JSON.parse(open) : open
  } catch (err) {
    isOpenWs = true
    console.error('the open property should be a truly value.')
  }

  if (isOpenWs && api) {
    const WS = new WebSocket(api, options.protocols)

    WS.onopen = function (e) {
      console.log('ws connected...')

      WsBus.emit(emitNameMap.onopen, e)

      options.onopen && options.onopen(e)

      const heartData = options.heart_data ? options.heart_data() : 'heart'

      WS.send(heartData)

      clearInterval(heartTimer)

      heartTimer = setInterval(() => {
        WS.send(heartData)
      }, +heart_interval)
    }

    WS.onmessage = function (e) {
      const json_data = JSON.parse(e.data)
      WsBus.emit(emitNameMap.onmessage, json_data)
      options.onmessage && options.onmessage(json_data)
    }

    WS.onerror = function (e) {
      console.log('ws error!')
      WsBus.emit(emitNameMap.onerror, e)
      clearInterval(heartTimer)
      options.onerror && options.onerror(e)
    }

    WS.onclose = function (e) {
      console.log('ws closed!')
      emitWsReconnect(WsBus, e)
      WsBus.emit(emitNameMap.onclose, e)
      clearInterval(heartTimer)
      options.onclose && options.onclose(e)
    }

    return { WS, WsBus }
  }

  return { WsBus }
}

export { createWebSocket }
