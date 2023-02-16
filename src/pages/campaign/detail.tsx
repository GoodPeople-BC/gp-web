import styled from '@emotion/styled'
import { useParams } from 'react-router'
import { SubmitHandler, useForm } from 'react-hook-form'

import { addReview } from '../../api/CampaignAPI'
import BaseInput, { InputType } from '../../components/Form/BaseInput'
import { useEffect, useMemo, useState } from 'react'
import { useMetadataByName } from '../../hook/query/campaign'
import { IGetMetadataByNameResp } from '../../api/interface'
import { LoadingButton } from '@mui/lab'
import { Box, Skeleton, Typography, useTheme, Button } from '@mui/material'
import { autoPlay } from 'react-swipeable-views-utils'
import SwipeableViews from 'react-swipeable-views'
import {
  getDonationBykey,
  abortDonationProposal,
} from '../../api/contract/GPService'
import { BigNumber } from 'ethers'

type Inputs = {
  contents: string
  img1: FileList
  img2: FileList
  img3: FileList
}

type InputsKey = keyof Inputs

interface IRadioValue {
  label: string
  value: string
}

interface IDetaileForm {
  name: InputsKey
  type: InputType
  label: string
  multiline?: boolean
}

const defailForm: IDetaileForm[] = [
  {
    name: 'contents',
    type: 'text',
    label: 'contents',
    multiline: true,
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

// 기부 상세 페이지 (후기 작성)
const AutoPlaySwipeableViews = autoPlay(SwipeableViews)

const CampaignDetail = () => {
  // 기부글 등록 시 리턴된 unique key로 기부 상세 dynamic routing
  // /campaign/${uniqueKey}로 접속하여 테스트 가능
  const { id } = useParams()

  // useQuery
  const { data, isLoading } = useMetadataByName(id as string)
  // useMemo
  const metadata: IGetMetadataByNameResp | undefined = useMemo(() => {
    return data
  }, [data])

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

  const [activeStep, setActiveStep] = useState(0)
  const [donation, setDonation] = useState<IDonation>()
  const theme = useTheme()

  const maxSteps = 3

  const handleReportClick = () => {
    if (donation !== undefined) {
      console.log(donation.add.donateId.toString())
      abortDonationProposal(donation.add.donateId.toString()).then((res) =>
        console.log(res)
      )
    }
  }

  const handleVoteFor = () => {
    if (donation !== undefined) {
      alert('clicked for')
    }
  }

  const handleVoteAgainst = () => {
    if (donation !== undefined) {
      alert('clicked against')
    }
  }

  const checkAbortProposal = () => {
    if (donation !== undefined) {
      return donation.hasAbort
    }
    return false
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleStepChange = (step: number) => {
    setActiveStep(step)
  }

  useEffect(() => {
    id && getDonationBykey(id).then((res) => setDonation(res))
  }, [id])

  return (
    <>
      <Box sx={{ display: 'flex', margin: '0 auto' }}>
        {isLoading ? (
          <Skeleton
            variant='rectangular'
            width={250}
            height={250}
            sx={{ borderRadius: 2 }}
          />
        ) : (
          <AutoPlaySwipeableViews
            interval={3000}
            autoPlay={false}
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
            style={{
              width: '250px',
              marginRight: '10px',
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
                      width={250}
                      height={250}
                    />
                  ) : null}
                </div>
              ))}
          </AutoPlaySwipeableViews>
        )}
        <Box width={400}>
          <Typography>{metadata?.writerAddress}</Typography>
          <Typography variant='h6'>{metadata?.title}</Typography>
          <p>{metadata?.description}</p>
        </Box>
      </Box>
      <Box>
        <Button
          variant='contained'
          onClick={handleReportClick}
          disabled={checkAbortProposal()}
        >
          Report
        </Button>

        <Button
          variant='contained'
          onClick={handleVoteFor}
          disabled={!checkAbortProposal()}
        >
          voteFor
        </Button>

        <Button
          variant='contained'
          onClick={handleVoteAgainst}
          disabled={!checkAbortProposal()}
        >
          voteAgainst
        </Button>
      </Box>
      <Box sx={{ display: 'flex', margin: '0 auto' }}>
        <div>{metadata?.reviewContents}</div>
      </Box>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {defailForm.map((data) => (
          <BaseInput
            key={data.label}
            name={data.name}
            type={data.type as InputType}
            label={data.label}
            multiline={data.multiline || false}
            register={register(data.name as InputsKey)}
          />
        ))}
        {/* // TODO 체크박스 */}
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
    </>
  )
}

export default CampaignDetail

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
