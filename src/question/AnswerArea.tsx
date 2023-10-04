import { Box, Button, Sheet } from "@mui/joy"
import KepoQuestionCard from "../common/KepoQuestionCard"
import Question from "../data/Question"
import Answer from "../data/Answer"
import { useEffect, useRef, useState } from "react"
import KepoAnswerCard from "../common/KepoAnswercard"
import NewAnswerModal from "./NewAnswerModal"
import Progress from "../common/Progress"
import { useNavigate, useParams } from "react-router-dom"
import questionRequest from "../request/QuestionRequest"
import answerRequest from "../request/AnswerRequest"
import MainKepoCreateButton from "../common/MainKepoCreateButton"
import { UIStatus } from "../lib/ui-status"
import User from "../data/User"
import userDetailRequest from "../request/UserDetailsRequest"

interface QuestionPageState {
    status: UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR,
    data?: Question,
    user?: User
}

interface AnswersState {
    status: UIStatus.IDLE | UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR,
    page: number,
    data: Answer[],
    newAnswerDialogOpen: boolean
}

type RouteParams = {
    id: string
}

const AnswerArea = () => {
    const navigate = useNavigate()
    const [questionState, setQuestionState] = useState<QuestionPageState>({
        status: UIStatus.LOADING
    })
    const [answersState, setAnswersState] = useState<AnswersState>({
        status: UIStatus.IDLE,
        data: [],
        page: 0,
        newAnswerDialogOpen: false
    })

    const { id } = useParams<RouteParams>()

    const onAnswerSubmit = (answer: Answer) => {
        setAnswersState(prev => {
            const next = {...prev}
            next.data = [answer, ...prev.data]
            next.newAnswerDialogOpen = false
            return next
        })
    }

    const loadQuestion: (
        id: string,
        signal?: AbortSignal
    ) => void = (id: string, signal?: AbortSignal) => {
        (async () => {
            const questionPageState: QuestionPageState = {
                status: UIStatus.SUCCESS
            }
            try {
                const userResult = await userDetailRequest.getDetails(signal)
                questionPageState.user = userResult
            } catch (error) {
                if (signal?.aborted) {
                    return
                }
            }

            try {
                const questionResult = await questionRequest.getById(id, signal)
                questionPageState.data = questionResult
            } catch (error) {
                if (signal?.aborted) {
                    return
                }
            }
            setQuestionState(_prev => {
                return questionPageState
            })
        })()
    }

    const loadAnswers = () => {
        try {
            (async () => {
                if (questionState.status === UIStatus.SUCCESS && questionState.data) {
                    const [answersResult, currentPage] = await answerRequest.getByQuestion(
                        questionState.data.id, {
                            pageNo: answersState.page + 1,
                            pageSize: 10
                    })
                    setAnswersState(prev => {
                        const next = {...prev}
                        if (answersResult.length > 0) {
                            next.data = next.data.concat(answersResult)
                            next.page = currentPage
                        }
                        next.status = UIStatus.SUCCESS
                        return next
                    })
                }
            })()   
        } catch (error) {
            
        }
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
        if (questionState.status === UIStatus.LOADING) {
            loadQuestion(id ?? '0', controller.signal)
        }
        if (questionState.status === UIStatus.SUCCESS) {
            setAnswersState(prev => {
                const next = {...prev}
                next.status = UIStatus.LOADING
                return next
            })
        }

        return () => {
            controller.abort()
        }
    }, [questionState])

    useEffect(() => {
        if (answersState.status === UIStatus.LOADING) {
            loadAnswers()
        }
    }, [answersState])

    const openNewAnswerDialog = () => {
        setAnswersState(prev => {
            const next = {...prev}
            next.newAnswerDialogOpen = true
            return next
        })
    }

    const listItem = answersState.data.map(answer => (
        <li key={answer.id}><KepoAnswerCard answer={answer}/></li>
    ))

    return <Box
        sx={(theme) => ({
            [theme.breakpoints.down('md')]: {
                display: 'flex',
                flexDirection: 'column',
                px: 1,
                my: 1,
                gap: 1
            },
            [theme.breakpoints.up('md')]: {
                display: 'flex',
                flexDirection: 'column',
                width: 700,
                my: 1,
                gap: 1
            }
        })}
    >
        {
            questionState.status === UIStatus.LOADING || !questionState.data ?
                <Progress /> :
                <>
                    <KepoQuestionCard question={questionState.data}/>
                    <NewAnswerModal
                        open={answersState.newAnswerDialogOpen}
                        closeDialog={() => {
                            setAnswersState(prev => {
                                const next = {...prev}
                                next.newAnswerDialogOpen = false
                                return next
                            })
                        }}
                        onAnswerPosted={onAnswerSubmit}
                        question={questionState.data}
                    />
                    {
                        questionState.user ?
                        <MainKepoCreateButton text="Write Answer" onClick={() => openNewAnswerDialog()} /> :
                        <Button
                            onClick={() => {
                                navigate('/login')
                            }}
                            sx={{
                                backgroundColor: '#eb6f00',
                                color: '#f2f2f2',
                                "&:hover": {
                                    backgroundColor: '#aa5000'
                                }
                            }}
                        >Login to post an answer</Button>
                    }
                    <Sheet
                        sx={{
                            borderRadius: 'sm',
                            boxShadow: 'md'
                        }}
                    >
                        <ul style={{
                            listStyleType: 'none',
                            padding: 0
                        }}>{listItem}</ul>
                    </Sheet>
                    <Button 
                        variant="plain" 
                        color="neutral" 
                        onClick={() => loadMore()} 
                        loading={answersState.status === UIStatus.LOADING}
                    >Load More</Button>
                </>
        }
    </Box>
}

export default AnswerArea