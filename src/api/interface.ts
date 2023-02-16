export interface IAddCampaignResp {
  id: string
}

export interface IGetMetadataByNameResp {
  title: string
  description: string
  writerAddress: string
  imgs: string[]
  reviewContents?: string
  reviewImgs?: string[]
}

export interface IGetMetadataResp {
  name: string
  keyvalues: {
    title: string
    mainImg: string
  }
}
