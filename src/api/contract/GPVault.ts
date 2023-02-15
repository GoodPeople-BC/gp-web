import { VAULT_CA } from '../../constants/contract'
import { Contract } from 'ethers'
import GPVaultABI from '../../abi/GPVaultABI.json'

const VAULT_CONTRACT = new Contract(VAULT_CA, GPVaultABI)
export const GPVault = () => {
  const donate = async (id: number, amount: number) => {
    return await VAULT_CONTRACT.donate(id, amount)
  }

  const sponserGp = async () => {
    return await VAULT_CONTRACT.sponserGp()
  }

  const claim = async () => {
    return await VAULT_CONTRACT.claim()
  }

  return { donate, sponserGp, claim }
}
