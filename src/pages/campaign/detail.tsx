import styled from '@emotion/styled'
import { useParams } from 'react-router'
import { SubmitHandler, useForm } from 'react-hook-form'

import { addReview } from '../../api/CampaignAPI'
import BaseInput, { InputType } from '../../components/Form/BaseInput'
import { useMemo } from 'react'
import { useMetadataByName } from '../../hook/query/campaign'
import { IGetMetadataByNameResp } from '../../api/interface'
import { LoadingButton } from '@mui/lab'

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
}

const defailForm: IDetaileForm[] = [
  {
    name: 'contents',
    type: 'text',
    label: 'contents',
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
const CampaignDetail = () => {
  // 기부글 등록 시 리턴된 unique key로 기부 상세 dynamic routing
  // /campaign/${uniqueKey}로 접속하여 테스트 가능
  const { id } = useParams()

  // useQuery
  const { data, isLoading } = useMetadataByName(
    '914d6bcb01bc7f57530478780329041'
  )
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

  console.log('🚀 ~ file: detail.tsx:5 ~ CampaignDetail ~ id', id)

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData()
    formData.append('contents', data.contents)
    formData.append('img1', data.img1[0])
    formData.append('img2', data.img2[0])
    formData.append('img3', data.img3[0])

    // TODO params 로 입력 받기
    await addReview('914d6bcb01bc7f57530478780329041', formData).catch(
      (err) => {
        alert(err)
      }
    )
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {defailForm.map((data) => (
          <BaseInput
            name={data.name}
            type={data.type as InputType}
            label={data.label}
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
      <div>{metadata?.img1}</div>
    </>
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
