import { Box, Tab, TabList, TabPanel, Tabs, Typography } from "@mui/joy"
import UserQuestionsList from "./UserQuestionsList"
import UserAnswerList from "./UserAnswerList"
import UserLikedQuestions from "./UserLikedQuestions"
import User from "../data/User"
import { useParams } from "react-router-dom"
import userDetailRequest from "../request/UserDetailsRequest"
import { useEffect, useRef, useState } from "react"
import Progress from "../common/Progress"
import { UIStatus } from "../lib/ui-status"
import { KepoError } from "../error/KepoError"

type RouteParams = {
    id: string
}

interface UserState {
    status: UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR
    data?: User
    error?: KepoError
}

const UserContentArea = (
    {
        onError
    } : {
        onError?: (error?: KepoError) => void
    }
) => {
    const [userState, setUserState] = useState<UserState>({
        status: UIStatus.LOADING,
    })

    const { id } = useParams<RouteParams>()

    const loadUser = (userId: string) => {
        try {
            (async () => {
                const userIdNumber = parseInt(userId);
                const userResult = await userDetailRequest.getDetailsById(userIdNumber)
                setUserState(prev => {
                    const next = {...prev}
                    next.status = UIStatus.SUCCESS
                    next.data = userResult
                    return next
                })
            })()
        } catch (error) {
            switch (true) {
                case error instanceof KepoError:
                    setUserState(prev => {
                        const next = {...prev}
                        next.status = UIStatus.ERROR
                        next.error = error as KepoError
                        return next
                    })
                    break
                default:
                    setUserState(prev => {
                        const next = {...prev}
                        next.status = UIStatus.ERROR
                        next.error = new KepoError("UnknownError", "Udin")
                        return next
                    })
                    break
            }
        }
    }

    useEffect(() => {
        setUserState(prev => {
            const next = {...prev}
            next.status = UIStatus.LOADING
            return next
        })
    }, [id]);

    useEffect(() => {
        if (userState.status === UIStatus.LOADING) {
            loadUser(id ? id : "0")
        }
        if (userState.status === UIStatus.ERROR) {
            if (onError) {
                onError(userState.error)
            }
        }

    }, [userState])

    return <Box
        sx={(theme) => ({
            [theme.breakpoints.down('md')]: {
                display: 'flex',
                flexDirection: 'column',
                px: 1,
                my: 1
            },
            [theme.breakpoints.up('md')]: {
                display: 'flex',
                flexDirection: 'column',
                width: 700,
                my: 1
            }
        })}
    >
        {
            (userState.status === UIStatus.LOADING || !userState.data) ?
                <Progress /> :
                <>
                    <Typography 
                        level="h4" 
                        sx={{ 
                            my: 1,
                            textAlign: 'start'
                        }}
                    ><b>Aktivitas-aktivitas {userState.data.username}</b></Typography>
                    <Tabs defaultValue={0}
                        sx={{
                            zIndex: 0,
                            borderRadius: 'sm',
                            boxShadow: 'md'
                        }}
                    >
                        <TabList
                            tabFlex={1}
                        >
                            <Tab>Pertanyaan</Tab>
                            <Tab>Jawaban</Tab>
                            <Tab>Yang Disukai</Tab>
                        </TabList>
                        <TabPanel value={0}>
                            <UserQuestionsList 
                                user={userState.data}
                                onError={onError}
                            />
                        </TabPanel>
                        <TabPanel value={1}>
                            <UserAnswerList 
                                user={userState.data}
                                onError={onError}
                            />
                        </TabPanel>
                        <TabPanel value={2}>
                            <UserLikedQuestions 
                                user={userState.data}
                                onError={onError}
                            />
                        </TabPanel>
                    </Tabs>
                </>
        }
    </Box>
}

export default UserContentArea