import { Button, CircularProgress, Sheet } from "@mui/joy"
import QuestionList from "./QuestionList"
import { Create } from "@mui/icons-material"
import { useEffect, useRef, useState } from "react"
import NewQuestionModal from "./NewQuestionModal"
import Progress from "../common/Progress"
import Category from "../data/Category"
import axios from "axios"
import CategoriesResponse from "../response/CategoriesResponse"
import Question from "../data/Question"

const FeedArea = () => {
    const [isCategoriesLoading, setIsCategoryLoading] = useState<boolean>(true)
    const [newQuestionModalOpen, setNewQuestoionModalOpen] = useState<boolean>(false)
    const [questions, setQuestions] = useState<Question[]>([])
    const categories = useRef<Category[]>([])

    const openNewQuestionDialog = () => {
        setNewQuestoionModalOpen(true)
    }

    const loadCategories = () => {
        (
            (async () => {
                const response = await axios.get<CategoriesResponse>('http://localhost:2637/api/category')
                categories.current = response.data.data
                setIsCategoryLoading(false)
            })()
        )
    }

    const onQuestionPosted = (question: Question) => {
        const curr = questions.slice()
        curr.splice(0, 0, question)
        setQuestions(curr)
    }

    useEffect(() => {
        loadCategories()
    }, [])

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
            <Button color="neutral" variant="outlined" startDecorator={<Create />} onClick={() => openNewQuestionDialog()}>Ask a Question!</Button>
            <NewQuestionModal 
                open={newQuestionModalOpen} 
                setOpen={setNewQuestoionModalOpen}
                onQuestionPosted={onQuestionPosted}
            />
            {
                isCategoriesLoading ? 
                    <Progress/> : 
                    <QuestionList 
                        categories={categories.current}
                        questions={questions}
                        setQuestions={setQuestions}
                    /> 

            }
        </Sheet>
}

export default FeedArea