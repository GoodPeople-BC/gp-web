import styled from '@emotion/styled'
import { Box, FilledInput, Input, TextField } from '@mui/material'
import {
  Control,
  FieldError,
  FieldValues,
  Path,
  UseFormRegisterReturn,
} from 'react-hook-form'

export type InputType = 'file' | 'text'

interface BaseInputProps<T extends FieldValues> {
  register: UseFormRegisterReturn
  name: Path<T>
  type: InputType
  label: string
  errors?: FieldError
}

export default function BaseInput<T extends FieldValues>({
  register,
  name,
  type,
  label,
  errors,
}: BaseInputProps<T>) {
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
      {type === 'text' ? (
        <TextField
          id={`form-${name}-${label}`}
          type={type}
          label={label}
          {...register}
        />
      ) : (
        <>
          <label>{label}</label>
          <Input id={`form-${name}-${label}`} type={type} {...register} />
        </>
      )}
      {errors?.message}
    </Box>
  )
}
