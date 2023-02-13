import { getMetadataByName } from '../../api/CampaignAPI'

import { useQuery } from 'react-query'

export function useMetadataByName(name: string) {
  return useQuery('getMetadataByName', () => getMetadataByName(name))
}
