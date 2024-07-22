export interface EmitNameMap {
  onopen: any
  onmessage: any
  onerror: any
  onclose: any
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
   * 一个协议字符串或者一个包含协议字符串的数组。
   */
  protocols?: string | string[]

  /**
   * ws 心跳间隔，毫秒数，默认 50000。
   */
  heart_interval?: number

  /**
   * ws 重连间隔，毫秒数，默认 3000。
   */
  reconnect_interval?: number

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
   * 自定义在响应 ws 消息时，WsBus 的 emit 事件名
   */
  ws_bus_emit_names?: EmitNameMap

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

export default Options
