import { Box, Button, ListItem, Select, Option, List, Typography } from "@mui/joy"
import { useEffect, useState } from "react"
import NewQuestionModal from "../common/NewQuestionModal"
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
import ListElement from "../common/ListElement"
import { KepoError, UnauthorizedError } from "../error/KepoError"

interface FeedPageState {
    status: UIStatus.IDLE | UIStatus.SUCCESS | UIStatus.LOADING | UIStatus.ERROR,
    user?: User,
    data: Category[],
    error?: KepoError
}

interface QuestionsState {
    status: UIStatus.IDLE | UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR,
    data: Question[],
    page: number,
    selectedCategory: number,
    newQuestionDialogOpen: boolean,
    error?: KepoError
}

const FeedArea = (
    {
        onError
    }: {
        onError: (error?: KepoError) => void
    }
) => {
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

                switch (true) {
                    case error instanceof UnauthorizedError:
                        break
                    case error instanceof KepoError:
                        setFeedPageState(prev => {
                            const next = {...prev}
                            next.status = UIStatus.ERROR
                            next.error = error as KepoError
                            return next
                        })
                        break
                    default:
                        setFeedPageState(prev => {
                            const next = {...prev}
                            next.status = UIStatus.ERROR
                            next.error = new KepoError("UnknownError", "Udin")
                            return next
                        })
                        break
                }

            }

            try {
                const categories = await categoriesRequest.getCategories(signal)
                tempFeedPageState.data = [
                    {
                        id: 0,
                        name: "Semua Kategori"
                    },
                    ...categories
                ]
            } catch (error) {
                if (signal?.aborted) {
                    return
                }

                switch (true) {
                    case error instanceof KepoError:
                        setFeedPageState(prev => {
                            const next = {...prev}
                            next.status = UIStatus.ERROR
                            next.error = error as KepoError
                            return next
                        })
                        break
                    default:
                        setFeedPageState(prev => {
                            const next = {...prev}
                            next.status = UIStatus.ERROR
                            next.error = new KepoError("UnknownError", "Udin")
                            return next
                        })
                        break
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
        (async () => {
            try {
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
            } catch (error) {
                switch (true) {
                    case error instanceof KepoError:
                        setQuestionsState(prev => {
                            const next = {...prev}
                            next.status = UIStatus.ERROR
                            next.error = error as KepoError
                            return next
                        })
                        break
                    default:
                        setQuestionsState(prev => {
                            const next = {...prev}
                            next.status = UIStatus.ERROR
                            next.error = new KepoError("UnknownError", "Udin")
                            return next
                        })
                        break
                }
            }
        })()
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
        if (feedPageState.status === UIStatus.ERROR) {
            if (onError) {
                onError((feedPageState.error))
            }
        }

        return () => {
            controller.abort()
        }
    }, [feedPageState])

    useEffect(() => {
        if (questionsState.status === UIStatus.LOADING) {
            loadQuestions()
        }
        if (questionsState.status === UIStatus.ERROR) {
            if (onError) {
                onError(questionsState.error)
            }
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
        <ListItem key={question.id}><KepoQuestionCard question={question} user={feedPageState.user} onError={onError}/></ListItem>
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
                    categories: feedPageState.data.filter(category => category.id !== 0),
                    selected: questionsState.selectedCategory
                }}
            />
            {
                feedPageState.status === UIStatus.LOADING ? 
                <Progress/> : 
                <>
                    {
                        feedPageState.user ?
                        <MainKepoCreateButton text="Tanyakan Sesuatu" onClick={() => openNewQuestionDialog()}/>
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
                        >Masuk bila ingin bertanya</Button>
                    }
                    <Select 
                        defaultValue={0}
                        variant="soft"
                        sx={{
                            my: 1,
                            boxShadow: 'lg'
                        }}
                        onChange={handleChange}
                    >{categoryItems}</Select>
                    <ListElement
                        status={questionsState.status}
                        items={listItem}
                        emptyMessage="Tidak ada pertanyaan"
                    />
                    <Button 
                        variant="plain" 
                        color="neutral" 
                        onClick={() => loadMore()} 
                        loading={questionsState.status === UIStatus.LOADING}>Muat lebih banyak lagi</Button>
                </>
            }
        </Box>
}

export default FeedArea