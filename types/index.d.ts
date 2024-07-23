import type { VueConstructor } from 'vue'
import type { Options } from '../src/interface/options'
import type { InitMywsFunction, CreateWebSocketReturns } from '../src/interface'

declare const wsInstaller: {
  install: (Vue: VueConstructor, options: Options) => void
}

declare const initMyws: InitMywsFunction

declare function createWebSocket(options: Options): CreateWebSocketReturns

export { wsInstaller, createWebSocket, initMyws, CreateWebSocketReturns }
