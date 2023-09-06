import { Sheet } from "@mui/joy"
import LoginForm from "./LoginForm"
import logo from "../asset/brand.png"

const Login = () => {
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
            <LoginForm/>
        </Sheet>
    </Sheet>
}

export default Login