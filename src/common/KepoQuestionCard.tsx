import { Box, Button, Dropdown, Link, ListItemDecorator, Menu, MenuButton, MenuItem, Sheet, Typography } from "@mui/joy"
import Question from "../data/Question"
import { Delete, MoreHoriz, ThumbUp, ThumbUpOffAltOutlined } from "@mui/icons-material"
import { useEffect, useState } from "react"
import likeRequest from "../request/LikeRequest"
import { QuestionLikeParam } from "../param/LikeParam"
import { UIStatus } from "../lib/ui-status"
import questionRequest from "../request/QuestionRequest"

interface QuestionCardState {
    question?: Question,
    likeButton: UIStatus.IDLE | UIStatus.ERROR | UIStatus.SUCCESS | UIStatus.LOADING,
    deleteButton: UIStatus.IDLE | UIStatus.ERROR | UIStatus.SUCCESS | UIStatus.LOADING
}

const KepoQuestionCard = (
    {
        question
    }: 
    {
        question: Question
    }
) => {
    const [questionCardState, setQuestionCardState] = useState<QuestionCardState>({
        question: question,
        likeButton: UIStatus.IDLE,
        deleteButton: UIStatus.IDLE
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
                    setQuestionCardState(_prev => {
                        return {
                            likeButton: UIStatus.IDLE,
                            deleteButton: UIStatus.SUCCESS
                        }
                    })
                }
            } catch (error) {
                
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

    const dummyDeleteClick = () => {
        setQuestionCardState({
            deleteButton: UIStatus.SUCCESS,
            likeButton: UIStatus.IDLE
        })
    }

    useEffect(() => {
        if (questionCardState.likeButton === UIStatus.LOADING) {
            likeQuestion() 
        }
        
        if (questionCardState.deleteButton === UIStatus.LOADING) {
            deleteQuestion()
        }

    }, [questionCardState])

    const interactionsInactive = 
        questionCardState.likeButton === UIStatus.LOADING ||
        questionCardState.deleteButton === UIStatus.LOADING

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
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 1,
                alignItems: 'center',
                justifyContent: 'center',
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
                    Asked by {
                        <b><Link 
                                href={"/profile/" + questionCardState.question.user.id} 
                                color="neutral"
                            >{questionCardState.question.user.username}</Link></b>
                    }, {questionCardState.question.createdAt}
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
                <Typography level="body-xs" sx={{my: 1}}><b>{questionCardState.question.answers} Answer(s)</b></Typography>
                <Dropdown>
                    <MenuButton
                        variant="plain"
                        loading={questionCardState.deleteButton === UIStatus.LOADING}
                        disabled={interactionsInactive}
                    >
                        <MoreHoriz/>
                    </MenuButton>
                    <Menu
                        variant="plain"
                    >
                        <MenuItem onClick={() => onDeleteClicked()}>
                            <ListItemDecorator>
                                <Delete/>
                            </ListItemDecorator>
                            Delete
                        </MenuItem>
                    </Menu>
                </Dropdown>
            </div>
        </Box>
    </Sheet>
}
export default KepoQuestionCard