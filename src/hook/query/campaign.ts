import {
  addCampaign,
  getMetadata,
  getMetadataByName,
} from '../../api/CampaignAPI'

import { useQuery } from 'react-query'

export function useMetadataByName(name: string) {
  return useQuery('getMetadataByName', () => getMetadataByName(name), {
    cacheTime: 0,
  })
}

export function useMetadata(keys: string[] | undefined) {
  return useQuery('getMetadata', () => keys && getMetadata(keys), {
    enabled: !!keys,
  })
}
