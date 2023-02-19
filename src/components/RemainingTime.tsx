import styled from '@emotion/styled'
import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'

const RemainingTime = ({ end }: { end: number }) => {
  const [days, setDays] = useState<number>(0)
  const [hours, setHours] = useState<number>(0)
  const [minutes, setMinutes] = useState<number>(0)
  const [seconds, setSeconds] = useState<number>(0)
  useEffect(() => {
    const updateTime = setInterval(() => {
      const now = new Date()
      const difference = end * 1000 - now.getTime()
      const newDays = Math.floor(difference / (1000 * 60 * 60 * 24))
      const newHours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      const newMinutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      )
      const newSeconds = Math.floor((difference % (1000 * 60)) / 1000)
      setDays(newDays)
      setHours(newHours)
      setMinutes(newMinutes)
      setSeconds(newSeconds)

      if (difference <= 0) {
        clearInterval(updateTime)
        setDays(0)
        setHours(0)
        setMinutes(0)
        setSeconds(0)
      }
    }, 100)

    return () => {
      clearInterval(updateTime)
    }
  }, [])
  return (
    <>
      <Typography sx={{ fontSize: 12, color: 'gray' }}>
        Time Remaining Before End of Donation
      </Typography>
      <Container>
        <Span>{days.toString().padStart(2, '0')}</Span> d
        <Span>{hours.toString().padStart(2, '0')}</Span> h
        <Span>{minutes.toString().padStart(2, '0')}</Span> m
        <Span>{seconds.toString().padStart(2, '0')}</Span> s
      </Container>
    </>
  )
}

export default RemainingTime

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
