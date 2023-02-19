import styled from '@emotion/styled'
import { useParams } from 'react-router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { addReview } from '../../api/CampaignAPI'
import BaseInput, { InputType } from '../../components/Form/BaseInput'
import { useEffect, useMemo, useState } from 'react'
import { useMetadataByName } from '../../hook/query/campaign'
import { IGetMetadataByNameResp } from '../../api/interface'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Divider,
  InputAdornment,
  LinearProgress,
  linearProgressClasses,
  Skeleton,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { autoPlay } from 'react-swipeable-views-utils'
import SwipeableViews from 'react-swipeable-views'
import {
  executeAddDonationProposal,
  getDonationBykey,
} from '../../api/contract/GPService'
import { BigNumber, Contract, ethers } from 'ethers'
import { useRecoilValue } from 'recoil'
import { accountState } from '../../atom'
import ERC20ABI from '../../abi/ERC20ABI.json'
import { claim, donate, refund } from '../../api/contract/GPVault'
import { USDC_CA, VAULT_CA } from '../../constants/contract'
import {
  castVote,
  getVotingBalance,
  hasVoted,
} from '../../api/contract/GpGovernance'
import Title from '../../components/common/Title'
import { IRawDonation, IRawVote } from '../../interfaces'
import RemainingTime from '../../components/RemainingTime'
import VotingTime from '../../components/VotingTime'
import * as Big from 'bignumber.js'

enum DonationStatus {
  False,
  Voting, // 0
  VoteDefeated, // 1
  VoteSucceeded, // 2
  DonateWaiting, // 3
  Donating, // 4
  DonateDefeated, // 5
  DonateSucceeded, // 6
  DonateComplete, // 7
  DonateRefunded, // 8
  Unknown, // 9
}

interface IProcessedVote {
  status: number
  createdAt: string
  donateId: string
  proposalId: string
  voteYes: string
  voteNo: string
  period: string
}

interface IConvertedDonation {
  add: IProcessedVote
  currentAmount: number
  end: number
  ipfsKey: string
  maxAmount: number
  start: number
}

type Inputs = {
  contents: string
  img1: FileList
  img2: FileList
  img3: FileList
}

type InputsKey = keyof Inputs

interface IDetaileForm {
  name: InputsKey
  type: InputType
  label: string
  multiline?: boolean
  defaultValue?: string
}

const detailForm: IDetaileForm[] = [
  {
    name: 'contents',
    type: 'text',
    label: 'contents',
    multiline: true,
    defaultValue: '',
  },
  {
    name: 'img1',
    type: 'file',
    label: 'Image 1',
  },
  {
    name: 'img2',
    type: 'file',
    label: 'Image 2',
  },
  {
    name: 'img3',
    type: 'file',
    label: 'Image 3',
  },
]

interface DonationInput {
  amount: string
}

const AutoPlaySwipeableViews = autoPlay(SwipeableViews)

const CampaignDetail = () => {
  const { id } = useParams()
  const [activeStep, setActiveStep] = useState(0)
  const [donation, setDonation] = useState<IConvertedDonation>()
  const theme = useTheme()

  // useQuery
  const { data, isLoading } = useMetadataByName(id as string)

  // useMemo
  const metadata: IGetMetadataByNameResp | undefined = useMemo(() => {
    return data
  }, [data])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      contents: '',
      img1: undefined,
      img2: undefined,
      img3: undefined,
    },
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData()
    formData.append('contents', data.contents)
    formData.append('img1', data.img1[0])
    formData.append('img2', data.img2[0])
    formData.append('img3', data.img3[0])

    await addReview(id as string, formData).catch((err) => {
      alert(err)
    })
  }

  const convertVote = (rawVote: IRawVote) => {
    return {
      status: rawVote.canVote.toNumber() + 1,
      createdAt: rawVote.createdTime.toString(),
      donateId: rawVote.donateId.toString(),
      proposalId: rawVote.proposalId.toString(), // bignumber 이슈로 string으로 변경
      voteYes: rawVote.voteFor.toString(),
      voteNo: rawVote.voteAgainst.toString(),
      period: rawVote.period.toString(),
    }
  }

  const convertDonation = (res: IRawDonation) => {
    return {
      add: convertVote(res.add),
      currentAmount: res.currentAmount.toNumber(),
      maxAmount: res.maxAmount.toNumber(),
      ipfsKey: res.ipfsKey,
      start: res.start.toNumber(),
      end: res.end.toNumber(),
    }
  }

  useEffect(() => {
    id &&
      getDonationBykey(id).then((res) => {
        setDonation(convertDonation(res))
      })
  }, [id])

  const { register: donationRegister, handleSubmit: handleDonationSubmit } =
    useForm<DonationInput>({
      defaultValues: { amount: '' },
    })

  const account = useRecoilValue(accountState)

  const onDonationSubmit = async (data: any) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
    const signer = provider.getSigner()
    const usdcContract = new Contract(USDC_CA, ERC20ABI, signer)
    const amount = new Big.BigNumber(data.amount * 10 ** 6)
    let allowance = new Big.BigNumber(0)
    allowance = await usdcContract
      .allowance(account, VAULT_CA)
      .then((res: BigNumber) => {
        return new Big.BigNumber(res.toString())
      })
    if (amount.comparedTo(allowance) !== 1) {
      donate(donation!.add.donateId, Number(amount))
    } else {
      usdcContract.approve(VAULT_CA, Number(amount))
      const timer = setInterval(async () => {
        allowance = await usdcContract
          .allowance(account, VAULT_CA)
          .then((res: BigNumber) => {
            return new Big.BigNumber(res.toString())
          })
        if (amount.comparedTo(allowance) !== 1) {
          donate(donation!.add.donateId, Number(amount))
          clearInterval(timer)
        }
      }, 2000)
    }
    // const amount = data.amount * 10 ** 6
    // const delay = (time: number) => {
    //   return new Promise((res) => setTimeout(res, time))
    // }
    // usdcContract.approve(VAULT_CA, amount).then(async () => {
    //   for (let i = 0; i < 30; i++) {
    //     const allowance = await usdcContract.allowance(account, VAULT_CA)
    //     if (allowance.toString() >= amount) {
    //       donate(donation!.add.donateId, amount)
    //       return
    //     } else {
    //       await delay(1000)
    //     }
    //   }
    // })
  }

  const onClickVote = (support: number) => {
    if (!donation?.add.proposalId) return
    castVote(donation?.add.proposalId, support)
  }

  const [votingBalance, setVotingBalance] = useState(0)
  const [voted, setVoted] = useState(false)

  useEffect(() => {
    if (!donation?.add.proposalId) return
    getVotingBalance(donation?.add.proposalId, account).then(
      (res: BigNumber) => {
        setVotingBalance(Number(res.toString()) / 10 ** 18)
      }
    )
    hasVoted(donation?.add.proposalId, account).then((res: boolean) => {
      setVoted(res)
    })
  }, [account, donation])

  return (
    <>
      {!metadata || !donation ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Title
            subTitle={`receipient: ${metadata?.writerAddress}`}
            rightSide={
              <Box sx={{ display: 'flex' }}>
                <Typography sx={{ mr: 1 }}>
                  👍{' '}
                  {donation?.add.voteYes &&
                    Number(donation?.add.voteYes) / 10 ** 18}
                </Typography>
                <Typography>
                  👎{' '}
                  {donation?.add.voteNo &&
                    Number(donation?.add.voteNo) / 10 ** 18}
                </Typography>
              </Box>
            }
          >
            {metadata ? metadata.title : ''}
          </Title>

          {/* state 상관없이 제공할 기부 관련 데이터 */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              margin: '0 auto',
            }}
          >
            {isLoading ? (
              <Skeleton
                variant='rectangular'
                width={300}
                height={300}
                sx={{ borderRadius: 2 }}
              />
            ) : (
              <AutoPlaySwipeableViews
                interval={3000}
                autoPlay={false}
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                // onChangeIndex={handleStepChange}
                enableMouseEvents
                style={{
                  width: '300px',
                }}
              >
                {metadata &&
                  metadata.imgs.map((o, index) => (
                    <div key={index}>
                      {Math.abs(activeStep - index) <= 2 ? (
                        <Box
                          component='img'
                          src={o}
                          sx={{
                            backgroundSize: 'contain',
                            backgroundPosition: 'center center',
                            borderRadius: 2,
                          }}
                          width={300}
                          height={300}
                        />
                      ) : null}
                    </div>
                  ))}
              </AutoPlaySwipeableViews>
            )}
            <Box sx={{ my: 2 }}>
              <Box width={300} sx={{ m: '0 auto', mb: 2 }}>
                <Typography>
                  Goal Amount:{' '}
                  {(donation.maxAmount / 10 ** 6).toLocaleString('en')} USDC
                </Typography>
                <Typography>
                  Period: {(donation.end - donation.start) / 24 / 60 / 60 - 1}{' '}
                  days
                </Typography>
              </Box>
              <Typography sx={{ mb: 1 }}>{metadata?.description}</Typography>
              {donation?.add.status && (
                <>
                  {donation.add.status === DonationStatus.Voting ? (
                    <>
                      <VotingTime
                        timeLock={Number(donation.add.createdAt)}
                        period={Number(donation.add.period)}
                      />
                    </>
                  ) : (
                    <>
                      {donation.add.status !== DonationStatus.VoteSucceeded &&
                        donation.add.status !== DonationStatus.VoteDefeated &&
                        donation.add.status !== DonationStatus.DonateWaiting &&
                        donation.add.status !==
                          DonationStatus.DonateRefunded && (
                          <>
                            <BorderLinearProgress
                              variant='determinate'
                              value={
                                donation.add.status ===
                                DonationStatus.DonateComplete
                                  ? 100
                                  : (Number(donation?.currentAmount) /
                                      Number(donation?.maxAmount)) *
                                    100
                              }
                            />
                            <Typography sx={{ textAlign: 'right' }}>
                              {donation.add.status ===
                              DonationStatus.DonateComplete
                                ? (
                                    donation?.maxAmount /
                                    10 ** 6
                                  ).toLocaleString('en')
                                : donation?.currentAmount
                                ? (
                                    donation?.currentAmount /
                                    10 ** 6
                                  ).toLocaleString('en')
                                : 0}{' '}
                              /
                              {donation?.maxAmount &&
                                (donation?.maxAmount / 10 ** 6).toLocaleString(
                                  'en'
                                )}{' '}
                              USDC
                            </Typography>
                          </>
                        )}
                    </>
                  )}
                  {donation.add.status === DonationStatus.Donating && (
                    <RemainingTime end={donation.end} />
                  )}
                </>
              )}
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {donation?.add.status && (
              <>
                {donation.add.status === DonationStatus.Voting && (
                  <Box>
                    <Typography>Voting Power: {votingBalance}</Typography>
                    {voted ? (
                      <Typography>You've already voted.</Typography>
                    ) : (
                      <ButtonGroup variant='contained'>
                        <Button onClick={() => onClickVote(1)}>
                          👍 like (
                          {donation?.add.voteYes &&
                            Number(donation?.add.voteYes) / 10 ** 18}
                          )
                        </Button>
                        <Button onClick={() => onClickVote(0)}>
                          👎 dislike(
                          {donation?.add.voteYes &&
                            Number(donation?.add.voteNo) / 10 ** 18}
                          )
                        </Button>
                      </ButtonGroup>
                    )}
                  </Box>
                )}
                {donation.add.status === DonationStatus.VoteDefeated && (
                  <div>
                    VoteDefeated: Agenda that didn't pass the governance vote.
                  </div>
                )}
                {donation.add.status === DonationStatus.VoteSucceeded && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ mb: 2 }}>
                      The agenda was accepted by the governance vote. Click the
                      button below to start donating.
                    </Typography>
                    <Button
                      variant='contained'
                      onClick={() => {
                        executeAddDonationProposal(donation.add.donateId)
                      }}
                    >
                      execute donation
                    </Button>
                  </Box>
                )}
                {donation.add.status === DonationStatus.DonateWaiting && (
                  <div>DonateWaiting...</div>
                )}
                {donation.add.status === DonationStatus.Donating && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ mb: 1 }}>
                      Donations are available.
                    </Typography>
                    <DonationForm
                      onSubmit={handleDonationSubmit(onDonationSubmit)}
                    >
                      <TextField
                        required
                        type='number'
                        label='amount'
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>USDC</InputAdornment>
                          ),
                        }}
                        {...donationRegister('amount', { required: true })}
                      />
                      <LoadingButton
                        variant='contained'
                        sx={{
                          ml: 2,
                          color: '#ffffff',
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                        }}
                        type='submit'
                      >
                        Donate
                      </LoadingButton>
                    </DonationForm>
                  </Box>
                )}
                {donation.add.status === DonationStatus.DonateDefeated && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ mb: 1 }}>
                      The target donation was not collected during the donation
                      period. Click the button below so that the donation can be
                      refunded.
                    </Typography>
                    <Button
                      onClick={() => {
                        refund(donation.add.donateId)
                      }}
                    >
                      refund
                    </Button>
                  </Box>
                )}
                {donation.add.status === DonationStatus.DonateSucceeded && (
                  <>
                    <div>
                      Target donation amount has been achieved within the
                      period. Please press the button below to receive it.
                    </div>
                    <Button
                      onClick={() => {
                        claim(donation.add.donateId)
                      }}
                    >
                      Claim
                    </Button>
                  </>
                )}
                {donation.add.status === DonationStatus.DonateComplete && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography sx={{ mb: 1 }}>
                        The donation was successfully completed and the
                        recipient received the donation.
                      </Typography>
                      {metadata?.reviewContents && (
                        <Box sx={{ display: 'flex', margin: '0 auto' }}>
                          <AutoPlaySwipeableViews
                            interval={3000}
                            autoPlay={false}
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={activeStep}
                            enableMouseEvents
                            style={{
                              width: '250px',
                              marginRight: '10px',
                            }}
                          >
                            {metadata?.reviewImgs &&
                              metadata.reviewImgs.map((o, index) => (
                                <div key={index}>
                                  {Math.abs(activeStep - index) <= 2 ? (
                                    <Box
                                      component='img'
                                      src={o}
                                      sx={{
                                        backgroundSize: 'contain',
                                        backgroundPosition: 'center center',
                                        borderRadius: 2,
                                      }}
                                      width={250}
                                      height={250}
                                    />
                                  ) : null}
                                </div>
                              ))}
                          </AutoPlaySwipeableViews>
                          <div>{metadata?.reviewContents}</div>
                        </Box>
                      )}
                    </Box>
                    {metadata?.writerAddress &&
                      metadata.writerAddress === account && (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mt: 5,
                          }}
                        >
                          <Typography sx={{ mb: 1 }}>
                            Please share your review after receiving the
                            donation.
                          </Typography>
                          <Form onSubmit={handleSubmit(onSubmit)}>
                            {detailForm.map((data) => (
                              <BaseInput
                                key={data.label}
                                name={data.name}
                                type={data.type as InputType}
                                label={data.label}
                                multiline={data.multiline || false}
                                defaultValue={data.defaultValue}
                                register={register(data.name as InputsKey)}
                              />
                            ))}
                            <LoadingButton
                              variant='contained'
                              sx={{
                                mt: 3,
                                color: '#ffffff',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                              }}
                              type='submit'
                            >
                              Submit
                            </LoadingButton>
                          </Form>
                        </Box>
                      )}
                  </Box>
                )}
                {donation.add.status === DonationStatus.DonateRefunded && (
                  <Typography>
                    The donation was returned because the donation failed.
                  </Typography>
                )}
                {donation.add.status === DonationStatus.Unknown && (
                  <div>Unknown...</div>
                )}
              </>
            )}
          </Box>
        </>
      )}
    </>
  )
}

export default CampaignDetail

const DonationForm = styled.form`
  display: flex;
  align-items: stretch;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: 'lightgray',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: 'gray',
  },
}))
