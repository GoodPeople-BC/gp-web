import { SERVICE_CA } from '../../constants/contract'
import { Contract, ethers } from 'ethers'
import GPServiceABI from '../../abi/GPServiceABI.json'

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
const signer = provider.getSigner()

export const getServiceContract = async () => {
  const contract = new Contract(SERVICE_CA, GPServiceABI, signer)
  return contract
}

interface IBigNumber {
  _hex: string
  _isBigNumber: boolean
}

export const getTargetPeriods = async () => {
  const ServiceContract = await getServiceContract()
  const targetPeriods: IBigNumber[] = await ServiceContract.getTargetPeriods()
  const result: number[] = []
  targetPeriods.map((t) => {
    result.push(parseInt(t._hex))
  })
  return result
}

export const getTargetAmounts = async () => {
  const ServiceContract = await getServiceContract()
  const targetAmounts: IBigNumber[] = await ServiceContract.getTargetAmounts()
  const result: number[] = []
  targetAmounts.map((t) => {
    result.push(parseInt(t._hex))
  })
  return result
}

export const getDonationList = async () => {
  const ServiceContract = await getServiceContract()
  const donationList = ServiceContract.getDonationList()
  return donationList
}

export const getDonationBykey = async (id: string) => {
  const ServiceContract = await getServiceContract()
  const donationBykey = ServiceContract.getDonationBykey(id)
  return donationBykey
}

export const addDonationProposal = async (
  amount: string,
  period: string,
  address: string,
  ipfsKey: string
) => {
  const ServiceContract = await getServiceContract()
  return ServiceContract.addDonationProposal(amount, period, address, ipfsKey)
}

export const executeAddDonationProposal = async (donationId: string) => {
  const ServiceContract = await getServiceContract()
  return ServiceContract.executeAddDonationProposal(donationId)
}
