import axios from 'axios'
import { IGetMetadataByNameResp } from './interface'

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

export const getMetadataByName = async (
  name: string
): Promise<IGetMetadataByNameResp> => {
  return await axios
    .get(`${process.env.REACT_APP_API_SERVER}/campaign/${name}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data }) => {
      return data.data.metadata
    })
}
