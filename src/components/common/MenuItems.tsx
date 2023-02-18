import ExploreIcon from '@mui/icons-material/Explore'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { Link } from 'react-router-dom'

export const MenuItems = () => {
  return (
    <>
      <Link to='/'>
        <ListItemButton
          sx={{
            m: 1,
          }}
        >
          <ListItemIcon>
            <ExploreIcon sx={{ color: 'black' }} />
          </ListItemIcon>
          <ListItemText primary='Explore' />
        </ListItemButton>
      </Link>
      <Link to='/campaign/create'>
        <ListItemButton
          sx={{
            m: 1,
          }}
        >
          <ListItemIcon>
            <AddCircleOutlineIcon sx={{ color: 'black' }} />
          </ListItemIcon>
          <ListItemText primary='Create Campaign' />
        </ListItemButton>
      </Link>
    </>
  )
}
