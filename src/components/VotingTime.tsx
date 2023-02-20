import styled from '@emotion/styled'
import { Alert, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

const VotingTime = ({
  timeLock,
  period,
}: {
  timeLock: number
  period: number
}) => {
  const [hours, setHours] = useState<number>(0)
  const [minutes, setMinutes] = useState<number>(0)
  const [seconds, setSeconds] = useState<number>(0)
  useEffect(() => {
    const updateTime = setInterval(() => {
      const now = new Date()
      const difference = (timeLock + period) * 1000 - now.getTime()
      const newHours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      const newMinutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      )
      const newSeconds = Math.floor((difference % (1000 * 60)) / 1000)

      setHours(newHours)
      setMinutes(newMinutes)
      setSeconds(newSeconds)

      if (difference <= 0) {
        clearInterval(updateTime)
        setHours(0)
        setMinutes(0)
        setSeconds(0)
      }
    })

    return () => {
      clearInterval(updateTime)
    }
  }, [])
  return (
    <Alert severity='info' sx={{ mt: 1 }}>
      <Typography sx={{ fontSize: 16, color: 'gray', textAlign: 'center' }}>
        {hours !== 0 || minutes !== 0 || seconds !== 0
          ? `There are about ${
              hours !== 0 ? `${hours} hour(s)` : ''
            } ${minutes} minute(s) left until the vote is over.`
          : 'The vote will end soon.'}
      </Typography>
    </Alert>
  )
}

export default VotingTime
