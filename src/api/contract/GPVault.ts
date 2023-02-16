import { VAULT_CA } from '../../constants/contract'
import { Contract, ethers } from 'ethers'
import GPVaultABI from '../../abi/GPVaultABI.json'

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
const signer = provider.getSigner()

export const getVaultContract = async () => {
  const contract = new Contract(VAULT_CA, GPVaultABI, signer)
  return contract
}

export const donate = async (id: number, amount: number) => {
  const VaultContract = await getVaultContract()
  return VaultContract.donate(id, amount)
}
