import { FormControl, FormLabel, Input } from "@mui/joy"

const KepoPasswordField = ({hint}:{hint?: string}) => {
  return <FormControl>
    <FormLabel>{ hint ? hint : "Password" }</FormLabel>
    <Input
      // html input attribute
      name="password"
      type="password"
      placeholder={
        hint ? hint : "Password" 
      }
      variant="plain"
    />
  </FormControl>
}

export default KepoPasswordField