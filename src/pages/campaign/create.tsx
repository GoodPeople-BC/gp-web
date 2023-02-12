/** @jsxImportSource @emotion/react */
import BaseInput from '../../components/Form/BaseInput'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { SubmitHandler, useForm } from 'react-hook-form'

import { addCampaign } from '../../api/CampaignAPI'
import { ethers } from 'ethers'
import { Contract } from '../../utils/Contract'
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

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
      <BaseInput
        name='title'
        type='text'
        label='title'
        register={register('title')}
      />
      <BaseInput
        name='description'
        type='text'
        label='description'
        register={register('description')}
      />
      <BaseInput
        name='writerAddress'
        type='text'
        label='writerAddress'
        register={register('writerAddress')}
      />
      <FormControl>
        <FormLabel id='radio-group-goal-label'>Goal</FormLabel>
        <RadioGroup
          row
          aria-labelledby='radio-group-goal-label'
          defaultValue='10'
          name='radio-group-goal'
        >
          <FormControlLabel
            value='10'
            control={<Radio />}
            label='10$'
            {...register('goalAmount')}
          />
          <FormControlLabel
            value='100'
            control={<Radio />}
            label='100$'
            {...register('goalAmount')}
          />
          <FormControlLabel
            value='1000'
            control={<Radio />}
            label='1000$'
            {...register('goalAmount')}
          />
        </RadioGroup>
      </FormControl>
      <FormControl>
        <FormLabel id='radio-group-period-label'>Period</FormLabel>
        <RadioGroup
          row
          aria-labelledby='radio-group-period-label'
          defaultValue='0'
          name='radio-group-period'
        >
          <FormControlLabel
            value='0'
            control={<Radio />}
            label='2 weeks'
            {...register('period')}
          />
          <FormControlLabel
            value='1'
            control={<Radio />}
            label='1 Month'
            {...register('period')}
          />
          <FormControlLabel
            value='2'
            control={<Radio />}
            label='3 Month'
            {...register('period')}
          />
        </RadioGroup>
      </FormControl>
      <BaseInput
        name='img1'
        type='file'
        label='Image 1'
        register={register('img1')}
      />
      <BaseInput
        name='img2'
        type='file'
        label='Image 2'
        register={register('img2')}
      />
      <BaseInput
        name='img3'
        type='file'
        label='Image 3'
        register={register('img3')}
      />

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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Box = styled.div`
  width: 100px;
  margin-bottom: 1rem;
`
