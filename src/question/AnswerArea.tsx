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

type RouteParams = {
    id: string
}

const AnswerArea = () => {
    const [isQuestionLoading, setIsQuestionLoading] = useState<boolean>(true)
    const [answers, setAnswers] = useState<Answer[]>(Array())
    const [isAnswersLoading, setIsAnswersLoading] = useState<boolean>(true)
    const [answerDialogOpen, setAnswerDialogOpen] = useState<boolean>(false)
    const question = useRef<Question>()
    const page = useRef<number>(1)

    const { id } = useParams<RouteParams>()

    const onAnswerSubmit = (answer: Answer) => {
        const curr = answers.slice()
        curr.splice(0, 0, answer)
        setAnswers(curr)
    }

    const loadQuestion: (id: string) => void = (id: string) => {
        setIsQuestionLoading(true);
        (async () => {
            const questionResult = await questionRequest.getById(id)
            question.current = questionResult
            setIsQuestionLoading(false)
            loadAnswers()
        })()
    }

    const loadAnswers = () => {
        setIsAnswersLoading(true);
        (async () => {
            if (question.current) {
                const curr = answers.slice()
                const params: AnswerParam = {
                    pageNo: page.current,
                    pageSize: 10
                }
                const [answersResult, currentPage] = await answerRequest.getByQuestion(question.current.id, params)
                const result = curr.concat(answersResult)
                page.current = currentPage + 1
                setIsAnswersLoading(false)
                setAnswers(result)
            }
        })()
    }

    useEffect(() => {
        loadQuestion(id ? id : '0')
    }, [])

    const openNewAnswerDialog = () => {
        setAnswerDialogOpen(!answerDialogOpen)
    }

    const listItem = answers.map(answer => (
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
            isQuestionLoading || !question.current ?
                <Progress /> :
                <>
                    <KepoQuestionCard question={question.current}/>
                    <NewAnswerModal 
                        open={answerDialogOpen} 
                        setOpen={setAnswerDialogOpen} 
                        onAnswerPosted={onAnswerSubmit}
                        question={question.current}
                    />
                </>
        }
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
        <Button variant="plain" color="neutral" onClick={() => loadAnswers()} loading={isAnswersLoading}>Load More</Button>
        
    </Box>
}

export default AnswerArea