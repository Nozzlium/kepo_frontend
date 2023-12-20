import { Alert, Box, Button, IconButton, Sheet} from "@mui/joy"
import KepoPasswordField from "../common/KepoPasswordField"
import KepoUsernameField from "../common/KepoUsernameField"
import { KepoError } from "../error/KepoError"
import { Close } from "@mui/icons-material"
import { Dispatch, FormEvent, useEffect, useState } from "react"
import { RegisterParam } from "../param/AuthParam"
import authRequest from "../request/AuthRequest"
import token from "../lib/Token"
import { useNavigate } from "react-router-dom"
import KepoEmailField from "../common/KepoEmailField"
import { UIStatus } from "../lib/ui-status"
import KepoDialogErrorAlert from "../common/KepoDialogErrorAlert"

interface ErrorNotice {
    hasError: boolean,
    error?: KepoError
}

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

interface RegisterState {
    data: RegisterData,
    status: UIStatus.IDLE | UIStatus.LOADING | UIStatus.ERROR | UIStatus.SUCCESS,
    error?: KepoError
}

interface RegisterData {
    username: string,
    email: string,
    password: string,
    passwordConfirmation: string,
}

const RegisterForm = () => {
    const navigate = useNavigate()
    const [registerState, setRegisterState] = useState<RegisterState>({
        status: UIStatus.IDLE,
        data: {
            username: '',
            email: '',
            passwordConfirmation: '',
            password: ''
        },
    })

    const register = () => {
        (async () => {
            try {
                const param: RegisterParam = {
                    email: registerState.data.email,
                    username: registerState.data.username,
                    password: registerState.data.password

                }
                const tokenResult = await authRequest.register(param)
                token.setToken(tokenResult)
                setRegisterState(prev => {
                    const next = {...prev}
                    next.status = UIStatus.SUCCESS
                    return next
                })
            } catch (error) {
                if (error instanceof KepoError) {
                    setRegisterState(prev => {
                        const next = {...prev}
                        next.status = UIStatus.ERROR
                        next.error = error as KepoError
                        return next
                    })
                }
            }
        })()
    }

    const isPasswordConfirmed = 
        registerState.data.passwordConfirmation.length > 0 
        && registerState.data.passwordConfirmation === registerState.data.password

    const getPasswordConfirmationWarning: () => string | undefined = () => {
        if (!isPasswordConfirmed)
            return "Password tidak sesuai"
    }

    useEffect(() => {
        if (registerState.status === UIStatus.LOADING) {
            register()
        }
        if (registerState.status === UIStatus.SUCCESS) {
            navigate("/login", {replace: true})
        }
    }, [registerState])

    return <Sheet
        variant="soft"
        sx={styleform}
    >
        <KepoDialogErrorAlert
            text={registerState.error?.message}
            show={registerState.status === UIStatus.ERROR}
            onClose={() => {
                setRegisterState(prev => {
                    const next = {...prev}
                    next.status = UIStatus.IDLE
                    next.error = undefined
                    return next
                })
            }}
        />
        <form
            onSubmit={(event) => {
                event.preventDefault();
                setRegisterState(prev => {
                    const next = {...prev}
                    next.status = UIStatus.LOADING
                    return next
                })
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                <KepoEmailField value={registerState.data.email} onChange={(event) => {
                    setRegisterState(prev => {
                        const next = {...prev}
                        next.data.email = event.target.value
                        return next
                    })
                }}/>
                <KepoUsernameField value={registerState.data.username} onChange={(event) => {
                    setRegisterState(prev => {
                        const next = {...prev}
                        next.data.username = event.target.value
                        return next
                    })
                }}/>
                <KepoPasswordField value={registerState.data.password} onChange={(event) => {
                    setRegisterState(prev => {
                        const next = {...prev}
                        next.data.password = event.target.value
                        return next
                    })
                }}/>
                <KepoPasswordField 
                    placeholder="Confirm Password" 
                    value={registerState.data.passwordConfirmation} 
                    onChange={(event) => {
                        setRegisterState(prev => {
                                    const next = {...prev}
                                    next.data.passwordConfirmation = event.target.value
                                    return next
                                }
                            )
                        }
                    }    
                    invalid={!isPasswordConfirmed}
                    warningMessage={getPasswordConfirmationWarning()}
                />
                <Button 
                    sx={{ mt: 1 /* margin top */ }} 
                    type="submit" 
                    loading={registerState.status === UIStatus.LOADING}>
                        Register
                </Button>
            </Box>
        </form>
    </Sheet>
}
export default RegisterForm