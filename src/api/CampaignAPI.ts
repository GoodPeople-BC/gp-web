import axios from 'axios'

export interface IAddCampaign {
  title: string
  description: string
  writerAddress: string
}

export const addCampaign = async (formData: FormData) => {
  await axios.post(`${process.env.REACT_APP_API_SERVER}/campaign`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const addReview = async (name: string, formData: FormData) => {
  await axios.post(
    `${process.env.REACT_APP_API_SERVER}/campaign/${name}/review`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
}
