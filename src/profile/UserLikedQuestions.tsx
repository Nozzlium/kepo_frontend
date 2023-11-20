import { ListItem, Sheet, List, Button, Typography } from "@mui/joy"
import { useEffect, useRef, useState } from "react"
import KepoQuestionCard from "../common/KepoQuestionCard"
import Question from "../data/Question"
import User from "../data/User"
import questionRequest from "../request/QuestionRequest"
import { QuestionParam } from "../param/QuestionParam"
import { UIStatus } from "../lib/ui-status"
import axios, { CancelToken } from "axios"
import ListElement from "../common/ListElement"
import { KepoError } from "../error/KepoError"

interface QuestionsState {
    page: number
    data: Question[]
    status: UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR
    error?: KepoError
}

const UserLikedQuestions = (
    {
        user,
        onError
    }:{
        user: User,
        onError?: (error?: KepoError) => void
    }) => {
    const [questionsState, setQuestionsState] = useState<QuestionsState>({
        page: 0,
        data: [],
        status: UIStatus.LOADING
    })

    const items = questionsState.data.map(question => 
        <ListItem key={question.id} sx={{ px:0 }}><KepoQuestionCard question={question}/></ListItem>
    )

    const loadQuestions = (
        signal?: AbortSignal
    ) => {
        (async () => {
            try {
                const [questionsResult, page] = await questionRequest.getLikedByUser(user.id, {
                    pageNo: questionsState.page + 1,
                    pageSize: 10
                }, signal)
                setQuestionsState(prev => {
                    const next = {...prev}
                    if (questionsResult.length > 0) {
                        next.data = prev.data.concat(questionsResult)
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

    const loadMore = () => {
        setQuestionsState(prev => {
            const next = {...prev}
            next.status = UIStatus.LOADING
            return next
        })
    }

    useEffect(() => {
        const controller = new AbortController()
        if (questionsState.status === UIStatus.LOADING) {
            loadQuestions(controller.signal)
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

    return <Sheet
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
        >Load More</Button>    
    </Sheet>
}

export default UserLikedQuestions