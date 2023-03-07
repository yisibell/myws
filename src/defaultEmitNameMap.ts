import type { EmitNameMap } from './interface/options'

const defaultEmitNameMap: () => EmitNameMap = () => ({
  onopen: 'ws_open',
  onmessage: 'ws_message',
  onerror: 'ws_error',
  onclose: 'ws_close',
})

export default defaultEmitNameMap
