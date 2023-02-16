import { useMetadata } from '../hook/query/campaign'
import { Box, Skeleton, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import { Link } from 'react-router-dom'
import { getDonationList } from '../api/contract/GPService'
import { useEffect, useState } from 'react'
import { IGetMetadataResp } from '../api/interface'
import { BigNumber } from 'ethers'

// todo: 컨트랙트 데이터에서 ipfsKey만 뽑아서 배열로 만들어서 전달하기
// todo: 얻어온 metadata의 name과 컨트랙트 데이터의 ipfsKey를 매핑한 데이터를 화면에 보여주기
const HomePage = () => {
  // interface BigNumber {
  //   _hex: string
  //   _isBigNumber: boolean
  // }

  interface IDonation {
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

  const [state, setState] = useState<string[]>()
  const [donation, setDonation] = useState<IDonation[]>()

  useEffect(() => {
    getDonationList().then((res: IDonation[]) => {
      const arr: string[] = []
      for (let i = 0; i < res.length; i++) {
        arr.push(res[i].ipfsKey)
      }
      setDonation(res)
      setState(arr)
    })
  }, [])

  const { data: metadata, isLoading } = useMetadata(state)
  function merge() {
    const arr = []
    const donationLength = donation?.length ?? 0
    for (let i = 0; i < donationLength; i++) {
      if (metadata !== undefined && donation !== undefined) {
        const d1 = { ...metadata[i], ...donation[i] }
        arr.push(d1)
      }
    }
    return arr
  }

  return (
    <>
      {isLoading ? (
        <Grid2 container columns={12} spacing={2}>
          {Array.from({ length: 6 }, () => (
            <Grid2 xs={12} md={4}>
              <Skeleton
                sx={{
                  borderRadius: 2,
                }}
                variant='rectangular'
                height={300}
              />
            </Grid2>
          ))}
        </Grid2>
      ) : (
        <Grid2 container columns={12} spacing={2}>
          {merge()?.map((o, i) => (
            <Grid2 key={i} xs={12} md={4}>
              <Link to={`/campaign/${o.name}`}>
                <Box
                  sx={{
                    borderRadius: 2,
                    backgroundImage: `url(${o.keyvalues?.mainImg})`,
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover',
                    height: '300px',
                  }}
                />
                <Typography sx={{ mt: 1, textAlign: 'center' }}>
                  {o.keyvalues?.title}
                </Typography>
                <Typography sx={{ mt: 1, textAlign: 'center' }}>
                  {o.add.voteAgainst.toString()}
                </Typography>
                <Typography sx={{ mt: 1, textAlign: 'center' }}>
                  {o.add.voteFor.toString()}
                </Typography>
                <Typography sx={{ mt: 1, textAlign: 'center' }}>
                  {o.add.canVote.toString()}
                </Typography>
              </Link>
            </Grid2>
          ))}
        </Grid2>
      )}
    </>
  )
}

export default HomePage
