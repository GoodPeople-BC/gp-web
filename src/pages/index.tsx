import { useMetadata } from '../hook/query/campaign'
import { Box, Skeleton, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import { Link } from 'react-router-dom'
import { getDonationList } from '../api/contract/GPService'
import { useEffect } from 'react'
const HomePage = () => {
  const { data, isLoading } = useMetadata()

  useEffect(() => {
    getDonationList().then(console.log)
  }, [])

  return (
    <>
      {isLoading ? (
        <Grid2 container columns={12} spacing={2}>
          {Array.from({ length: 6 }, () => (
            <Grid2 xs={12} md={4}>
              <Skeleton
                sx={{
                  borderRadius: 2,
                }}
                variant='rectangular'
                height={300}
              />
            </Grid2>
          ))}
        </Grid2>
      ) : (
        <Grid2 container columns={12} spacing={2}>
          {data?.map((o, i) => (
            <Grid2 key={i} xs={12} md={4}>
              <Link to={`/campaign/${o.name}`}>
                <Box
                  sx={{
                    borderRadius: 2,
                    backgroundImage: `url(${o.keyvalues?.mainImg})`,
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover',
                    height: '300px',
                  }}
                />
                <Typography sx={{ mt: 1, textAlign: 'center' }}>
                  {o.keyvalues?.title}
                </Typography>
              </Link>
            </Grid2>
          ))}
        </Grid2>
      )}
    </>
  )
}

export default HomePage
