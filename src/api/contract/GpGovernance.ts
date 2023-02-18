import { GOVERNANCE_CA } from '../../constants/contract'
import { Contract, ethers } from 'ethers'
import GPGovernanceABI from '../../abi/GPGovernanceABI.json'

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
const signer = provider.getSigner()

export const getGovernanceContract = async () => {
  const contract = new Contract(GOVERNANCE_CA, GPGovernanceABI, signer)
  return contract
}

export const castVote = async (id: string, support: number) => {
  const GovernanceContract = await getGovernanceContract()
  return GovernanceContract.castVote(id, support)
}

export const getVotingBalance = async (proposalId: string, account: string) => {
  const GovernanceContract = await getGovernanceContract()
  const votingBalance = GovernanceContract.getVotingBalance(proposalId, account)
  return votingBalance
}
