import { Box, Divider, Typography } from '@mui/material'

const Title = ({
  children,
  subTitle,
  rightSide,
}: {
  children: string
  subTitle?: string
  rightSide?: any
}) => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Typography
            sx={{
              fontSize: 24,
            }}
          >
            {children}
          </Typography>
          <Typography
            sx={{
              fontSize: 14,
              color: 'gray',
            }}
          >
            {subTitle}
          </Typography>
        </div>
        {rightSide}
      </Box>
      <Divider sx={{ my: 2 }} />
    </>
  )
}

export default Title
