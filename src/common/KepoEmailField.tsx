import { FormControl, FormLabel, Input } from "@mui/joy"
import { ChangeEventHandler } from "react"

const KepoEmailField = (
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
      <FormLabel>Email</FormLabel>
      <Input
        // html input attribute
        type="email"
        name="username"
        placeholder={placeholder ?? "Email"}
        variant="plain"
        value={value}
        required
        onChange={onChange}
      />
    </FormControl>
  }

export default KepoEmailField