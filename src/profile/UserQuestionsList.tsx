import { Box, Button, List, ListItem, Sheet, Typography } from "@mui/joy"
import { useEffect, useState } from "react"
import Question from "../data/Question"
import KepoQuestionCard from "../common/KepoQuestionCard"
import User from "../data/User"
import questionRequest from "../request/QuestionRequest"
import { UIStatus } from "../lib/ui-status"
import axios, { CancelToken } from "axios"
import ListElement from "../common/ListElement"
import { KepoError } from "../error/KepoError"

interface QuestionsState {
    status: UIStatus.IDLE | UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR,
    data: Question[],
    page: number,
    error?: KepoError
}

const UserQuestionsList = ({
    user,
    onError
}:{
    user: User,
    onError?: (error?: KepoError) => void
}) => {
    const [questionsState, setQuestionsState] = useState<QuestionsState>({
        status: UIStatus.LOADING,
        data: [],
        page: 0
    })

    const loadQuestions = (
        signal?: AbortSignal
    ) => {
        (async () => {
            try {
                const [questions, page] = await questionRequest.getByUser(user.id, {
                    pageNo: questionsState.page + 1,
                    pageSize: 10
                }, signal)
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
                if (signal?.aborted) {
                    return
                }

                switch (true) {
                    case error instanceof KepoError:
                        setQuestionsState(prev => {
                            const next = {...prev}
                            next.status = UIStatus.ERROR
                            next.error = error as KepoError
                            return next
                        })
                        break
                    default:
                        setQuestionsState(prev => {
                            const next = {...prev}
                            next.status = UIStatus.ERROR
                            next.error = new KepoError("UnknownError", "Udin")
                            return next
                        })
                        break
                }
            }
        })()
    }

    const items = questionsState.data.map(question => 
        <ListItem key={question.id} sx={{ px:0 }}><KepoQuestionCard question={question}/></ListItem>
    )

    const loadMore = () => {
        setQuestionsState(prev => {
            const next = {...prev}
            next.status = UIStatus.LOADING
            return next
        })
    }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        if (questionsState.status === UIStatus.LOADING) {
            loadQuestions(signal)
        }

        if (questionsState.status === UIStatus.ERROR) {
            if (onError) {
                onError(questionsState.error)
            }
        }

        return () => {
            controller.abort()
        }
    }, [questionsState])

    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column'
        }}
    >
        <ListElement
            status={questionsState.status}
            items={items}
            emptyMessage="Tidak ada pertanyaan"
        />
        <Button 
            variant="plain" 
            color="neutral" 
            onClick={() => loadMore()} 
            loading={questionsState.status === UIStatus.LOADING}
        >Muat lebih banyak lagi</Button>
    </Box>
}

export default UserQuestionsList