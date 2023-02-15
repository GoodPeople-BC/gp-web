import { useMetadata } from '../hook/query/campaign'
import { Box, Skeleton, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import { Link } from 'react-router-dom'
import { getDonationList } from '../api/contract/GPService'
import { useEffect } from 'react'

// todo: 컨트랙트 데이터에서 ipfsKey만 뽑아서 배열로 만들어서 전달하기
// todo: 얻어온 metadata의 name과 컨트랙트 데이터의 ipfsKey를 매핑한 데이터를 화면에 보여주기
const HomePage = () => {
  useEffect(() => {
    getDonationList().then(console.log)
  }, [])

  const { data: metadata, isLoading } = useMetadata([
    '305a8bb4cbde1e9320a9b6faadd0edd',
    '2529626d990f402ff4b3f772dfa46e3',
  ])

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
          {metadata?.map((o, i) => (
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
