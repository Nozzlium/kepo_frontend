import { Button, List, ListItem, Sheet } from "@mui/joy"
import { useEffect, useRef, useState } from "react"
import Question from "../data/Question"
import KepoQuestionCard from "../common/KepoQuestionCard"
import axios from "axios"
import QuestionsResponse from "../response/QuestionsResponse"
import User from "../data/User"
import QuestionParam from "../param/QuestionParam"

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
            const url = `http://localhost:2637/api/user/${user.id}/question`
            console.log(url)
            const param: QuestionParam = {
                pageNo: page.current,
                pageSize: 10
            }
            const response = await axios.get<QuestionsResponse>(url, {params: param})
            console.log(response)
            const questionsData = response.data.data.questions
            if (questionsData.length > 0) {
                const curr = questions.slice()
                const result = curr.concat(questionsData)
                page.current = response.data.data.page + 1
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

    return <Sheet
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
    </Sheet>
}

export default UserQuestionsList