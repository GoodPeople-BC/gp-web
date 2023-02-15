import { atom } from 'recoil'
import { v1 } from 'uuid'

const openDrawerState = atom<boolean>({
  key: `openDrawerState${v1()}`,
  default: true,
})

const accountState = atom<string>({
  key: `accountState${v1()}`,
  default: '0x00',
})

const chainIdState = atom<number>({
  key: `chainIdState${v1()}`,
  default: 0,
})

export { openDrawerState, accountState, chainIdState }
