import { Box, Button, List, ListItem, Sheet } from "@mui/joy"
import { useEffect, useState } from "react"
import Answer from "../data/Answer"
import KepoAnswerCard from "../question/KepoAnswercard"
import User from "../data/User"
import answerRequest from "../request/AnswerRequest"
import { UIStatus } from "../lib/ui-status"
import axios, { CancelToken } from "axios"

interface AnswersState {
    page: number,
    data: Answer[],
    status: UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR
}

const UserAnswerList = ({
    user
}:{
    user: User
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
        }}><KepoAnswerCard answer={answer}/></ListItem>
    )

    const loadAnswers = (
        cancelToken?: CancelToken
    ) => {
        (async () => {
            try {
                const [answersResult, currentPage] = await answerRequest.getByUser(user.id, {
                    pageNo: answersState.page + 1,
                    pageSize: 10
                }, cancelToken)
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
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();
        if (answersState.status === UIStatus.LOADING) {
            loadAnswers(source.token)
        }

        return () => {
            source.cancel()
        }
    }, [answersState])

    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
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
            loading={answersState.status === UIStatus.LOADING}
        >Load More</Button>    
    </Box>
}

export default UserAnswerList