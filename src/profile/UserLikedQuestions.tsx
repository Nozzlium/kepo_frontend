import { ListItem, Sheet, List, Button, Typography } from "@mui/joy"
import { useEffect, useRef, useState } from "react"
import KepoQuestionCard from "../common/KepoQuestionCard"
import Question from "../data/Question"
import User from "../data/User"
import questionRequest from "../request/QuestionRequest"
import { QuestionParam } from "../param/QuestionParam"
import { UIStatus } from "../lib/ui-status"
import axios, { CancelToken } from "axios"

interface QuestionsState {
    page: number,
    data: Question[],
    status: UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR
}

const UserLikedQuestions = (
    {
        user
    }:{
        user: User
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
        cancelToken?: CancelToken
    ) => {
        (async () => {
            try {
                const [questionsResult, page] = await questionRequest.getLikedByUser(user.id, {
                    pageNo: questionsState.page + 1,
                    pageSize: 10
                }, cancelToken)
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
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        if (questionsState.status === UIStatus.LOADING) {
            loadQuestions(source.token)
        }

        return () => {
            source.cancel()
        }
    }, [questionsState])

    return <Sheet
        sx={{
            display: 'flex',
            flexDirection: 'column'
        }}
    >
        {
            questionsState.data.length > 0 ?
            <List style={{
                listStyleType: 'none',
                padding: 0
            }} >{items}</List> :
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    padding: '16px 0 16px 0'
                }}
            >
                <Typography
                    level="body-sm"
                ><b>Tidak ada pertanyaan</b></Typography>
            </div>
        }
        <Button 
            variant="plain" 
            color="neutral" 
            onClick={() => loadMore()}
            loading={questionsState.status === UIStatus.LOADING}
        >Load More</Button>    
    </Sheet>
}

export default UserLikedQuestions