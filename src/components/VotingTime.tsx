import styled from '@emotion/styled'
import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'

const VotingTime = ({
  timeLock,
  period,
}: {
  timeLock: number
  period: number
}) => {
  console.log(timeLock, period)

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
    <>
      <Typography sx={{ fontSize: 12, color: 'gray' }}>
        Time Remaining Before End of Voting
      </Typography>
      <Container>
        <Span>{hours.toString().padStart(2, '0')}</Span> h
        <Span>{minutes.toString().padStart(2, '0')}</Span> m
        <Span>{seconds.toString().padStart(2, '0')}</Span> s
      </Container>
    </>
  )
}

export default VotingTime

const Container = styled.div`
  border-radius: 10px;
  padding: 15px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Span = styled.span`
  padding: 4px 6px;
  margin: 0 3px 0 5px;
  border-radius: 10px;
  background: black;
  color: white;
`
