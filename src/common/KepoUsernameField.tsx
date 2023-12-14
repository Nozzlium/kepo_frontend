import { FormControl, FormLabel, Input } from "@mui/joy"
import { ChangeEventHandler, MutableRefObject } from "react"

const KepoUsernameField = (
  {
    value, 
    placeholder,
    onChange
  }: 
  {
    value?: string, 
    placeholder?: string,
    onChange? : ChangeEventHandler<HTMLInputElement>
  }
) => {
  return <FormControl>
    <FormLabel>Username</FormLabel>
    <Input
      // html input attribute
      name="username"
      placeholder={placeholder ?? "Username"}
      variant="plain"
      required
      value={value}
      onChange={onChange}
    />
  </FormControl>
}

export default KepoUsernameField