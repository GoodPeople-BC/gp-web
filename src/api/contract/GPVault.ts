import { VAULT_CA } from '../../constants/contract'
import { Contract, ethers } from 'ethers'
import GPVaultABI from '../../abi/GPVaultABI.json'

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
const signer = provider.getSigner()

export const getVaultContract = async () => {
  const contract = new Contract(VAULT_CA, GPVaultABI, signer)
  return contract
}

export const donate = async (id: string, amount: number) => {
  const VaultContract = await getVaultContract()
  return VaultContract.donate(id, amount)
}

export const sponsorGp = async (amount: number) => {
  const VaultContract = await getVaultContract()
  return VaultContract.sponsorGp(amount)
}

export const refund = async (donateId: string) => {
  const VaultContract = await getVaultContract()
  return VaultContract.refund(donateId)
}

export const claim = async (donateId: string) => {
  const VaultContract = await getVaultContract()
  return VaultContract.claim(donateId)
}
