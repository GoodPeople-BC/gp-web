import { Route, Routes } from 'react-router-dom'

import { RouteItem } from '.'

interface RouteIndexProps {
  routes: RouteItem[]
  path?: string
}

export default function RouteIndex({ routes, ...props }: RouteIndexProps) {
  return (
    <Routes>
      {routes.map(({ component, ...rest }, i) => (
        <Route key={i} {...props} {...rest} element={component()} />
      ))}
    </Routes>
  )
}
