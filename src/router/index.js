import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'main',
        component: () => import('@/views/MainView'),
        redirect: '/index',
        children: [
            {
                path: '/index',
                name: 'index',
                component: () => import('@/views/pages/IndexView'),

            },
            {
                path: '/summoner',
                name: 'summoner',
                component: () => import('@/views/pages/SummonerView'),

            },
            {
                path: '/utils',
                name: 'utils',
                component: () => import('@/views/pages/UtilsView'),

            },
            {
                path: '/match-query',
                name: 'match-query',
                component: () => import('@/views/pages/MatchQueryView'),

            },
            {
                path: '/setting',
                name: 'setting',
                component: () => import('@/views/pages/SettingView'),
            }
        ]
    },{
        path: '/MatchUtil',
        name: 'MatchUtil',
        component: ()=> import('@/views/pages/MatchUtilView')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
