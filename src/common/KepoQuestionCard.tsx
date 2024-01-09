import { Box, Button, Dropdown, Link, ListItemDecorator, Menu, MenuButton, MenuItem, Sheet, Typography } from "@mui/joy"
import Question from "../data/Question"
import { Delete, Edit, MoreHoriz, ThumbUp, ThumbUpOffAltOutlined } from "@mui/icons-material"
import { useEffect, useState } from "react"
import likeRequest from "../request/LikeRequest"
import { QuestionLikeParam } from "../param/LikeParam"
import { UIStatus } from "../lib/ui-status"
import questionRequest from "../request/QuestionRequest"
import User from "../data/User"
import { useNavigate } from "react-router-dom"
import NewQuestionModal from "./NewQuestionModal"
import { KepoError, UnauthorizedError } from "../error/KepoError"

interface QuestionCardState {
    question?: Question,
    likeButton: UIStatus.IDLE | UIStatus.ERROR | UIStatus.SUCCESS | UIStatus.LOADING,
    deleteButton: UIStatus.IDLE | UIStatus.ERROR | UIStatus.SUCCESS | UIStatus.LOADING,
    isEditDialogOpen: boolean,
    error?: KepoError
}

const QuestionOptions = (
    {
        user,
        question,
        loading,
        disabled,
        canEdit,
        onDeleteClick,
        onEditClicked
    }: {
        user?: User,
        question: Question,
        loading: boolean,
        disabled: boolean,
        canEdit: boolean,
        onDeleteClick: () => void,
        onEditClicked: () => void
}) => {
    if (user) {
        if (user.id === question.user.id) {

            const options: JSX.Element[] = [
                <MenuItem onClick={onDeleteClick}>
                    <ListItemDecorator>
                        <Delete/>
                    </ListItemDecorator>
                    Hapus
                </MenuItem>
            ]

            if (canEdit) {
                options.push(
                    <MenuItem onClick={onEditClicked}>
                        <ListItemDecorator>
                            <Edit/>
                        </ListItemDecorator>
                        Sunting
                    </MenuItem>
                )
            }

            return <Dropdown>
                <MenuButton
                    variant="plain"
                    loading={loading}
                    disabled={disabled}
                >
                    <MoreHoriz/>
                </MenuButton>
                <Menu
                    variant="plain"
                >
                    {options}
                </Menu>
            </Dropdown>
        }
    }

    return null
}

const KepoQuestionCard = (
    {
        user,
        question,
        canEdit,
        onError
    }: 
    {
        user?: User,
        question: Question,
        canEdit?: boolean,
        onError?: (error?: KepoError) => void
    }
) => {
    const navigate = useNavigate()
    const [questionCardState, setQuestionCardState] = useState<QuestionCardState>({
        question: question,
        likeButton: UIStatus.IDLE,
        deleteButton: UIStatus.IDLE,
        isEditDialogOpen: false
    })

    function likeQuestion() {
        (async () => {
            if (!questionCardState.question) {
                return
            }
            try {
                const param: QuestionLikeParam = {
                    questionId: questionCardState.question.id,
                    isLiked: !questionCardState.question.isLiked
                }
                const result = await likeRequest.likeQuestion(param)

                if (result) {
                    setQuestionCardState(prev => {
                        const next = {...prev}
                        next.likeButton = UIStatus.SUCCESS
                        next.question = result
                        return next
                    })
                }
            } catch (error) {
                switch (true) {
                    case error instanceof UnauthorizedError: 
                        navigate("/login")
                        break
                    case error instanceof KepoError:
                        setQuestionCardState(prev => {
                            const next = {...prev}
                            next.likeButton = UIStatus.ERROR
                            next.error = error as KepoError
                            return next
                        })
                        break
                    default:
                        setQuestionCardState(prev => {
                            const next = {...prev}
                            next.likeButton = UIStatus.ERROR
                            next.error = new KepoError()
                            return next
                        })
                        break
                }
            }
        })()
    }

    function deleteQuestion() {
        (async () => {
            if (!questionCardState.question) {
                return
            }
            try {
                const result = await questionRequest.delete(questionCardState.question.id)

                if (result) {
                    setQuestionCardState(prev => {
                        return {
                            likeButton: prev.likeButton,
                            deleteButton: UIStatus.SUCCESS,
                            isEditDialogOpen: prev.isEditDialogOpen
                        }
                    })
                }
            } catch (error) {
                switch (true) {
                    case error instanceof KepoError:
                        setQuestionCardState(prev => {
                            const next = {...prev}
                            next.likeButton = UIStatus.ERROR
                            next.error = error as KepoError
                            return next
                        })
                        break
                    default:
                        setQuestionCardState(prev => {
                            const next = {...prev}
                            next.likeButton = UIStatus.ERROR
                            next.error = new KepoError()
                            return next
                        })
                        break
                }
            }
        })()
    }

    const onLikeClicked = () => {
        setQuestionCardState(prev => {
            const next = {...prev}
            next.likeButton = UIStatus.LOADING
            return next
        })
    }

    const onDeleteClicked = () => {
        setQuestionCardState(prev => {
            const next = {...prev}
            next.deleteButton = UIStatus.LOADING
            return next
        })
    }

    const onEditClicked = () => {
        if (!canEdit) {
            return
        }
        setQuestionCardState(prev => {
            const next = {...prev}
            next.isEditDialogOpen = true
            return next
        })
    }

    const closeNewQuestionDialog = () => {
        setQuestionCardState(prev => {
            const next = {...prev}
            next.isEditDialogOpen = false
            return next
        })
    }

    const onQuestionPosted = (question: Question) => {
        setQuestionCardState(prev => {
            const next = {...prev}
            next.question = question
            return next
        })
    }

    const interactionsInactive = 
        questionCardState.likeButton === UIStatus.LOADING ||
        questionCardState.deleteButton === UIStatus.LOADING

    useEffect(() => {

        let hasError =
            questionCardState.likeButton === UIStatus.ERROR ||
            questionCardState.deleteButton === UIStatus.ERROR

        if (questionCardState.likeButton === UIStatus.LOADING) {
            likeQuestion() 
        }
        
        if (questionCardState.deleteButton === UIStatus.LOADING) {
            deleteQuestion()
        }

        if (hasError) {
            if (onError) {
                onError(questionCardState.error)
            }
        }

    }, [questionCardState])

    useEffect(() => {
        setQuestionCardState(prev => {
            const next = {...prev}
            next.question = question
            return next
        })
    }, [question])

    if (!questionCardState.question) {
        if (questionCardState.deleteButton === UIStatus.SUCCESS) {
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
                ><b>Pertanyaan telah dihapus</b></Typography>
            </div>
        }
        return null
    }

    return <Sheet
        sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            boxShadow: 'lg',
            borderRadius: 'md'
        }}
    >
        {
            canEdit ?
            <NewQuestionModal 
                open={questionCardState.isEditDialogOpen}
                closeDialog={() => closeNewQuestionDialog()}
                onQuestionPosted={onQuestionPosted}
                forEdit={questionCardState.question}
                categories={{
                    categories: [questionCardState.question.category],
                    selected: questionCardState.question.category.id
                }}
            /> : null
        }
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 1,
                alignItems: 'center',
            }}
        >
            <Button 
                loading={questionCardState.likeButton === UIStatus.LOADING} 
                variant="plain"
                color="neutral"
                disabled={interactionsInactive}
                onClick={() => onLikeClicked()}
            >
                {
                    questionCardState.question.isLiked ? (<ThumbUp/>) : (<ThumbUpOffAltOutlined/>)
                }
            </Button>
            <Typography level="body-xs"><b>{questionCardState.question.likes}</b></Typography>
        </Box>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 1,
            }}
        >
            <Typography
                    level="body-xs"
                >
                    Ditanya oleh {
                        <b><Link 
                                href={"/profile/" + questionCardState.question.user.id} 
                                color="neutral"
                            >{questionCardState.question.user.username}</Link></b>
                    }, {questionCardState.question.createdAt} {
                        questionCardState.question.isEdited ?
                        <Typography level="body-xs"><i>Edited</i></Typography> :
                        null
                    }
            </Typography>
            <Link level="body-lg" color="neutral" sx={{my: 1}} href={"/question/" + questionCardState.question.id}><b>{questionCardState.question.content}</b></Link>
            <Typography level="body-sm">{questionCardState.question.description}</Typography>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '8px'
                }}
            >
                <Typography level="body-xs" sx={{my: 1}}><b>{questionCardState.question.answers} Jawaban</b></Typography>
                <QuestionOptions
                    question={questionCardState.question}
                    user={user}
                    loading={questionCardState.deleteButton === UIStatus.LOADING}
                    disabled={interactionsInactive}
                    canEdit={canEdit ?? false}
                    onDeleteClick={onDeleteClicked}
                    onEditClicked={onEditClicked}
                />
            </div>
        </Box>
    </Sheet>
}
export default KepoQuestionCard