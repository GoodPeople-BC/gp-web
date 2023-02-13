import { RouteProps } from 'react-router'

import * as basicRoutes from './paths'

export type RouteItem = RouteProps & {
  component: () => React.ReactNode | null
  path: string
  routes?: RouteItem[]
}

const routes: RouteItem[] = [...Object.values(basicRoutes)]

export { basicRoutes }

export default routes
