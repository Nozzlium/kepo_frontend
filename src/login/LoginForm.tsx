import KepoUsernameField from "../common/KepoUsernameField"
import KepoPasswordField from "../common/KepoPasswordField"
import { Button, Link, Sheet, Typography } from "@mui/joy"

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
const LoginForm = () => {
    return <Sheet
        variant="outlined"
        sx={styleform}
    >
        <KepoUsernameField/>
        <KepoPasswordField/>
        <Button sx={{ mt: 1 /* margin top */ }}>Log in</Button>
        <Typography
            endDecorator={<Link href="/register">Signup</Link>}
            fontSize="sm"
            sx={{alignSelf: 'center'}}
        >
            {"No account? "}
        </Typography>
    </Sheet>
}

export default LoginForm