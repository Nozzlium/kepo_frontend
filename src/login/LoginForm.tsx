import KepoUsernameField from "../common/KepoUsernameField"
import KepoPasswordField from "../common/KepoPasswordField"
import { Alert, Button, IconButton, Link, Sheet, Typography } from "@mui/joy"
import { Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from "react"
import { LoginParam }from "../param/AuthParam"
import { useNavigate } from "react-router-dom"
import { KepoError, UnauthorizedError } from "../error/KepoError"
import authRequest from "../request/AuthRequest"
import { Close } from "@mui/icons-material"
import token from "../lib/Token"
import { UIStatus } from "../lib/ui-status"
import KepoDialogErrorAlert from "../common/KepoDialogErrorAlert"

interface LoginData {
    identity: string,
    password: string
}

interface LoginState {
    data: LoginData,
    status: UIStatus.IDLE | UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR,
    error?: KepoError
}

const LoginForm = () => {
    const navigate = useNavigate()
    const [loginState, setLoginState] = useState<LoginState>({
        data: {
            identity: '',
            password: ''
        },
        status: UIStatus.IDLE,
    })

    const login = (param: LoginParam) => {
        (async () => {
            try {
                const savedToken = await authRequest.login(param)
                token.setToken(savedToken)
                setLoginState(prev => {
                    const next = {...prev}
                    next.status = UIStatus.SUCCESS
                    return next
                })
            } catch (error) {
                if (error instanceof KepoError) {
                    setLoginState(prev => {
                        const next = {...prev}
                        next.status = UIStatus.ERROR
                        next.error = error as KepoError
                        return next
                    })
                } 
            }
        })()
    }

    useEffect(() => {
        if (loginState.status === UIStatus.LOADING) {
            const param: LoginParam = {
                identity: loginState.data.identity,
                password: loginState.data.password
            }
            login(param)
        }
        if (loginState.status === UIStatus.SUCCESS) {
            navigate("/", {replace: true})
        }
    }, [loginState])

    return <Sheet
        variant="soft"
        sx={{
            width: 300,
            py: 3,
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            borderRadius: 'sm',
            gap: 1
        }}
    >
        <KepoDialogErrorAlert
            text={loginState.error?.message}
            show={loginState.status === UIStatus.ERROR}
            onClose={() => {
                setLoginState(prev => {
                    const next = {...prev}
                    next.status = UIStatus.IDLE
                    next.error = undefined
                    return next
                })
            }}
        />
        <form 
            onSubmit={(event) => {
                event.preventDefault()
                setLoginState(prev => {
                    const next = {...prev}
                    next.status = UIStatus.LOADING
                    return next
                })
            }}
        >
            <Sheet
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                }}
                variant="soft"
            >
                <KepoUsernameField value={loginState.data.identity} onChange={(event) => {
                    setLoginState(prev => {
                        const next = {...prev}
                        next.data.identity = event.target.value
                        return next
                    })
                }}/>
                <KepoPasswordField value={loginState.data.password} onChange={(event) => {
                    setLoginState(prev => {
                        const next = {...prev}
                        next.data.password = event.target.value
                        return next
                    })
                }}/>
                <Button sx={{ mt: 1 }} type="submit" >Log in</Button>
            </Sheet>
        </form>
        <Typography
            endDecorator={<Link href="/register">Daftar di sini</Link>}
            fontSize="sm"
            sx={{alignSelf: 'center'}}
        >
            {"Belum punya akun? "}
        </Typography>
    </Sheet>
}

export default LoginForm