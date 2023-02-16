interface BigNumber {
  _hex: string
  _isBigNumber: boolean
}
export interface IDonation {
  abort: {
    canVote: BigNumber
    createTiem: BigNumber
    donateId: BigNumber
    period: BigNumber
    proposalId: BigNumber
    voteAgainst: BigNumber
    voteFor: BigNumber
  }
  add: {
    canVote: BigNumber
    createTiem: BigNumber
    donateId: BigNumber
    period: BigNumber
    proposalId: BigNumber
    voteAgainst: BigNumber
    voteFor: BigNumber
  }
  currentAmount: BigNumber
  hasAbort: boolean
  ipfsKey: string
  maxAmount: BigNumber
}
