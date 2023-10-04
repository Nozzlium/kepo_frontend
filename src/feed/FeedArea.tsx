import { Box, Button, ListItem, Select, Option, List } from "@mui/joy"
import { useEffect, useState } from "react"
import NewQuestionModal from "./NewQuestionModal"
import Progress from "../common/Progress"
import Category from "../data/Category"
import axios, { CancelToken } from "axios"
import Question from "../data/Question"
import { useNavigate } from "react-router-dom"
import MainKepoCreateButton from "../common/MainKepoCreateButton"
import { UIStatus } from "../lib/ui-status"
import KepoQuestionCard from "../common/KepoQuestionCard"
import questionRequest from "../request/QuestionRequest"
import categoriesRequest from "../request/CategoriesRequest"
import User from "../data/User"
import userDetailRequest from "../request/UserDetailsRequest"

interface FeedPageState {
    status: UIStatus.IDLE | UIStatus.SUCCESS | UIStatus.LOADING | UIStatus.ERROR,
    user?: User,
    data: Category[],
}

interface QuestionsState {
    status: UIStatus.IDLE | UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR,
    data: Question[],
    page: number,
    selectedCategory: number,
    newQuestionDialogOpen: boolean
}

const FeedArea = () => {
    const navigate = useNavigate()
    const [feedPageState, setFeedPageState] = useState<FeedPageState>({
        status: UIStatus.LOADING,
        data: [],
    })
    const [questionsState, setQuestionsState] = useState<QuestionsState>({
        status: UIStatus.IDLE,
        data: [],
        selectedCategory: 0,
        page: 0,
        newQuestionDialogOpen: false
    })

    const onQuestionPosted = (question: Question) => {
        navigate(`/question/${question.id}`)
    }

    const openNewQuestionDialog = () => {
        setQuestionsState(prev => {
            const next = {...prev}
            next.newQuestionDialogOpen = true
            return next
        })
    }

    const closeNewQuestionDialog = () => {
        setQuestionsState(prev => {
            const next = {...prev}
            next.newQuestionDialogOpen = false
            return next
        })
    }

    const loadInitData = (
        signal?: AbortSignal
    ) => {
        (async () => {
            const tempFeedPageState: FeedPageState = {
                status: UIStatus.SUCCESS,
                data: [],
            }
            try {
                const tempUser = await userDetailRequest.getDetails(signal)
                tempFeedPageState.user = tempUser
            } catch (error) {
                if (signal?.aborted) {
                    return
                }
            }

            try {
                const categories = await categoriesRequest.getCategories(signal)
                tempFeedPageState.data = categories
            } catch (error) {
                if (signal?.aborted) {
                    return
                }
            }
            setFeedPageState(_prev => {
                return tempFeedPageState
            })
        })()
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

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        if (feedPageState.status === UIStatus.LOADING) {
            loadInitData(signal)
        }
        if (feedPageState.status === UIStatus.SUCCESS) {
            setQuestionsState(prev => {
                const next = {...prev}
                next.status = UIStatus.LOADING
                return next
            })
        }

        return () => {
            controller.abort()
        }
    }, [feedPageState])

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
                status: UIStatus.LOADING,
                newQuestionDialogOpen: false
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

    const categoryItems = feedPageState.data.map(category => 
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
            <NewQuestionModal 
                open={questionsState.newQuestionDialogOpen}
                closeDialog={() => closeNewQuestionDialog()}
                onQuestionPosted={onQuestionPosted}
                categories={{
                    categories: feedPageState.data,
                    selected: questionsState.selectedCategory
                }}
            />
            {
                feedPageState.status === UIStatus.LOADING ? 
                <Progress/> : 
                <>
                    {
                        feedPageState.user ?
                        <MainKepoCreateButton text="Ask a Question!" onClick={() => openNewQuestionDialog()}/>
                        : <Button
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
                        >Login to post a question</Button>
                    }
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