import styled from '@emotion/styled'
import { useParams } from 'react-router'
import { SubmitHandler, useForm } from 'react-hook-form'

import { addReview } from '../../api/CampaignAPI'
import BaseInput from '../../components/Form/BaseInput'

type Inputs = {
  contents: string
  img1: FileList
  img2: FileList
  img3: FileList
}

// 기부 상세 페이지 (후기 작성)
const CampaignDetail = () => {
  // 기부글 등록 시 리턴된 unique key로 기부 상세 dynamic routing
  // /campaign/${uniqueKey}로 접속하여 테스트 가능
  const { id } = useParams()

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

  console.log('🚀 ~ file: detail.tsx:5 ~ CampaignDetail ~ id', id)

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data)
    const formData = new FormData()
    formData.append('contents', data.contents)
    formData.append('img1', data.img1[0])
    formData.append('img2', data.img2[0])
    formData.append('img3', data.img3[0])

    await addReview('914d6bcb01bc7f57530478780329041', formData).catch(
      (err) => {
        alert(err)
      }
    )
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <BaseInput
        name='contents'
        type='text'
        label='contets'
        register={register('contents')}
      />
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

      <input type='submit' />
    </Form>
  )
}

export default CampaignDetail

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
