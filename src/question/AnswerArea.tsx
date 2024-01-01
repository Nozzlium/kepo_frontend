import { Box, Button, Dropdown, Menu, MenuButton, MenuItem, Sheet, Typography } from "@mui/joy"
import KepoQuestionCard from "../common/KepoQuestionCard"
import Question from "../data/Question"
import Answer from "../data/Answer"
import { useEffect, useRef, useState } from "react"
import KepoAnswerCard from "../common/KepoAnswercard"
import NewAnswerModal from "../common/NewAnswerModal"
import Progress from "../common/Progress"
import { useNavigate, useParams } from "react-router-dom"
import questionRequest from "../request/QuestionRequest"
import answerRequest from "../request/AnswerRequest"
import MainKepoCreateButton from "../common/MainKepoCreateButton"
import { UIStatus } from "../lib/ui-status"
import User from "../data/User"
import userDetailRequest from "../request/UserDetailsRequest"
import { Sort } from "@mui/icons-material"
import { AnswerParam } from "../param/AnswerParam"
import { KepoError } from "../error/KepoError"
import ListElement from "../common/ListElement"
import { MOST_LIKED, NEWEST } from "../lib/filter-constants"

interface QuestionPageState {
    status: UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR,
    data?: Question,
    user?: User,
    error?: KepoError
}

interface AnswersState {
    status: UIStatus.IDLE | UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR,
    page: number,
    data: Answer[],
    sort: number,
    newAnswerDialogOpen: boolean,
    error?: KepoError
}

type RouteParams = {
    id: string
}

const AnswerArea = (
    {
        onError
    } : {
        onError?: (error?: KepoError) => void
    }
) => {
    const navigate = useNavigate()
    const [questionState, setQuestionState] = useState<QuestionPageState>({
        status: UIStatus.LOADING
    })
    const [answersState, setAnswersState] = useState<AnswersState>({
        status: UIStatus.IDLE,
        data: [],
        page: 0,
        sort: MOST_LIKED,
        newAnswerDialogOpen: false
    })

    const { id } = useParams<RouteParams>()

    const onAnswerSubmit = (answer: Answer) => {
        setAnswersState(prevAns => {
            const next = {...prevAns}
            next.data = [answer, ...prevAns.data]
            next.newAnswerDialogOpen = false
            return next
        })
        setQuestionState(prev => {
            console.log(prev)
            const next = {...prev}
            if (next.data) {
                next.data.answers++
            }
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
                if (error instanceof KepoError) {
                    setQuestionState(prev => {
                        const next = {...prev}
                        next.status = UIStatus.ERROR
                        next.error = error as KepoError
                        return next
                    })
                    return
                } else {
                    setQuestionState(prev => {
                        const next = {...prev}
                        next.status = UIStatus.ERROR
                        next.error = new KepoError("Unknown", "unknown error")
                        return next
                    })
                    return
                }
            }
            setQuestionState(_prev => {
                return questionPageState
            })
        })()
    }

    const loadAnswers = () => {
        (async () => {
            try {
                if (questionState.status === UIStatus.SUCCESS && questionState.data) {
                    const answerParams: AnswerParam = {
                        pageNo: answersState.page + 1,
                        pageSize: 10,
                        sortBy: "LKE",
                        order: "DESC"
                    }
    
                    if (answersState.sort === NEWEST) {
                        answerParams.sortBy = "DTE"
                    }
    
                    const [answersResult, currentPage] = await answerRequest.getByQuestion(
                        questionState.data.id, answerParams)
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
            } catch (error) {
                switch (true) {
                    case error instanceof KepoError:
                        setAnswersState(prev => {
                            const next = {...prev}
                            next.status = UIStatus.ERROR
                            next.error = error as KepoError
                            return next
                        })
                        break
                    default:
                        setAnswersState(prev => {
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

    const loadMore = () => {
        setAnswersState(prev => {
            const next = {...prev}
            next.status = UIStatus.LOADING
            return next
        })
    }

    const onSortMenuClicked = (value: number) => {
        if (answersState.sort === value) {
            return
        }
        setAnswersState(prev => {
            const next = {...prev}
            next.sort = value  
            next.data = []
            next.page = 0
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
    }, [questionState.status])

    useEffect(() => {
        if (answersState.status === UIStatus.LOADING) {
            loadAnswers()
        }
        if (answersState.status === UIStatus.ERROR) {
            if (onError) {
                onError(answersState.error)
            }
        }
    }, [answersState.status])

    const openNewAnswerDialog = () => {
        setAnswersState(prev => {
            const next = {...prev}
            next.newAnswerDialogOpen = true
            return next
        })
    }

    const getListItems = (user?: User) => {
        return answersState.data.map(answer => (
            <li key={answer.id}>
                <KepoAnswerCard 
                    user={user} 
                    answer={answer}
                    canEdit={true}
                />
            </li>
        ))
    }

    if (questionState.status === UIStatus.ERROR) {
        return <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    padding: '16px 0 16px 0'
                }}
            >
                <Typography
                    level="body-sm"
                ><b>{questionState.error?.message ?? ""}</b></Typography>
            </div>
    }

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
                    <KepoQuestionCard 
                        question={questionState.data}
                        user={questionState.user}
                        canEdit={true}
                    />
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
                    <Dropdown>
                        <MenuButton
                            variant="plain"
                            size="sm"
                            >
                            <Sort/>
                            Sort by
                        </MenuButton>
                        <Menu
                            variant="soft"
                            size="sm">
                            <MenuItem
                                onClick={() => onSortMenuClicked(MOST_LIKED)}
                                selected={answersState.sort === MOST_LIKED}
                            >Most Liked</MenuItem>
                            <MenuItem
                                onClick={() => onSortMenuClicked(NEWEST)}
                                selected={answersState.sort === NEWEST}
                            >Newest</MenuItem>
                        </Menu>
                    </Dropdown>
                    <ListElement
                        status={answersState.status}
                        items={getListItems(questionState.user)}
                        emptyMessage="Tidak ada jawaban"
                    />
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