import { Button, Sheet} from "@mui/joy"
import KepoPasswordField from "../common/KepoPasswordField"
import KepoUsernameField from "../common/KepoUsernameField"

const styleform = {
    width: 300,
    py: 3, // padding top & bottom
    px: 2, // padding left & right
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    borderRadius: 'sm',
    boxShadow: 'md',
}

const RegisterForm = () => {
    return <Sheet
        variant="outlined"
        sx={styleform}
    >
        <KepoUsernameField/>
        <KepoPasswordField/>
        <KepoPasswordField hint="Confirm Password"/>
        <Button sx={{ mt: 1 /* margin top */ }}>Register</Button>
    </Sheet>
}
export default RegisterForm