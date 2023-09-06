import { Button, Sheet } from "@mui/joy"
import KepoQuestionCard from "../common/KepoQuestionCard"
import Question from "../data/Question"
import Answer from "../data/Answer"
import { useEffect, useRef, useState } from "react"
import KepoAnswerCard from "./KepoAnswercard"
import { Create } from "@mui/icons-material"
import NewAnswerModal from "./NewAnswerModal"
import axios from "axios"
import AnswersResponse from "../response/AnswersResponse"
import AnswerParam from "../param/AnswerParam"

const AnswerArea = (
    {
        question
    }: {
        question: Question
    }
) => {
    const [answers, setAnswers] = useState<Answer[]>(Array())
    const [isAnswersLoading, setIsAnswersLoading] = useState<boolean>(true)
    const [answerDialogOpen, setAnswerDialogOpen] = useState<boolean>(false)
    const page = useRef<number>(1)

    const loadAnswers = () => {
        setIsAnswersLoading(true);
        (async () => {
            const curr = answers.slice()
            const params: AnswerParam = {
                pageNo: page.current,
                pageSize: 10
            }
            const url = `http://localhost:2637/api/question/${question.id}/answer`
            console.log(url)
            const response = await axios.get<AnswersResponse>(url, { params: params })    
            const result = curr.concat(response.data.data.answers)
            page.current = response.data.data.page + 1
            setIsAnswersLoading(false)
            setAnswers(result)
        })()
    }

    useEffect(() => {
        loadAnswers()
    }, [])

    const openNewAnswerDialog = () => {
        setAnswerDialogOpen(!answerDialogOpen)
    }

    const listItem = answers.map(answer => (
        <li><KepoAnswerCard answer={answer}/></li>
    ))

    return <Sheet
        sx={(theme) => ({
            [theme.breakpoints.down('md')]: {
                display: 'flex',
                flexDirection: 'column',
                px: 1,
                my: 1
            },
            [theme.breakpoints.up('md')]: {
                display: 'flex',
                flexDirection: 'column',
                width: 700,
                my: 1,
            }
        })}
    >
        <Sheet>
            <KepoQuestionCard question={question}/>
        </Sheet>
        <NewAnswerModal open={answerDialogOpen} setOpen={setAnswerDialogOpen}/>
        <Button
            startDecorator={<Create/>}
            onClick={() => openNewAnswerDialog()}
            variant="outlined"
            color="neutral"
            sx={{
                my: 1
            }}
        >Write an Answer</Button>
        <ul style={{
            listStyleType: 'none',
            padding: 0
        }}>{listItem}</ul>
        <Button variant="plain" color="neutral" onClick={() => loadAnswers()} loading={isAnswersLoading}>Load More</Button>
    </Sheet>
}

export default AnswerArea