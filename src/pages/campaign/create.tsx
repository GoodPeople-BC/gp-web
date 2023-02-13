/** @jsxImportSource @emotion/react */
import BaseInput, { InputType } from '../../components/Form/BaseInput'
import styled from '@emotion/styled'

import { SubmitHandler, useForm } from 'react-hook-form'

import { addCampaign } from '../../api/CampaignAPI'
import { ethers } from 'ethers'
import { Contract } from '../../utils/Contract'
import { LoadingButton } from '@mui/lab'
import BaseRadioGroup from '../../components/Form/BaseRadioGroup'

type Inputs = {
  title: string
  description: string
  writerAddress: string
  goalAmount: string
  period: string
  img1: FileList
  img2: FileList
  img3: FileList
}

type InputsKey = keyof Inputs

interface IRadioValue {
  label: string
  value: string
}

interface ICreateCampaignForm {
  name: InputsKey
  type: InputType | 'radio'
  label: string
  radioDatas?: IRadioValue[]
  defaultValue?: string
}

const createCampaignForm: ICreateCampaignForm[] = [
  {
    name: 'title',
    type: 'text',
    label: 'title',
  },
  {
    name: 'description',
    type: 'text',
    label: 'description',
  },
  {
    name: 'writerAddress',
    type: 'text',
    label: 'writerAddress',
  },
  {
    label: 'goalAmount',
    name: 'goalAmount',
    type: 'radio',
    radioDatas: [
      {
        label: '10$',
        value: '10',
      },
      {
        label: '100$',
        value: '100',
      },
      {
        label: '1000$',
        value: '1000',
      },
    ],
    defaultValue: '10',
  },
  {
    label: 'period',
    name: 'period',
    type: 'radio',
    radioDatas: [
      {
        label: '2 weeks',
        value: '0',
      },
      {
        label: '1 Month',
        value: '1',
      },
      {
        label: '2 Months',
        value: '2',
      },
    ],
    defaultValue: '0',
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

// 기부안건등록페이지
const CampaignCreate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      title: '',
      description: '',
      writerAddress: '',
      goalAmount: '',
      period: '',
      img1: undefined,
      img2: undefined,
      img3: undefined,
    },
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('writerAddress', data.writerAddress)
    formData.append('img1', data.img1[0])
    formData.append('img2', data.img2[0])
    formData.append('img3', data.img3[0])

    console.log(data)

    await addCampaign(formData).catch((err) => {
      alert(err)
      return null
    })

    // call contract
    const provider = await Contract.getProvider()
    // calculate gas price
    const price = ethers.utils.formatUnits(
      (await provider.getGasPrice()).mul(2),
      'gwei'
    )
    const options = {
      gasPrice: ethers.utils.parseUnits(price, 'gwei'),
    }

    // contract call
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {createCampaignForm.map((data) =>
        data.type !== 'radio' ? (
          <BaseInput
            name={data.name}
            type={data.type as InputType}
            label={data.label}
            register={register(data.name as InputsKey)}
          />
        ) : (
          data.radioDatas && (
            <BaseRadioGroup
              name={data.name}
              label={data.label}
              defaultValue={
                data.defaultValue ? data.defaultValue : data.radioDatas[0].value
              }
              radioDatas={data.radioDatas}
              register={register(data.name as InputsKey)}
            />
          )
        )
      )}
      <LoadingButton
        variant='contained'
        sx={{ mt: 3, color: '#ffffff', fontWeight: 'bold', fontSize: '1.1rem' }}
        type='submit'
      >
        Submit
      </LoadingButton>
    </Form>
  )
}

export default CampaignCreate

const Form = styled.form`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Box = styled.div`
  width: 100px;
  margin-bottom: 1rem;
`
