import {
  addCampaign,
  getMetadata,
  getMetadataByName,
} from '../../api/CampaignAPI'

import { useMutation, useQuery } from 'react-query'

export function useMetadataByName(name: string) {
  return useQuery('getMetadataByName', () => getMetadataByName(name), {
    cacheTime: 0,
  })
}
export function useMetadata() {
  return useQuery('getMetadata', () => getMetadata())
}
