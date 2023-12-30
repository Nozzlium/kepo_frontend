import { FormControl, FormHelperText, FormLabel, Input } from "@mui/joy"
import { ChangeEventHandler } from "react"

const KepoPasswordField = (
  {
    value, 
    placeholder,
    onChange,
    invalid,
    warningMessage
  }: 
  {
    value?: string, 
    placeholder?: string,
    onChange? : ChangeEventHandler<HTMLInputElement>,
    invalid?: boolean,
    warningMessage?: string
  }
) => {
  return <FormControl
    error={invalid}
  >
    <FormLabel>{ placeholder ?? "Password" }</FormLabel>
    <Input
      // html input attribute
      name="password"
      type="password"
      placeholder={
        placeholder ?? "Password" 
      }
      required
      variant="plain"
      onChange={onChange}
      value={value}
    />
    {
      invalid ?
      <FormHelperText>
        {warningMessage ?? ""}
      </FormHelperText> :
      null
    }
  </FormControl>
}

export default KepoPasswordField