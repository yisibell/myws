import { VueConstructor } from 'vue'
import Options from '../src/interface/options'
import { CreateWebSocketReturns } from '../src/interface'

declare const wsInstaller: {
  install: (Vue: VueConstructor, options: Options) => void
}

declare function createWebSocket(
  options: Options
): CreateWebSocketReturns | undefined

export { wsInstaller, createWebSocket }
