import { Box, Button, CircularProgress, ListItem, Select, Sheet, Option, List } from "@mui/joy"
import { useEffect, useRef, useState } from "react"
import NewQuestionModal from "./NewQuestionModal"
import Progress from "../common/Progress"
import Category from "../data/Category"
import axios, { CancelToken } from "axios"
import CategoriesResponse from "../response/CategoriesResponse"
import Question from "../data/Question"
import { useNavigate } from "react-router-dom"
import MainKepoCreateButton from "../common/MainKepoCreateButton"
import { UIStatus } from "../lib/ui-status"
import KepoQuestionCard from "../common/KepoQuestionCard"
import questionRequest from "../request/QuestionRequest"

interface CategoriesState {
    status: UIStatus.IDLE | UIStatus.SUCCESS | UIStatus.LOADING | UIStatus.ERROR,
    data: Category[],
}

interface QuestionsState {
    status: UIStatus.IDLE | UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR,
    data: Question[],
    page: number,
    selectedCategory: number
}

const FeedArea = () => {
    const navigate = useNavigate()
    const [categoriesState, setCategoriesState] = useState<CategoriesState>({
        status: UIStatus.LOADING,
        data: [],
    })
    const [questionsState, setQuestionsState] = useState<QuestionsState>({
        status: UIStatus.IDLE,
        data: [],
        selectedCategory: 0,
        page: 0
    })
    const [newQuestionModalOpen, setNewQuestoionModalOpen] = useState<boolean>(false)


    const openNewQuestionDialog = () => {
        setNewQuestoionModalOpen(true)
    }

    const loadCategories = () => {
        (
            (async () => {
                const response = await axios.get<CategoriesResponse>('http://localhost:2637/api/category')
                console.log("selesai get category")
                setCategoriesState(prev => {
                    const next = {...prev}
                    next.status = UIStatus.SUCCESS
                    next.data = response.data.data
                    return next
                })
            })()
        )
    }

    const loadQuestions = (
        cancelToken?: CancelToken
    ) => {
        try {
            (async () => {
                const [questions, page] = await questionRequest.getFeed({
                    pageNo: questionsState.page + 1,
                    pageSize: 10,
                    category: questionsState.selectedCategory
                })
                setQuestionsState(prev => {
                    const next = {...prev}
                    if (questions.length > 0) {
                        next.page = page
                        next.data = next.data.concat(questions)
                    }
                    next.status = UIStatus.SUCCESS
                    return next
                })
            })()
        } catch (error) {
            
        }
    }

    const onQuestionPosted = (question: Question) => {
        navigate(`/question/${question.id}`)
    }

    useEffect(() => {
        if (categoriesState.status === UIStatus.LOADING) {
            console.log("masuk useeffect atas")
            loadCategories()
        }
        if (categoriesState.status === UIStatus.SUCCESS) {
            console.log("masuk useeffect bawah")
            setQuestionsState(prev => {
                const next = {...prev}
                next.status = UIStatus.LOADING
                return next
            })
        }
    }, [categoriesState])

    useEffect(() => {
        if (questionsState.status === UIStatus.LOADING) {
            loadQuestions()
        } 
    }, [questionsState])

    const handleChange = (
        _event: React.SyntheticEvent | null,
        newValue: number | null,
    ) => {
        setQuestionsState(_prev => {
            return {
                page: 0,
                selectedCategory: newValue ?? 0,
                data: [],
                status: UIStatus.LOADING
            }
        })
    };

    const loadMore = () => {
        setQuestionsState(prev => {
            const next = {...prev}
            next.status = UIStatus.LOADING
            return next
        })
    }

    const listItem = questionsState.data.map(question => 
        <ListItem key={question.id}><KepoQuestionCard question={question} /></ListItem>
    ) 

    const categoryItems = categoriesState.data.map(category => 
        <Option key={category.id} value={category.id}>{category.name}</Option>
    )

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
                categoriesState.status === UIStatus.LOADING ? 
                <Progress/> : 
                <>
                    <Select 
                        defaultValue={1}
                        variant="soft"
                        sx={{
                            my: 1,
                            boxShadow: 'lg'
                        }}
                        onChange={handleChange}
                    >{categoryItems}</Select>
                    <List sx={{
                        listStyleType: 'none',
                        p: 0,
                        mb: 1
                    }} >{listItem}</List>
                    <Button 
                        variant="plain" 
                        color="neutral" 
                        onClick={() => loadMore()} 
                        loading={questionsState.status === UIStatus.LOADING}>Load More</Button>
                </>
            }
        </Box>
}

export default FeedArea