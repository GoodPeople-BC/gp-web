import { Box, Input, TextField } from '@mui/material'
import {
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
  multiline: boolean
  defaultValue?: string | number
  required?: boolean
  errors?: FieldError
}

export default function BaseInput<T extends FieldValues>({
  register,
  name,
  type,
  label,
  multiline,
  defaultValue,
  required,
  errors,
}: BaseInputProps<T>) {
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
      {type !== 'file' ? (
        <TextField
          required
          id={`form-${name}-${label}`}
          type={type}
          label={label}
          multiline={multiline}
          rows={multiline ? 5 : 1}
          defaultValue={defaultValue}
          {...register}
        />
      ) : (
        <>
          <label>{label}</label>
          <Input
            required={required}
            id={`form-${name}-${label}`}
            type={type}
            {...register}
          />
        </>
      )}
      {errors?.message}
    </Box>
  )
}
