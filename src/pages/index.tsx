import { useMetadata } from '../hook/query/campaign'
import { Box, Button, Chip, Skeleton, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import { Link } from 'react-router-dom'
import { getDonationList } from '../api/contract/GPService'
import { useEffect, useState } from 'react'
import Title from '../components/common/Title'
import { sponsorGp } from '../api/contract/GPVault'
import { IRawDonation } from '../interfaces'
import { BigNumber, Contract, ethers } from 'ethers'
import { USDC_CA, VAULT_CA } from '../constants/contract'
import ERC20ABI from '../abi/ERC20ABI.json'
import { useRecoilValue } from 'recoil'
import { accountState } from '../atom'

const HomePage = () => {
  const [state, setState] = useState<string[]>()
  const [donation, setDonation] = useState<IRawDonation[]>()
  const { data: metadata, isLoading } = useMetadata(state)

  useEffect(() => {
    getDonationList().then((res: IRawDonation[]) => {
      console.log(res)
      const arr: string[] = []
      for (let i = 0; i < res.length; i++) {
        arr.push(res[i].ipfsKey)
      }
      setDonation(res)
      setState(arr)
    })
  }, [])

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

  const account = useRecoilValue(accountState)

  const getGPT = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
    const signer = provider.getSigner()
    const usdcContract = new Contract(USDC_CA, ERC20ABI, signer)
    const amount = 1 * 10 ** 6 // 1개씩
    usdcContract.allowance(account, VAULT_CA).then((res: BigNumber) => {
      if (Number(res.toString()) < amount) {
        usdcContract.approve(VAULT_CA, amount).then(() => {
          sponsorGp(amount)
        })
      } else {
        sponsorGp(amount)
      }
    })
  }

  return (
    <>
      <Title
        rightSide={
          <Button onClick={getGPT} variant='contained'>
            Get 1GPT with 1USDC
          </Button>
        }
        subTitle='Vote for a campaign for a good donation culture. And donate to the campaign you want.'
      >
        Explore
      </Title>
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
                    mb: 1,
                  }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Chip
                    label={`${
                      o.add.canVote.toString() === '0'
                        ? 'voting'
                        : o.add.canVote.toString() === '1'
                        ? 'rejected'
                        : o.add.canVote.toString() === '2'
                        ? 'accepted'
                        : o.add.canVote.toString() === '3'
                        ? 'waiting'
                        : o.add.canVote.toString() === '4'
                        ? 'donating'
                        : o.add.canVote.toString() === '5'
                        ? 'failed'
                        : o.add.canVote.toString() === '6'
                        ? 'succeeded'
                        : o.add.canVote.toString() === '7'
                        ? 'completed'
                        : o.add.canVote.toString() === '8'
                        ? 'refunded'
                        : o.add.canVote.toString() === '9'
                        ? 'Unknown'
                        : ''
                    }`}
                    sx={{ mr: 1 }}
                  />
                  <Typography>{o.keyvalues?.title}</Typography>
                </Box>
                <Box
                  sx={{
                    mt: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography sx={{ mr: 1 }}>
                    👍 {o?.add.voteFor && Number(o?.add.voteFor) / 10 ** 18}
                  </Typography>
                  <Typography>
                    👎{' '}
                    {o?.add.voteAgainst &&
                      Number(o?.add.voteAgainst) / 10 ** 18}
                  </Typography>
                </Box>
              </Link>
            </Grid2>
          ))}
        </Grid2>
      )}
    </>
  )
}

export default HomePage
