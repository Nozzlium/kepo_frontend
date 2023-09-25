import { Box, Button, CircularProgress, Sheet } from "@mui/joy"
import QuestionList from "./QuestionList"
import { Create } from "@mui/icons-material"
import { useEffect, useRef, useState } from "react"
import NewQuestionModal from "./NewQuestionModal"
import Progress from "../common/Progress"
import Category from "../data/Category"
import axios from "axios"
import CategoriesResponse from "../response/CategoriesResponse"
import Question from "../data/Question"
import { useNavigate } from "react-router-dom"
import MainKepoCreateButton from "../common/MainKepoCreateButton"

const FeedArea = () => {
    const navigate = useNavigate()
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
        navigate(`/question/${question.id}`)
    }

    useEffect(() => {
        loadCategories()
    }, [])

    return <Box
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
            <MainKepoCreateButton text="Ask a Question!" onClick={() => openNewQuestionDialog()}/>
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
        </Box>
}

export default FeedArea