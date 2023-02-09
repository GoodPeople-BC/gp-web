import { useParams } from 'react-router-dom'

const CampaignDetail = () => {
  const { id: campaignId } = useParams()
  console.log(campaignId)

  return <div>CampaignDetail</div>
}

export default CampaignDetail
