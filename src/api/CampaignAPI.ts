import axios from 'axios'
import {
  IGetMetadataResp,
  IGetMetadataByNameResp,
  IAddCampaignResp,
} from './interface'

export interface IAddCampaign {
  title: string
  description: string
  writerAddress: string
}

export const addCampaign = async (formData: FormData) => {
  const data = await axios.post(
    `${process.env.REACT_APP_API_SERVER}/campaign`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return data.data.data
}

export const cancelCampaign = (pinataKey: string) => {
  return axios.post(
    `${process.env.REACT_APP_API_SERVER}/campaign/${pinataKey}/cancel`
  )
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
    .get(`${process.env.REACT_APP_API_SERVER}/campaign/name/${name}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data }) => {
      return data.data.metadata
    })
}

export const getMetadata = async (
  keys: string[]
): Promise<IGetMetadataResp[]> => {
  const data = keys.map((k) => `name[]=${k}&`)
  return await axios
    .get(`${process.env.REACT_APP_API_SERVER}/campaign?${data.join('')}`)
    .then(({ data }) => {
      return data.data.metadata
    })
}
