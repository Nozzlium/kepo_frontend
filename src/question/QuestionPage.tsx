import { Sheet } from "@mui/joy"
import KepoNavbar from "../common/KepoNavbar"
import AnswerArea from "./AnswerArea"
import Question from "../data/Question"
import { useEffect, useRef, useState } from "react"
import Progress from "../common/Progress"
import { useParams } from "react-router-dom"
import axios from "axios"
import QuestionResponse from "../response/QuestionResponse"

type RouteParams = {
    id: string
}

const QuestionDisplay = ({
    question
}: {question: Question | null}) => {
    if (question === null) {
        return <Progress/>
    }

    return <AnswerArea question={question}/>
}

const QuestionPage = () => {
    const [isQuestionLoading, setIsQuestionLoading] = useState<boolean>(true)
    const question = useRef<Question | null>(null)

    const { id } = useParams<RouteParams>()

    const loadQuestion: (id: string) => void = (id: string) => {
        (async () => {
            const questionResponse = await axios.get<QuestionResponse>(`http://localhost:2637/api/question/${id}`)
            question.current = questionResponse.data.data
            setIsQuestionLoading(false)
        })()
    }

    useEffect(() => {
        loadQuestion(id ? id : "0")
    }, [])

    return <Sheet
        className="page"
        sx={{
            display: 'flex',
            flexDirection: 'column',
        }}
    >
        <Sheet
            sx={{
                position: "fixed",
                width: "100%",
                zIndex: 1
            }}
        >
            <KepoNavbar/>
        </Sheet>
        <Sheet
            sx={{
                zIndex: -1
            }}
        >
            <KepoNavbar/>
        </Sheet>
        <Sheet
            sx={(theme) => ({
                [theme.breakpoints.down('md')]: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                },
                [theme.breakpoints.up('md')]: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems:'center',
                }
            })}
        >
            {
                isQuestionLoading ?
                <Progress/> :
                <QuestionDisplay question={question.current}/>
            }
        </Sheet>
    </Sheet>
}

export default QuestionPage