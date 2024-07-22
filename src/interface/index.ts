import type { Options } from './options'
import type { Emitter } from 'mitt'

export type WsBusEvents = {
  ws_open?: any
  ws_message?: any
  ws_error?: any
  ws_close?: any
  ws_reconnect?: any
}

export type WsBusEmitter = Emitter<WsBusEvents>

export interface CreateWebSocketReturns {
  WsBus: WsBusEmitter
  WS?: WebSocket
}

export type CreateWebSocket = (
  options: Options,
) => CreateWebSocketReturns | undefined
