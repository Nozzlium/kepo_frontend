import { FormControl, FormLabel, Input } from "@mui/joy"

const KepoPasswordField = ({hint}:{hint?: string}) => {
  //   return <>
  //   <TextField
  //     id="text-field-password"
  //     label="Password"
  //     type="password"
  //     style={
  //       {
  //         margin: "10px 0 10px 0"
  //       }
  //     }
  //     variant="outlined"
  //     fullWidth={true}
  //   />
  //  </> 
  return <FormControl>
    <FormLabel>{ hint ? hint : "Password" }</FormLabel>
    <Input
      // html input attribute
      name="password"
      type="password"
      placeholder={
        hint ? hint : "Password" 
      }
    />
  </FormControl>
}

export default KepoPasswordField