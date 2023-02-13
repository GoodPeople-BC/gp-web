import { RouteItem } from '..'
import HomePage from '../../pages'
import CampaignCreate from '../../pages/campaign/create'
import CampaignDetail from '../../pages/campaign/detail'

const PATH_PREFIX = ''

export const RouteHome: RouteItem = {
  path: `${PATH_PREFIX}/`,
  component: HomePage,
}

export const RouteDetail: RouteItem = {
  path: `${PATH_PREFIX}/campaign/:id`,
  component: CampaignDetail,
}

export const RouteCreate: RouteItem = {
  path: `${PATH_PREFIX}/campaign/create`,
  component: CampaignCreate,
}
