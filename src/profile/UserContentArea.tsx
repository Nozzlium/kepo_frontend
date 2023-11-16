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

type RouteParams = {
    id: string
}

interface UserState {
    status: UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR,
    data?: User 
}

const UserContentArea = () => {
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
                    ><b>{userState.data.username}'s activities</b></Typography>
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
                            <Tab>Questions</Tab>
                            <Tab>Answers</Tab>
                            <Tab>Likes</Tab>
                        </TabList>
                        <TabPanel value={0}>
                            <UserQuestionsList user={userState.data}/>
                        </TabPanel>
                        <TabPanel value={1}>
                            <UserAnswerList user={userState.data}/>
                        </TabPanel>
                        <TabPanel value={2}>
                            <UserLikedQuestions user={userState.data}/>
                        </TabPanel>
                    </Tabs>
                </>
        }
    </Box>
}

export default UserContentArea