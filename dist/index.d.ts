import { VueConstructor } from 'vue';
import { Emitter } from 'mitt';

interface EmitNameMap {
  onopen: string
  onmessage: string
  onerror: string
  onclose: string
}

interface Options {
  /**
   * 是否开启 ws
   */
  open?: boolean | string | number

  /**
   * ws 服务地址，必需。
   */
  api?: string

  /**
   * ws 心跳间隔，毫秒数，默认 50000。
   */
  heart_interval?: number

  /**
   * 自动重连次数限制, 默认 30。
   */
  reconnect_limit?: number

  /**
   * 超出重连次数时的提示文本。
   */
  reconnect_limit_msg?: string

  /**
   * 每次尝试重连 ws 时的提示文本, 也可以是一个函数，该函数会被传入当前的重连计数。
   */
  reconnect_msg?: string | ((wsConnectCount: number) => string)

  /**
   * 在响应 ws 消息时，向 vue 实例注入的 $emit 事件名，
   * 一旦修改，则 4 个名称都需要修改。
   */
  vue_emit_name?: EmitNameMap

  /**
   * 接收 message 时回调
   * 在这里你可以写一些特定的业务逻辑
   * 比如调用一个绑定客户端的接口，使得后端服务知道当前使用 WebSocket 服务的用户是谁。
   */
  onmessage?: (data: any) => void

  /**
   * WebSocket 连接时回调。
   */
  onopen?: (e: Event) => void

  /**
   * WebSocket 出错时回调。
   */
  onerror?: (e: Event) => void

  /**
   * WebSocket 关闭时回调。
   */
  onclose?: (e: Event) => void
}

type WsBusEvents = {
  ws_open?: any
  ws_message?: any
  ws_error?: any
  ws_close?: any
  ws_reconnect?: any
}

type WsBusEmitter = Emitter<WsBusEvents>

interface CreateWebSocketReturns {
  WS: WebSocket
  WsBus: WsBusEmitter
}

declare const wsInstaller: {
  install: (Vue: VueConstructor, options: Options) => void
}

declare function createWebSocket(
  options: Options
): CreateWebSocketReturns | undefined

export { createWebSocket, wsInstaller };
