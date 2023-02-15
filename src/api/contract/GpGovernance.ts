import { GOVERNANCE_CA } from '../../constants/contract'
import { Contract } from 'ethers'
import GPGovernanceABI from '../../abi/GPGovernanceABI.json'

export const GOVERNANCE_CONTRACT = new Contract(GOVERNANCE_CA, GPGovernanceABI)
export const GPGovernance = () => {
  const castVote = async (proposalId: number, support: 1 | 0) => {
    return await GOVERNANCE_CONTRACT.castVote(proposalId, support)
  }

  const state = async (proposalId: number) => {
    return await GOVERNANCE_CONTRACT.state(proposalId)
  }

  return { castVote, state }
}
