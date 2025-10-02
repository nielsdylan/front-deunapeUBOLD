import {lazy} from 'react'
import {Navigate, type RouteObject} from 'react-router'
import MainLayout from '@/layouts/MainLayout.tsx'
import PrivateRoute from '@/app/services/PrivateRoute'
import PublicRoute from '@/app/services/PublicRoute'
// import SocialFeed from "@/views/apps/social-feed";

// const Auth2SignIn = lazy(() => import('@/views/auth/auth-2/sign-in'))
const Auth2SignIn = lazy(() => import('@/app/auth/index'))
// Dashboards
const Dashboard = lazy(() => import('@/views/dashboards/dashboard'))
const Album = lazy(() => import('@/app/page/galeria/Album'))
// const Dashboard2 = lazy(() => import('@/views/dashboards/dashboard2'))

// Errorr
const Error400 = lazy(() => import('@/views/error/400'))
const Error401 = lazy(() => import('@/views/error/401'))
const Error403 = lazy(() => import('@/views/error/403'))
const Error404 = lazy(() => import('@/views/error/404'))
const Error408 = lazy(() => import('@/views/error/408'))
const Error500 = lazy(() => import('@/views/error/500'))
// const Maintenance = lazy(() => import('@/views/other-pages/maintenance'))

const dashboardRoutes: RouteObject[] = [
    {path: '/dashboard', element: <Dashboard/>},
    {path: '/galeria/album', element: <Album/>},
]

const errorRoutes: RouteObject[] = [
    {path: '/error/400', element: <Error400/>},
    {path: '/error/401', element: <Error401/>},
    {path: '/error/403', element: <Error403/>},
    {path: '/error/404', element: <Error404/>},
    {path: '/error/408', element: <Error408/>},
    {path: '/error/500', element: <Error500/>},
]
const allRoutes: RouteObject[] = [
    {path: '/', element: <PublicRoute><Auth2SignIn/></PublicRoute>},
    {
        element: <PrivateRoute></PrivateRoute>,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        path: '/',
                        element: <Navigate to="/dashboard" replace/>,
                    },
                    ...dashboardRoutes,
                ],
                
            },
        ],

    },
    {path: '*', element: <Error404/>},
]

const otherRoutes: RouteObject[] = [...errorRoutes]

export const routes: RouteObject[] = [...allRoutes, ...otherRoutes]
