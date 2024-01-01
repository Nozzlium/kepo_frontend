import { Button, Divider, Dropdown, Link, ListItemDecorator, Menu, MenuButton, MenuItem, Sheet, Typography } from "@mui/joy"
import Answer from "../data/Answer"
import { Delete, Edit, MoreHoriz, ThumbUp, ThumbUpOffAltOutlined } from "@mui/icons-material"
import { useEffect, useState } from "react"
import likeRequest from "../request/LikeRequest"
import { AnswerLikeParam } from "../param/LikeParam"
import User from "../data/User"
import NewAnswerModal from "./NewAnswerModal"
import { UIStatus } from "../lib/ui-status"
import { KepoError, UnauthorizedError } from "../error/KepoError"
import { useNavigate } from "react-router-dom"
import answerRequest from "../request/AnswerRequest"

interface AnswerCardState {
    answer?: Answer,
    likeButton: UIStatus.IDLE | UIStatus.ERROR | UIStatus.SUCCESS | UIStatus.LOADING,
    deleteButton: UIStatus.IDLE | UIStatus.ERROR | UIStatus.SUCCESS | UIStatus.LOADING,
    isEditDialogOpen: boolean 
}

const AnswerOptions = (
    {
        user,
        answer,
        loading,
        disabled,
        canEdit,
        onDeleteClick,
        onEditClicked
    }: {
        user?: User,
        answer: Answer,
        loading: boolean,
        disabled: boolean,
        canEdit: boolean,
        onDeleteClick: () => void,
        onEditClicked: () => void
}) => {
    if (user) {
        if (user.id === answer.user.id) {

            const options: JSX.Element[] = [
                <MenuItem onClick={onDeleteClick}>
                    <ListItemDecorator>
                        <Delete/>
                    </ListItemDecorator>
                    Delete
                </MenuItem>
            ]

            if (canEdit) {
                options.push(
                    <MenuItem onClick={onEditClicked}>
                        <ListItemDecorator>
                            <Edit/>
                        </ListItemDecorator>
                        Edit
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

const KepoAnswerCard = (
    {
        user,
        answer,
        canEdit
    }: {
        user?: User,
        answer: Answer,
        canEdit?: boolean
    }
) => {
    const navigate = useNavigate()
    const [answerCardState, setAnswerCardState] = useState<AnswerCardState>({
        answer: answer,
        likeButton: UIStatus.IDLE,
        deleteButton: UIStatus.IDLE,
        isEditDialogOpen: false
    })

    const buttonsDisabled = 
        answerCardState.likeButton === UIStatus.LOADING ||
        answerCardState.deleteButton === UIStatus.LOADING

    const likeClick = () => {
        setAnswerCardState(prev => {
            const next = {...prev}
            next.likeButton = UIStatus.LOADING
            return next
        })
    }

    const likeOrDislikeAnswer = () => {
        (async () => {
            if (!answerCardState.answer) {
                return
            }
            try {
                const param: AnswerLikeParam = {
                    answerId: answerCardState.answer.id,
                    isLiked: !answerCardState.answer.isLiked
                }
                const answerResult = await likeRequest.likeAnswer(param)
                setAnswerCardState(prev => {
                    const next = {...prev}
                    next.likeButton = UIStatus.SUCCESS
                    next.answer = answerResult
                    return next
                })
            } catch (error) {
                if (error instanceof KepoError) {
                    if (error instanceof UnauthorizedError) {
                        navigate("/login")
                    }
                }
            }
        })()
    }

    const deleteAnswer = () => {
        (async () => {
            if (!answerCardState.answer) {
                return
            }
            try {
                const answer = await answerRequest.delete(answerCardState.answer.id)
                if (answer.id === answerCardState.answer.id) {
                    setAnswerCardState(prev => {
                        const next = {...prev}
                        next.deleteButton = UIStatus.SUCCESS
                        next.answer = undefined
                        return next
                    })
                }
            } catch (error) {
                if (error instanceof KepoError) {
                    if (error instanceof UnauthorizedError) {
                        navigate("/login")
                    }
                }
            }
        })()
    }

    useEffect(() => {
        if (answerCardState.likeButton === UIStatus.LOADING) {
            likeOrDislikeAnswer()
        }

    }, [answerCardState.likeButton])

    useEffect(() => {
        if (answerCardState.deleteButton === UIStatus.LOADING) {
            deleteAnswer()
        }

    }, [answerCardState.deleteButton])

    if (!answerCardState.answer) {
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
            ><b>{
                answerCardState.deleteButton === UIStatus.SUCCESS ?
                "Jawaban telah dihapus" :
                "Terdapat Error"
            }</b></Typography>
        </div>
    }

    return <Sheet
        sx={{
            display: 'flex',
            flexDirection: 'column'
        }}
    >
        
        {
            canEdit ? 
            <NewAnswerModal
                open={answerCardState.isEditDialogOpen}
                forEdit={answerCardState.answer}
                closeDialog={() => {
                    setAnswerCardState(prev => {
                        const next = {...prev}
                        next.isEditDialogOpen = false
                        return next
                    })
                }}
                onAnswerPosted={(answer) => {
                    setAnswerCardState(prev => {
                        const next = {...prev}
                        next.answer = answer
                        next.isEditDialogOpen = false
                        return next
                    })
                }}
            /> :
            null
        }
        <Sheet
            sx={{
                display: 'flex',
                flexDirection: 'row',
                py: 1
            }}
        >
            <Sheet
                sx={{
                    padding: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Button 
                        loading={answerCardState.likeButton === UIStatus.LOADING} 
                        variant="plain"
                        color="neutral"
                        onClick={likeClick}
                >
                        {
                            answerCardState.answer.isLiked ? (<ThumbUp/>) : (<ThumbUpOffAltOutlined/>)
                        }
                </Button>
                <Typography level="body-xs"><b>{answerCardState.answer.likes}</b></Typography>
            </Sheet>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                }}
            >
                <Sheet
                    sx={{
                        padding: 1,
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Typography
                        level="body-xs"
                    >
                        Answered by {
                            <b><Link href={"/profile/" + answerCardState.answer.user.id} color="neutral">{answerCardState.answer.user.username}</Link></b>
                        }, {answerCardState.answer.createdAt}
                    </Typography>
                    <Typography level="body-sm">{answerCardState.answer.content}</Typography>
                </Sheet>
                <div>
                    <AnswerOptions
                        user={user}
                        answer={answerCardState.answer}
                        loading={answerCardState.deleteButton === UIStatus.LOADING}
                        disabled={false}
                        canEdit={canEdit ?? false}
                        onDeleteClick={() => {
                            setAnswerCardState(prev => {
                                const next = {...prev}
                                next.deleteButton = UIStatus.LOADING
                                return next
                            })
                        }}
                        onEditClicked={() => {
                            setAnswerCardState(prev => {
                                const next = {...prev}
                                next.isEditDialogOpen = true
                                return next
                            })
                        }}
                    />
                </div>
            </div>
        </Sheet>
        <Divider/>
    </Sheet>
}

export default KepoAnswerCard