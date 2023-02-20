import { TOKEN_CA } from '../../constants/contract'
import { Contract } from 'ethers'
import GPTokenABI from '../../abi/GPTokenABI.json'

const TOKEN_CONTRACT = new Contract(TOKEN_CA, GPTokenABI)
export const GPToken = () => {
  const example = async () => {
    return await TOKEN_CONTRACT.example()
  }

  return { example }
}
