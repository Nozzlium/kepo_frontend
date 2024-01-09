import { Box, Button, ListItem } from "@mui/joy"
import { useEffect, useState } from "react"
import Answer from "../data/Answer"
import KepoAnswerCard from "../common/KepoAnswercard"
import User from "../data/User"
import answerRequest from "../request/AnswerRequest"
import { UIStatus } from "../lib/ui-status"
import axios, { CancelToken } from "axios"
import ListElement from "../common/ListElement"
import { KepoError } from "../error/KepoError"

interface AnswersState {
    page: number
    data: Answer[]
    status: UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR
    error?: KepoError
}

const UserAnswerList = ({
    user,
    onError
}:{
    user: User,
    onError?: (error?: KepoError) => void
}) => {
    const [answersState, setAnswersState] = useState<AnswersState>({
        page: 0,
        data: [],
        status: UIStatus.LOADING
    })

    const items = answersState.data.map(answer => 
        <ListItem sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch'
        }}><KepoAnswerCard answer={answer} user={user}/></ListItem>
    )

    const loadAnswers = (
        signal?: AbortSignal
    ) => {
        (async () => {
            try {
                const [answersResult, currentPage] = await answerRequest.getByUser(user.id, {
                    pageNo: answersState.page + 1,
                    pageSize: 10
                }, signal)
                setAnswersState(prev => {
                    const next = {...prev}
                    if (answersResult.length > 0) {
                        next.data = prev.data.concat(answersResult)
                        next.page = currentPage
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
                        setAnswersState(prev => {
                            const next = {...prev}
                            next.status = UIStatus.ERROR
                            next.error = error as KepoError
                            return next
                        })
                        break
                    default:
                        console.log(error)
                        setAnswersState(prev => {
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
        setAnswersState(prev => {
            const next = {...prev}
            next.status = UIStatus.LOADING
            return next
        })
    }

    useEffect(() => {
        const controller = new AbortController()
        if (answersState.status === UIStatus.LOADING) {
            loadAnswers(controller.signal)
        }
        if (answersState.status === UIStatus.ERROR) {
            if (onError) {
                onError(answersState.error)
            }
        }

        return () => {
            controller.abort()
        }
    }, [answersState])

    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
        }}
    >
        <ListElement
            status={answersState.status}
            items={items}
            emptyMessage="Tidak ada pertanyaan"
        />
        <Button 
            variant="plain" 
            color="neutral" 
            onClick={() => loadMore()}
            loading={answersState.status === UIStatus.LOADING}
        >Muat lebih banyak lagi</Button>    
    </Box>
}

export default UserAnswerList