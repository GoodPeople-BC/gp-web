import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'

interface BaseRadioGroupProps {
  register: UseFormRegisterReturn
  label: string
  name: string
  radioDatas: RadioData[]
  defaultValue: string | number
  errors?: FieldError
}

interface RadioData {
  label: string
  value: string | number
}

export default function BaseRadioGroup({
  register,
  label,
  name,
  radioDatas,
  defaultValue,
  errors,
}: BaseRadioGroupProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        p: 1,
        width: { xs: '100%', md: '25rem' },
      }}
    >
      <FormControl>
        <FormLabel id={`radio-group-label-${name}`}>{label}</FormLabel>
        <RadioGroup
          row
          aria-labelledby={`radio-group-label-${name}`}
          defaultValue={defaultValue}
          name={`radio-group-${name}`}
        >
          {radioDatas.map((data) => (
            <FormControlLabel
              value={data.value}
              control={<Radio size='small' />}
              label={data.label}
              {...register}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  )
}
