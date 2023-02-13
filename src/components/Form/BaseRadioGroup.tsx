import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material'
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegisterReturn,
} from 'react-hook-form'

interface BaseRadioGroupProps {
  register: UseFormRegisterReturn
  label: string
  name: string
  radioDatas: RadioData[]
  defaultValue: string
  errors?: FieldError
}

interface RadioData {
  label: string
  value: string
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
        width: '25rem',
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
              control={<Radio />}
              label={data.label}
              {...register}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  )
}
