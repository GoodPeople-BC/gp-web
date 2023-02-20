import { useMetadata } from '../hook/query/campaign'
import { Box, Button, Chip, Skeleton, Tooltip, Typography } from '@mui/material'
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
import * as Big from 'bignumber.js'

enum Status {
  'voting',
  'rejected',
  'accepted',
  'waiting',
  'donating',
  'failed',
  'succeeded',
  'completed',
  'refunded',
  'Unknown',
}

const HomePage = () => {
  const [state, setState] = useState<string[]>()
  const [donation, setDonation] = useState<IRawDonation[]>()
  const account = useRecoilValue(accountState)

  const { data: metadata, isLoading } = useMetadata(state)

  // get data from contract
  useEffect(() => {
    getDonationList().then((res: IRawDonation[]) => {
      const newRes = [...res]
      const reverseUniqueRes = newRes
        .reverse()
        .filter((v, i, a) => a.map((e) => e.ipfsKey).indexOf(v.ipfsKey) === i)
      const uniqueRes = reverseUniqueRes.reverse()
      setDonation(uniqueRes)
      const arr: string[] = []
      for (let i = 0; i < uniqueRes.length; i++) {
        arr.push(uniqueRes[i].ipfsKey)
      }
      setState(arr)
    })
  }, [])

  // merge contract data and ipfs data
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

  // get gpt with usdc
  const getGPT = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
    const signer = provider.getSigner()
    const usdcContract = new Contract(USDC_CA, ERC20ABI, signer)
    const amount = new Big.BigNumber(1 * 10 ** 6)
    let allowance = new Big.BigNumber(0)
    allowance = await usdcContract
      .allowance(account, VAULT_CA)
      .then((res: BigNumber) => {
        return new Big.BigNumber(res.toString())
      })
    if (amount.comparedTo(allowance) !== 1) {
      sponsorGp(Number(amount))
    } else {
      usdcContract.approve(VAULT_CA, Number(amount))
      const timer = setInterval(async () => {
        allowance = await usdcContract
          .allowance(account, VAULT_CA)
          .then((res: BigNumber) => {
            return new Big.BigNumber(res.toString())
          })
        if (amount.comparedTo(allowance) !== 1) {
          sponsorGp(Number(amount))
          clearInterval(timer)
        }
      }, 2000)
    }
  }

  return (
    <>
      <Title
        rightSide={
          <Tooltip
            title={
              <Typography sx={{ px: 1, fontSize: 12 }}>
                You can get 1 GPT for each donation of 1 USDC to Good People.
              </Typography>
            }
            arrow
            placement='top'
          >
            <Button onClick={getGPT} variant='contained'>
              Get 1GPT with 1USDC
            </Button>
          </Tooltip>
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
                    label={Status[o.add.canVote.toNumber()]}
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
