/** @jsxImportSource @emotion/react */
import BaseInput, { InputType } from '../../components/Form/BaseInput'
import styled from '@emotion/styled'

import { SubmitHandler, useForm } from 'react-hook-form'

import { addCampaign, cancelCampaign } from '../../api/CampaignAPI'
import { LoadingButton } from '@mui/lab'
import BaseRadioGroup from '../../components/Form/BaseRadioGroup'
import { useRecoilValue } from 'recoil'
import { accountState } from '../../atom'
import {
  addDonationProposal,
  getTargetAmounts,
  getTargetPeriods,
} from '../../api/contract/GPService'
import { useEffect, useState } from 'react'
import { Alert, Checkbox } from '@mui/material'
import Title from '../../components/common/Title'
import { useNavigate } from 'react-router-dom'

interface Inputs {
  title: string
  description: string
  writerAddress: string
  goalAmount: string
  period: string
  img1: FileList
  img2?: FileList
  img3?: FileList
}

type InputsKey = keyof Inputs

interface IRadioValue {
  label: string
  value: string | number
}

interface ICreateCampaignForm {
  name: InputsKey
  type: InputType | 'radio'
  label: string
  multiline?: boolean
  required?: boolean
  radioDatas?: IRadioValue[]
  defaultValue?: string | number
}

const CampaignCreate = () => {
  // * periods, amounts preset
  const [periods, setPeriods] = useState<number[]>([0, 0, 0])
  const [amounts, setAmounts] = useState<number[]>([0, 0, 0])

  useEffect(() => {
    getTargetPeriods().then((res) => setPeriods(res))
    getTargetAmounts().then((res) => setAmounts(res))
  }, [])

  // * [api] addCampaign react query

  // * metamask address
  const account = useRecoilValue(accountState)
  const [addressDefault, setAddressDefault] = useState('')
  useEffect(() => {
    console.log(account)

    account !== '0x00' && setAddressDefault(account)
  }, [account])
  // * react hook form settings
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      title: '',
      description: '',
      writerAddress: addressDefault,
      goalAmount: '10000000',
      period: '1209600',
      img1: undefined,
      img2: undefined,
      img3: undefined,
    },
  })
  // * handle form submission
  const navigate = useNavigate()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // * create formData
    console.log(data)

    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('writerAddress', data.writerAddress)
    formData.append('img1', data.img1[0])
    data.img2 && formData.append('img2', data.img2[0])
    data.img3 && formData.append('img3', data.img3[0])

    // * ipfs write
    addCampaign(formData)
      .then((res) => {
        // * contract transact
        addDonationProposal(
          data.goalAmount,
          data.period,
          account,
          res.pinataKey
        )
          .then((res) => {
            // navigate('/')
            console.log(res)
          })
          .catch(() =>
            cancelCampaign(res.pinataKey).then(console.log).catch(console.error)
          )
      })
      .catch((err) => {
        alert(err)
        return null
      })
  }

  const createCampaignForm: ICreateCampaignForm[] = [
    {
      label: 'Campaign Title',
      name: 'title',
      type: 'text',
    },
    {
      label: 'Campaign Description',
      name: 'description',
      type: 'text',
      multiline: true,
    },
    {
      label: 'Recipient',
      name: 'writerAddress',
      type: 'text',
      defaultValue: account,
    },
    {
      label: 'Goal Amount',
      name: 'goalAmount',
      type: 'radio',
      radioDatas: [
        {
          label: `${amounts[0] / 10 ** 6} USDC`,
          value: amounts[0],
        },
        {
          label: `${amounts[1] / 10 ** 6} USDC`,
          value: amounts[1],
        },
        {
          label: `${(amounts[2] / 10 ** 6).toLocaleString('en')} USDC`,
          value: amounts[2],
        },
      ],
      defaultValue: 10000000,
    },
    {
      label: 'Period',
      name: 'period',
      type: 'radio',
      radioDatas: [
        {
          label: `${periods[0] / 24 / 60 / 60 / 7} weeks`,
          value: periods[0],
        },
        {
          label: `${periods[1] / 24 / 60 / 60 / 7} weeks`,
          value: periods[1],
        },
        {
          label: `${periods[2] / 24 / 60 / 60 / 7} weeks`,
          value: periods[2],
        },
      ],
      defaultValue: 1209600,
    },
    {
      name: 'img1',
      type: 'file',
      label: 'Image 1',
      required: true,
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

  const [checked, setChecked] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }

  return (
    <>
      {/* img1 required */}
      <Title subTitle='Once you submit the form, the vote will proceed.'>
        Create Campaign
      </Title>
      {account !== '0x00' && (
        <Form onSubmit={handleSubmit(onSubmit)}>
          {createCampaignForm.map((data) =>
            data.type !== 'radio' ? (
              <BaseInput
                key={data.label}
                name={data.name}
                type={data.type as InputType}
                label={data.label}
                multiline={data.multiline || false}
                defaultValue={data.defaultValue}
                register={register(data.name as InputsKey)}
              />
            ) : (
              data.radioDatas && (
                <BaseRadioGroup
                  key={data.label}
                  name={data.name}
                  label={data.label}
                  defaultValue={
                    data.defaultValue
                      ? data.defaultValue
                      : data.radioDatas[0].value
                  }
                  radioDatas={data.radioDatas}
                  register={register(data.name as InputsKey)}
                />
              )
            )
          )}
          <Alert
            icon={
              <Checkbox
                checked={checked}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            severity='info'
          >
            If you submit the form, the agenda will be registered for review,
            and if you pass the governance vote, you will have to press the
            button directly on the detail page to make it donationable, and if
            you fail to pass the vote, the agenda will be deleted.
          </Alert>
          <LoadingButton
            variant='contained'
            sx={{
              mt: 3,
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '1.1rem',
            }}
            type='submit'
            disabled={!checked}
          >
            Submit
          </LoadingButton>
        </Form>
      )}
    </>
  )
}

export default CampaignCreate

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 14px;
`
