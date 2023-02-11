import styled from '@emotion/styled'
import { useParams } from 'react-router'
// 기부 상세 페이지 (후기 작성)
const CampaignDetail = () => {
  // 기부글 등록 시 리턴된 unique key로 기부 상세 dynamic routing
  // /campaign/${uniqueKey}로 접속하여 테스트 가능
  const { id } = useParams()
  console.log('🚀 ~ file: detail.tsx:5 ~ CampaignDetail ~ id', id)

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const contents = e.target[0].value

    if (e.target[1].files) {
      const formData = new FormData()
      for (let i = 0; i < e.target[1].files.length; i++) {
        formData.append('images', e.target[1].files[i])
      }
      console.log(
        '🚀 ~ file: create.tsx:10 ~ handleSubmit ~ formData',
        formData
      )
    }
    // formData api 요청 헤더 형식
    // headers: {
    //   "Content-Type": "multipart/form-data",
    // },
  }
  return (
    <Form onSubmit={handleSubmit}>
      <label htmlFor='contents'>contents</label>
      <textarea id='contents' />
      <label htmlFor='images'>images</label>
      <input id='images' type='file' multiple />
      <button type='submit'>제출</button>
    </Form>
  )
}

export default CampaignDetail

const Form = styled.form`
  width: 300px;
  display: flex;
  flex-direction: column;
`
