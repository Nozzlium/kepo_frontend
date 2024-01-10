import { Box, Sheet } from "@mui/joy"
import LoginForm from "./LoginForm"
import logo from "../asset/brand.png"
import { UIStatus } from "../lib/ui-status"
import { KepoError, UnauthorizedError } from "../error/KepoError"
import KepoGeneralErrorAlert from "../common/KepoGeneralErrorAlert"
import { useEffect, useState } from "react"
import Progress from "../common/Progress"
import userDetailRequest from "../request/UserDetailsRequest"
import { useNavigate } from "react-router-dom"

interface LoginPageState {
    status: UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR | UIStatus.IDLE
    error?: KepoError
}

const Login = () => {
    const navigate = useNavigate()
    const [loginPageState, setLoginPageState] = useState<LoginPageState>({
        status: UIStatus.LOADING
    })

    const checkUser = (
        signal?: AbortSignal
    ) => {
        (async () => {
            try {
                const user = await userDetailRequest.getDetails(signal)
                if (user.id !== 0) {
                    navigate("/", { replace: true })
                }
            } catch (error) {
                if (signal?.aborted) {
                    return
                }

                switch (true) {
                    case error instanceof UnauthorizedError: {
                        setLoginPageState(_prev => {
                            return {
                                status: UIStatus.IDLE
                            }
                        })
                        break
                    }
                    case error instanceof KepoError: {
                        setLoginPageState(_prev => {
                            return {
                                status: UIStatus.ERROR,
                                error: error as KepoError
                            }
                        })
                        break
                    }
                    default: {
                        setLoginPageState(_prev => {
                            return {
                                status: UIStatus.ERROR,
                                error: new KepoError()
                            }
                        })
                        break
                    }
                }
            }
        })()
    }

    useEffect(() => {
        if (loginPageState.status === UIStatus.LOADING) {
            checkUser()
            return
        }
    }, [loginPageState.status])

    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column'
        }}
        className="page"
    >
        {
            loginPageState.status === UIStatus.IDLE ?
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto', // margin left & right
                    my: 'auto',
                }}
            >
                <img 
                    src={logo} 
                    onClick={() => {
                            navigate("/")
                        }
                    }
                    className="clickable"
                />
                <LoginForm/>
            </Box> : <Progress/>
        }
        <KepoGeneralErrorAlert
            title={loginPageState.error?.message ?? "terjadi error"}
            show={loginPageState.status === UIStatus.ERROR}
            onCloseClicked={() => {
                setLoginPageState(_prev => {
                    return {
                        status: UIStatus.LOADING
                    }
                })
            }}
        />
    </Box>
}

export default Login