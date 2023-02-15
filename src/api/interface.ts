export interface IAddCampaignResp {
  id: string
}

export interface IGetMetadataByNameResp {
  title: string
  description: string
  writerAddress: string
  img1?: string
  img1Key?: string
  img2?: string
  img2Key?: string
  img3?: string
  reviewContents?: string
  reviewImg1?: string
  reviewImg1Key?: string
  reviewImg2?: string
  reviewImg2Key?: string
  reviewImg3?: string
  reviewImg3Key?: string
}

export interface IGetMetadataResp {
  name: string
  keyvalues: {
    img1: string
    title: string
    img1Key: string
    description: string
    writerAddress: string
  }
}
