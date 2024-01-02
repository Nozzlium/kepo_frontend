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
    questionStatus: UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR,
    question?: Question,
    user?: User,
    answersStatus: UIStatus.IDLE | UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR,
    page: number,
    answers: Answer[],
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
    const [questionPageState, setQuestionPageState] = useState<QuestionPageState>({
        questionStatus: UIStatus.LOADING,
        answersStatus: UIStatus.IDLE,
        answers: [],
        page: 0,
        sort: MOST_LIKED,
        newAnswerDialogOpen: false
    })

    const { id } = useParams<RouteParams>()

    const onAnswerSubmit = (answer: Answer) => {
        setQuestionPageState(prev => {
            const next = {...prev}
            next.answers = [answer, ...prev.answers]
            next.newAnswerDialogOpen = false
            if (next.question) {
                const nextQuestion = {...next.question}
                nextQuestion.answers++
                next.question = nextQuestion
            }
            return next
        })
    }

    const onAnswerDeleted = () => {
        setQuestionPageState(prev => {
            const next = {...prev}
            if (next.question) {
                const nextQuestion = {...next.question}
                nextQuestion.answers--
                next.question = nextQuestion
            }
            return next
        })
    }

    const loadQuestion: (
        id: string,
        signal?: AbortSignal
    ) => void = (id: string, signal?: AbortSignal) => {
        (async () => {
            const nextPageState = {...questionPageState}
            try {
                const userResult = await userDetailRequest.getDetails(signal)
                nextPageState.user = userResult
            } catch (error) {
                if (signal?.aborted) {
                    return
                }
            }

            try {
                const questionResult = await questionRequest.getById(id, signal)
                nextPageState.question = questionResult
                nextPageState.questionStatus = UIStatus.SUCCESS
            } catch (error) {
                if (signal?.aborted) {
                    return
                }
                if (error instanceof KepoError) {
                    setQuestionPageState(prev => {
                        const next = {...prev}
                        next.questionStatus = UIStatus.ERROR
                        next.error = error as KepoError
                        return next
                    })
                    return
                } else {
                    setQuestionPageState(prev => {
                        const next = {...prev}
                        next.questionStatus = UIStatus.ERROR
                        next.error = new KepoError("Unknown", "unknown error")
                        return next
                    })
                    return
                }
            }
            setQuestionPageState(nextPageState)
        })()
    }

    const loadAnswers = () => {
        (async () => {
            try {
                if (questionPageState.questionStatus === UIStatus.SUCCESS 
                        && questionPageState.question) {
                    const answerParams: AnswerParam = {
                        pageNo: questionPageState.page + 1,
                        pageSize: 10,
                        sortBy: "LKE",
                        order: "DESC"
                    }
    
                    if (questionPageState.page === NEWEST) {
                        answerParams.sortBy = "DTE"
                    }
    
                    const [answersResult, currentPage] = await answerRequest.getByQuestion(
                        questionPageState.question.id, answerParams)
                    setQuestionPageState(prev => {
                        const next = {...prev}
                        if (answersResult.length > 0) {
                            next.answers = next.answers.concat(answersResult)
                            next.page = currentPage
                        }
                        next.answersStatus = UIStatus.SUCCESS
                        return next
                    })
                }
            } catch (error) {
                switch (true) {
                    case error instanceof KepoError:
                        setQuestionPageState(prev => {
                            const next = {...prev}
                            next.answersStatus = UIStatus.ERROR
                            next.error = error as KepoError
                            return next
                        })
                        break
                    default:
                        setQuestionPageState(prev => {
                            const next = {...prev}
                            next.answersStatus = UIStatus.ERROR
                            next.error = new KepoError("UnknownError", "Udin")
                            return next
                        })
                        break
                }
            }
        })()  
    }

    const loadMore = () => {
        setQuestionPageState(prev => {
            const next = {...prev}
            next.answersStatus = UIStatus.LOADING
            return next
        })
    }

    const onSortMenuClicked = (value: number) => {
        if (questionPageState.sort === value) {
            return
        }
        setQuestionPageState(prev => {
            const next = {...prev}
            next.sort = value  
            next.answers = []
            next.page = 0
            next.answersStatus = UIStatus.LOADING
            return next
        })
    }

    useEffect(() => {
        const controller = new AbortController()
        if (questionPageState.questionStatus === UIStatus.LOADING) {
            loadQuestion(id ?? '0', controller.signal)
        }
        if (questionPageState.questionStatus === UIStatus.SUCCESS) {
            setQuestionPageState(prev => {
                const next = {...prev}
                next.answersStatus = UIStatus.LOADING
                return next
            })
        }

        return () => {
            controller.abort()
        }
    }, [questionPageState.questionStatus])

    useEffect(() => {
        if (questionPageState.answersStatus === UIStatus.LOADING) {
            loadAnswers()
        }
        if (questionPageState.answersStatus === UIStatus.ERROR) {
            if (onError) {
                onError(questionPageState.error)
            }
        }
    }, [questionPageState.answersStatus])

    const openNewAnswerDialog = () => {
        setQuestionPageState(prev => {
            const next = {...prev}
            next.newAnswerDialogOpen = true
            return next
        })
    }

    const getListItems = (user?: User) => {
        return questionPageState.answers.map(answer => (
            <li key={answer.id}>
                <KepoAnswerCard 
                    user={user} 
                    answer={answer}
                    canEdit={true}
                    onAnswerDeleted={onAnswerDeleted}
                />
            </li>
        ))
    }

    if (questionPageState.questionStatus === UIStatus.ERROR) {
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
                ><b>{questionPageState.error?.message ?? ""}</b></Typography>
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
            questionPageState.questionStatus === UIStatus.LOADING || !questionPageState.question ?
                <Progress /> :
                <>
                    <KepoQuestionCard 
                        question={questionPageState.question}
                        user={questionPageState.user}
                        canEdit={true}
                    />
                    <NewAnswerModal
                        open={questionPageState.newAnswerDialogOpen}
                        closeDialog={() => {
                            setQuestionPageState(prev => {
                                const next = {...prev}
                                next.newAnswerDialogOpen = false
                                return next
                            })
                        }}
                        onAnswerPosted={onAnswerSubmit}
                        question={questionPageState.question}
                    />
                    {
                        questionPageState.user ?
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
                                selected={questionPageState.sort === MOST_LIKED}
                            >Most Liked</MenuItem>
                            <MenuItem
                                onClick={() => onSortMenuClicked(NEWEST)}
                                selected={questionPageState.sort === NEWEST}
                            >Newest</MenuItem>
                        </Menu>
                    </Dropdown>
                    <ListElement
                        status={questionPageState.answersStatus}
                        items={getListItems(questionPageState.user)}
                        emptyMessage="Tidak ada jawaban"
                    />
                    <Button 
                        variant="plain" 
                        color="neutral" 
                        onClick={() => loadMore()} 
                        loading={questionPageState.answersStatus === UIStatus.LOADING}
                    >Load More</Button>
                </>
        }
    </Box>
}

export default AnswerArea