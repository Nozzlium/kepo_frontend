import { Sheet, Tab, TabList, TabPanel, Tabs, Typography } from "@mui/joy"
import UserQuestionsList from "./UserQuestionsList"
import UserAnswerList from "./UserAnswerList"
import UserLikedQuestions from "./UserLikedQuestions"
import User from "../data/User"

const dummy: User = {
    id: 1,
    name: "Chun-Li"
}

const UserContentArea = () => {
    return <Sheet
        
        sx={(theme) => ({
            [theme.breakpoints.down('md')]: {
                display: 'flex',
                flexDirection: 'column',
                px: 1
            },
            [theme.breakpoints.up('md')]: {
                display: 'flex',
                flexDirection: 'column',
                width: 700
            }
        })}
    >
        <Typography 
            level="h4" 
            sx={{ 
                my: 1,
                textAlign: 'start'
            }}
        ><b>Hello, {'Username'}</b></Typography>
        <Tabs defaultValue={0}>
            <TabList
                tabFlex={1}
            >
                <Tab>Questions</Tab>
                <Tab>Answers</Tab>
                <Tab>Likes</Tab>
            </TabList>
            <TabPanel value={0}>
                <UserQuestionsList user={dummy}/>
            </TabPanel>
            <TabPanel value={1}>
                <UserAnswerList user={dummy}/>
            </TabPanel>
            <TabPanel value={2}>
                <UserLikedQuestions/>
            </TabPanel>
        </Tabs>
    </Sheet>
}

export default UserContentArea