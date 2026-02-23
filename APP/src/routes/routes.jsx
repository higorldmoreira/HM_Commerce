import React from 'react'
import { Route, Routes, Router } from 'react-router-dom'
import { ROUTE_PATHS } from '../enums/routePaths'
import { DefaultLayout } from '../components/templates/defaultLayout/defaultLayout'
import { Home } from '../pages/home/home'
import { Login } from '../pages/auth/login/login'
import { GestaoDeCredito } from '../pages/gestaoDeCredito/gestaoDeCredito'
import { GestaoDeRebaixa } from '../pages/gestaoDeRebaixa/gestaoDeRebaixa'
import { Relatorios } from '../pages/relatorios/relatorios'
import { CondicaoDeRebaixa } from '../pages/condicaoDeRebaixa/condicaoDeRebaixa'

export function RoutesComponent() {
  const router = [
    {
      path: ROUTE_PATHS.home,
      element: <Home />,
      index: true
    },
    {
      path: ROUTE_PATHS.gestaoDeCredito,
      element: <GestaoDeCredito />,
      index: false
    },
    {
      path: ROUTE_PATHS.gestaoDeRebaixa,
      element: <GestaoDeRebaixa />,
      index: false
    },
    {
      path: ROUTE_PATHS.condicaoDeRebaixa,
      element: <CondicaoDeRebaixa />,
      index: false
    },
    {
      path: ROUTE_PATHS.relatorios,
      element: <Relatorios />,
      index: false
    },
  ]

  return (
    <Routes>
      <Route path={ROUTE_PATHS.login} element={<Login />} />

      <Route path="/" element={<DefaultLayout />}>
        {router?.map(route => (
          <Route key={route?.path} path={route?.path} element={route?.element} />
        ))}
        <Route path="*" element={<h1>404 - Página não existe</h1>} />
      </Route>
    </Routes>
  )
}
