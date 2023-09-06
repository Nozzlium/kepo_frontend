import { FormControl, FormLabel, Input } from "@mui/joy"

const KepoUsernameField = () => {
  //  return <>
  //   <TextField
  //     style={
  //       {
  //         margin: "10px 0 0px 0"
  //       }
  //     }
  //     id="text-field-username"
  //     label="Username or Email"
  //     type="text"
  //     variant="outlined"
  //     fullWidth={true}
  //   />
  //  </> 
  return <FormControl>
    <FormLabel>Email</FormLabel>
    <Input
      // html input attribute
      name="email"
      type="email"
      placeholder="johndoe@email.com"
    />
  </FormControl>
}

export default KepoUsernameField