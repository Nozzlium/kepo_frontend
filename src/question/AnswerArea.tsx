import { Box, Button, Sheet } from "@mui/joy"
import KepoQuestionCard from "../common/KepoQuestionCard"
import Question from "../data/Question"
import Answer from "../data/Answer"
import { useEffect, useRef, useState } from "react"
import KepoAnswerCard from "./KepoAnswercard"
import { Create } from "@mui/icons-material"
import NewAnswerModal from "./NewAnswerModal"
import axios from "axios"
import { AnswersResponse } from "../response/AnswersResponse"
import { AnswerParam } from "../param/AnswerParam"
import Progress from "../common/Progress"
import QuestionResponse from "../response/QuestionResponse"
import { useParams } from "react-router-dom"
import questionRequest from "../request/QuestionRequest"
import answerRequest from "../request/AnswerRequest"
import MainKepoCreateButton from "../common/MainKepoCreateButton"
import { UIStatus } from "../lib/ui-status"

interface QuestionState {
    status: UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR,
    data?: Question
}

interface AnswersState {
    status: UIStatus.IDLE | UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR,
    page: number,
    data: Answer[]
}

type RouteParams = {
    id: string
}

const AnswerArea = () => {
    const [questionState, setQuestionState] = useState<QuestionState>({
        status: UIStatus.LOADING
    })
    const [answersState, setAnswersState] = useState<AnswersState>({
        status: UIStatus.IDLE,
        data: [],
        page: 0
    })
    const [answerDialogOpen, setAnswerDialogOpen] = useState<boolean>(false)

    const { id } = useParams<RouteParams>()

    const onAnswerSubmit = (answer: Answer) => {
        // const curr = answers.slice()
        // curr.splice(0, 0, answer)
        // setAnswers(curr)
    }

    const loadQuestion: (id: string) => void = (id: string) => {
        try {
            (async () => {
                const questionResult = await questionRequest.getById(id)
                setQuestionState(prev => {
                    const next = {...prev}
                    next.data = questionResult
                    next.status = UIStatus.SUCCESS
                    return next
                })
            })()
        } catch (error) {

        }
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
                        next.data = next.data.concat(answersResult)
                        next.page = currentPage
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
        if (questionState.status === UIStatus.LOADING) {
            loadQuestion(id ?? '0')
        }
        if (questionState.status === UIStatus.SUCCESS) {
            setAnswersState(prev => {
                const next = {...prev}
                next.status = UIStatus.LOADING
                return next
            })
        }
    }, [questionState])

    useEffect(() => {
        if (answersState.status === UIStatus.LOADING) {
            loadAnswers()
        }
    }, [answersState])

    const openNewAnswerDialog = () => {
        setAnswerDialogOpen(!answerDialogOpen)
    }

    const listItem = answersState.data.map(answer => (
        <li><KepoAnswerCard answer={answer}/></li>
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
                        open={answerDialogOpen} 
                        setOpen={setAnswerDialogOpen} 
                        onAnswerPosted={onAnswerSubmit}
                        question={questionState.data}
                    />
                    <MainKepoCreateButton text="Write Answer" onClick={() => openNewAnswerDialog()} />
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