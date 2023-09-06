import { Sheet, Typography } from "@mui/joy"
import RegisterForm from "./RegisterForm"
import logo from "../asset/brand.png"

const Register = () => {
    return <Sheet
        sx={{
            display: 'flex'
        }}
        className="page"
    >
        <Sheet
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto', // margin left & right
                my: 'auto',
            }}
        >
            <img src={logo}/>
            <Typography sx={{
                mb: 1,
                textAlign: 'start'
            }}>
                Register your account!
            </Typography>
            <RegisterForm/>
        </Sheet>
    </Sheet>
}

export default Register