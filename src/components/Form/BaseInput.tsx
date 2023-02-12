import styled from '@emotion/styled'
import {
  Control,
  FieldError,
  FieldValues,
  Path,
  UseFormRegisterReturn,
} from 'react-hook-form'

type InputType = 'file' | 'text'

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
    <Box>
      <label>{label}</label>
      <input id={`form-${name}-${label}`} type={type} {...register} />
      {errors?.message}
    </Box>
  )
}

const Box = styled.div`
  width: 100px;
  margin-bottom: 1rem;
`
