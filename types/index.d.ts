import type { VueConstructor } from 'vue'
import type { Options } from '../src/interface/options'
import type { CreateWebSocketReturns } from '../src/interface'

declare const wsInstaller: {
  install: (Vue: VueConstructor, options: Options) => void
}

declare function initMyws(options: Options): CreateWebSocketReturns

declare function createWebSocket(options: Options): CreateWebSocketReturns

export { wsInstaller, createWebSocket, initMyws, CreateWebSocketReturns }
