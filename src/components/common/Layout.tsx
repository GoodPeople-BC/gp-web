import { openDrawerState } from '../../atom'
import styled from '@emotion/styled'
import { Box, Container, Paper } from '@mui/material'
import { useRecoilState } from 'recoil'

import Header from './Header'

const Layout = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const [open, _] = useRecoilState(openDrawerState)

  return (
    <Wrapper>
      <Header />
      <Box
        component='main'
        sx={{
          minWidth: '250px',
          ml: `${open ? '240px' : '72px'}`,
          width: '100%',
          mt: { xs: '64px', md: '80px' },
          borderTopLeftRadius: '16px',
          backgroundColor: '#f2f6ff',
          flexGrow: 1,
          overflow: 'auto',
        }}
      >
        <Container sx={{ my: 4, mx: 0 }}>
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {children}
          </Paper>
        </Container>
      </Box>
    </Wrapper>
  )
}

export default Layout

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
`
