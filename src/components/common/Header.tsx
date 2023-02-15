import {
  Divider,
  IconButton,
  List,
  styled,
  Toolbar,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import Diversity1Icon from '@mui/icons-material/Diversity1'

import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import MuiDrawer from '@mui/material/Drawer'

import { useRecoilState } from 'recoil'
import { openDrawerState } from '../../atom'
import { MenuItems } from './MenuItems'
import Metamask from '../Metamask'

const Header = () => {
  const [open, setOpen] = useRecoilState(openDrawerState)
  const toggleDrawer = () => {
    setOpen(!open)
  }
  return (
    <>
      <AppBar
        position='fixed'
        open={open}
        sx={{
          backgroundColor: 'white',
          boxShadow: 'none',
          color: 'black',
        }}
      >
        <Toolbar
          sx={{
            height: { xs: '64px', md: '80px' },
          }}
        >
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            id='logo'
            component='h1'
            variant='h6'
            color='inherit'
            noWrap
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              fontSize: 22,
              lineHeight: '40px',
            }}
          >
            <Diversity1Icon sx={{ mr: 1 }} />
            Good People
          </Typography>
          <Metamask />
        </Toolbar>
      </AppBar>
      <Drawer variant='permanent' open={open}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: 1,
            height: { xs: '64px', md: '80px' },
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon sx={{ color: 'black' }} />
          </IconButton>
        </Toolbar>
        <List component='nav' sx={{ mt: 3, color: '#202020' }}>
          <MenuItems />
        </List>
      </Drawer>
    </>
  )
}

export default Header

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const drawerWidth = 240

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: 'white',
    borderRight: 'none',
    position: 'fixed',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(9),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}))
