import { BigNumber } from 'ethers'

export interface IRawVote {
  canVote: BigNumber
  createdTime: BigNumber
  donateId: BigNumber
  proposalId: BigNumber
  voteFor: BigNumber
  voteAgainst: BigNumber
  period: BigNumber
}

export interface IRawDonation {
  add: IRawVote
  currentAmount: BigNumber
  end: BigNumber
  ipfsKey: string
  maxAmount: BigNumber
  start: BigNumber
}
