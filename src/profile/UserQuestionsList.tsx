import { Box, Button, List, ListItem, Sheet } from "@mui/joy"
import { useEffect, useState } from "react"
import Question from "../data/Question"
import KepoQuestionCard from "../common/KepoQuestionCard"
import User from "../data/User"
import questionRequest from "../request/QuestionRequest"
import { UIStatus } from "../lib/ui-status"
import axios, { CancelToken } from "axios"

interface QuestionsState {
    status: UIStatus.IDLE | UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR,
    data: Question[],
    page: number,
}

const UserQuestionsList = ({
    user
}:{
    user: User
}) => {
    const [questionsState, setQuestionsState] = useState<QuestionsState>({
        status: UIStatus.LOADING,
        data: [],
        page: 0
    })

    const loadQuestions = (
        cancelToken?: CancelToken
    ) => {
        (async () => {
            try {
                const [questions, page] = await questionRequest.getByUser(user.id, {
                    pageNo: questionsState.page + 1,
                    pageSize: 10
                }, cancelToken)
                setQuestionsState(prev => {
                    const next = {...prev}
                    if (questions.length > 0) {
                        next.data = prev.data.concat(questions)
                        next.page = page
                    }
                    next.status = UIStatus.SUCCESS
                    return next
                })
            } catch (error) {
                
            }
        })()
    }

    const items = questionsState.data.map(question => 
        <ListItem key={question.id} sx={{ px:0 }}><KepoQuestionCard question={question}/></ListItem>
    )

    const loadMore = () => {
        console.log("masuk load more")
        setQuestionsState(prev => {
            const next = {...prev}
            next.status = UIStatus.LOADING
            return next
        })
    }

    useEffect(() => {
        const CancelToken = axios.CancelToken
        const source = CancelToken.source()
        if (questionsState.status === UIStatus.LOADING) {
            loadQuestions(source.token)
        }

        return () => {
            source.cancel()
        }
    }, [questionsState])

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
        <Button 
            variant="plain" 
            color="neutral" 
            onClick={() => loadMore()} 
            loading={questionsState.status === UIStatus.LOADING}
        >Load More</Button>
    </Box>
}

export default UserQuestionsList