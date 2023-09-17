import { FormControl, FormLabel, Input } from "@mui/joy"
import { MutableRefObject } from "react"

const KepoUsernameField = () => {
  return <FormControl>
    <FormLabel>Email</FormLabel>
    <Input
      // html input attribute
      name="email"
      type="email"
      placeholder="johndoe@email.com"
      variant="plain"
    />
  </FormControl>
}

export default KepoUsernameField