import React from 'react'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import SettingsIcon from '@mui/icons-material/Settings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import LinkIcon from '@mui/icons-material/Link';
import { useTranslation } from "react-i18next";
import VpnKeyIcon from '@mui/icons-material/VpnKey';




export const SidebarData = (t) => [
    {
        title: t('dashboard'),
        icon: <SpaceDashboardIcon />,
        link: '/home'
    },
    {
        title: t('news'),
        icon: <NewspaperIcon />,
        link: '/news'
    },
    {
        title: t('settings'),
        icon: <SettingsIcon />,
        link: '/settings'
    },
    {
        title: t('userRoles'),
        icon: <SupervisorAccountIcon />,
        link: '/user-role'
    },
    {
        title: t('generalNotifications'),
        icon: <NotificationAddIcon />,
        link: '/general-notifications'
    },{
        title: t('links'),
        icon: <LinkIcon />,
        link: '/links'
    },{
        title: "Invite Codes",
        icon: <VpnKeyIcon />,
        link: '/invite-codes'
    },

]
