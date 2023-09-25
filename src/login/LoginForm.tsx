import KepoUsernameField from "../common/KepoUsernameField"
import KepoPasswordField from "../common/KepoPasswordField"
import { Alert, Button, IconButton, Link, Sheet, Typography } from "@mui/joy"
import { FormEvent, useRef, useState } from "react"
import { LoginParam }from "../param/AuthParam"
import { useNavigate } from "react-router-dom"
import { UnauthorizedError } from "../error/KepoError"
import authRequest from "../request/AuthRequest"
import { Close } from "@mui/icons-material"
import token from "../lib/Token"

const LoginForm = () => {
    const navigate = useNavigate()
    const [isAlertShown, setIsAlertShown] = useState<boolean>(false)

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const identity = formData.get("email")?.toString()
        const password = formData.get("password")?.toString()
        const param: LoginParam = {
            identity: identity ?? "",
            password: password ?? ""
        };
        (async () => {
            try {
                const savedToken = await authRequest.login(param)
                token.saveToken(savedToken)
                token.setToken(savedToken)
                navigate("/", {replace: true})
            } catch (error) {
                if (error instanceof UnauthorizedError) {
                    setIsAlertShown(true)
                }
            }
        })()
    }

    const CredentialAlert = () => {
        if (isAlertShown) {
            return <Alert 
                variant="soft"
                color="danger"
                endDecorator={
                    <IconButton variant="solid" size="sm" color="danger" onClick={() => {
                        setIsAlertShown(false)
                    }}>
                        <Close />
                    </IconButton>
                }
                >
                Invalid Credentials
            </Alert>
        }
        return null
    }

    return <Sheet
        variant="soft"
        sx={{
            width: 300,
            py: 3, // padding top & bottom
            px: 2, // padding left & right
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            borderRadius: 'sm',
            gap: 1
        }}
    >
        <CredentialAlert/>
        <form 
            onSubmit={submit}
        >
            <Sheet
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                }}
                variant="soft"
            >
                <KepoUsernameField/>
                <KepoPasswordField/>
                <Button sx={{ mt: 1 }} type="submit" >Log in</Button>
            </Sheet>
        </form>
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