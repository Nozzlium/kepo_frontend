import { Box, Button, List, ListItem, Sheet } from "@mui/joy"
import { useEffect, useRef, useState } from "react"
import Question from "../data/Question"
import KepoQuestionCard from "../common/KepoQuestionCard"
import axios from "axios"
import QuestionsResponse from "../response/QuestionsResponse"
import User from "../data/User"
import { QuestionParam } from "../param/QuestionParam"
import questionRequest from "../request/QuestionRequest"

const UserQuestionsList = ({
    user
}:{
    user: User
}) => {
    const [questions, setQuestions] = useState<Question[]>([])
    const [isQuestionsLoading, setIsQuestionsLoading] = useState<boolean>(true)
    const page = useRef<number>(1)

    const items = questions.map(question => 
        <ListItem key={question.id} sx={{ px:0 }}><KepoQuestionCard question={question}/></ListItem>
    )

    const load = () => {
        setIsQuestionsLoading(true);
        (async () => {
            const param: QuestionParam = {
                pageNo: page.current,
                pageSize: 10
            }
            const [questionsResult, currentPage] = await questionRequest.getByUser(user.id, param)
            if (questionsResult.length > 0) {
                const curr = questions.slice()
                const result = curr.concat(questionsResult)
                page.current = currentPage + 1
                setIsQuestionsLoading(false)
                setQuestions(result)
            } else {
                setIsQuestionsLoading(false)
            }
        })()
    }

    useEffect(() => {
        load()
    }, [])

    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column'
        }}
    >
        <List style={{
            listStyleType: 'none',
            padding: 0
        }} >{items}</List>
        <Button variant="plain" color="neutral" onClick={() => load()} loading={isQuestionsLoading}>Load More</Button>
    </Box>
}

export default UserQuestionsList