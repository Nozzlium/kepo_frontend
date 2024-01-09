import { Box, Sheet, Typography } from "@mui/joy"
import RegisterForm from "./RegisterForm"
import logo from "../asset/brand.png"
import { UIStatus } from "../lib/ui-status"
import { KepoError, UnauthorizedError } from "../error/KepoError"
import { useEffect, useState } from "react"
import Progress from "../common/Progress"
import KepoGeneralErrorAlert from "../common/KepoGeneralErrorAlert"
import userDetailRequest from "../request/UserDetailsRequest"
import { useNavigate } from "react-router-dom"

interface RegisterPageState {
    status: UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR | UIStatus.IDLE
    error?: KepoError
}

const Register = () => {
    const navigate = useNavigate()
    const [registerPageState, setRegisterPageState] = useState<RegisterPageState>({
        status: UIStatus.LOADING
    })

    function checkUserInfo(
        signal?: AbortSignal
    ) {
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
                        setRegisterPageState(_prev => {
                            return {
                                status: UIStatus.IDLE
                            }
                        })
                        break
                    }
                    case error instanceof KepoError: {
                        setRegisterPageState(_prev => {
                            return {
                                status: UIStatus.ERROR,
                                error: error as KepoError
                            }
                        })
                        break
                    }
                    default: {
                        setRegisterPageState(_prev => {
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
        if (registerPageState.status === UIStatus.LOADING) {
            checkUserInfo()
            return
        }

    }, [registerPageState.status])

    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column'
        }}
        className="page"
    >
        {
            registerPageState.status === UIStatus.IDLE ?
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
                <img src={logo}/>
                <Typography sx={{
                    mb: 1,
                    textAlign: 'start'
                }}>
                    Buat akun!
                </Typography>
                <RegisterForm/>
            </Box> :
            <Progress/>
        }
        <KepoGeneralErrorAlert
            title={registerPageState.error?.message ?? "terjadi error"}
            show={registerPageState.status === UIStatus.ERROR}
            onCloseClicked={() => {
                setRegisterPageState(_prev => {
                    return {
                        status: UIStatus.LOADING
                    }
                })
            }}
        />
    </Box>
}

export default Register
