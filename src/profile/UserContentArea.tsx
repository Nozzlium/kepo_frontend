import { Box, Sheet, Tab, TabList, TabPanel, Tabs, Typography } from "@mui/joy"
import UserQuestionsList from "./UserQuestionsList"
import UserAnswerList from "./UserAnswerList"
import UserLikedQuestions from "./UserLikedQuestions"
import User from "../data/User"
import { useParams } from "react-router-dom"
import userDetailRequest from "../request/UserDetailsRequest"
import { useEffect, useRef, useState } from "react"
import Progress from "../common/Progress"

const dummy: User = {
    id: 1,
    username: "Chun-Li"
}

type RouteParams = {
    id: string
}

const UserContentArea = () => {
    const [isUserLoading, setUserLoading] = useState<boolean>()
    const user = useRef<User>()

    const { id } = useParams<RouteParams>()

    const loadUser = (userId: string) => {
        try {
            setUserLoading(true);
            (async () => {
                const userIdNumber = parseInt(userId);
                const userResult = await userDetailRequest.getDetailsById(userIdNumber)
                user.current = userResult
                setUserLoading(false)
            })()
        } catch (error) {
            console.log("caught")
        }
    }

    useEffect(() => {
        loadUser(id ? id : "0")
    }, [])

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
            (isUserLoading || !user.current) ?
                <Progress /> :
                <>
                    <Typography 
                        level="h4" 
                        sx={{ 
                            my: 1,
                            textAlign: 'start'
                        }}
                    ><b>{user.current.username}'s activities</b></Typography>
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
                            <UserQuestionsList user={user.current}/>
                        </TabPanel>
                        <TabPanel value={1}>
                            <UserAnswerList user={user.current}/>
                        </TabPanel>
                        <TabPanel value={2}>
                            <UserLikedQuestions user={user.current}/>
                        </TabPanel>
                    </Tabs>
                </>
        }
    </Box>
}

export default UserContentArea