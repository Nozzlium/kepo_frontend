import { FormControl, FormLabel, Input } from "@mui/joy"
import { ChangeEventHandler } from "react"

const KepoPasswordField = (
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
  </FormControl>
}

export default KepoPasswordField