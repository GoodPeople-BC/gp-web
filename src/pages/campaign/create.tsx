import styled from '@emotion/styled'

// 기부안건등록페이지
const CampaignCreate = () => {
  const handleSubmit = (e: any) => {
    e.preventDefault()
    const title = e.target[0].value
    const description = e.target[1].value
    const writerAddress = e.target[2].value

    if (e.target[3].files) {
      const formData = new FormData()
      for (let i = 0; i < e.target[3].files.length; i++) {
        formData.append('images', e.target[3].files[i])
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
      <label htmlFor='title'>title</label>
      <input id=' title' type='text' />
      <label htmlFor='description'>description</label>
      <textarea id='description' />

      {/* 이후 지갑연동 address로 대체 */}
      <label htmlFor='writerAddress'>writerAddress</label>
      <input id='writerAddress' type='text' />
      <label htmlFor='images'>images</label>
      <input id='images' type='file' multiple />
      <button type='submit'>제출</button>
    </Form>
  )
}

export default CampaignCreate

const Form = styled.form`
  width: 300px;
  display: flex;
  flex-direction: column;
`
