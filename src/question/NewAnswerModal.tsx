import { Alert, Box, Button, FormControl, IconButton, ModalClose, ModalDialog, Sheet, Textarea, Typography } from "@mui/joy"
import Modal from "@mui/joy/Modal"
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react"
import { PostAnswerParam } from "../param/AnswerParam"
import answerRequest from "../request/AnswerRequest"
import Answer from "../data/Answer"
import Question from "../data/Question"
import { UIStatus } from "../lib/ui-status"
import { DialogContent } from "@mui/material"
import { KepoError, UnauthorizedError } from "../error/KepoError"
import { useNavigate } from "react-router-dom"
import { Close } from "@mui/icons-material"
import KepoConfirmationDialog from "../common/KepoConfirmationDialog"

interface NewAnswerState {
    answer: string,
    posted?: Answer,
    error?: KepoError,
    shouldClose: boolean,
    shouldConfirm: boolean,
    status: UIStatus.IDLE | UIStatus.LOADING | UIStatus.ERROR | UIStatus.SUCCESS
}

const NewAnswerModal = ({
    open,
    closeDialog,
    question,
    onAnswerPosted,
    forEdit
}: {
    open: boolean,
    closeDialog: () => void,
    question?: Question,
    onAnswerPosted: (answer: Answer) => void,
    forEdit?: Answer
}) => {
    const navigate = useNavigate()
    const [newAnswerState, setNewAnswerState] = useState<NewAnswerState>({
        answer: forEdit?.content ?? "",
        shouldClose: false,
        shouldConfirm: false,
        status: UIStatus.IDLE
    })

    const isValid = newAnswerState.answer.length > 0

    const onClose = () => {
        if (newAnswerState.answer.length > 0) {
            setNewAnswerState(prev => {
                const next = {...prev}
                next.shouldConfirm = true
                return next
            })
        } else {
            setNewAnswerState(_prev => {
                return {
                    answer: "",
                    status: UIStatus.IDLE,
                    shouldClose: true,
                    shouldConfirm: false
                }
            })
        }
    }

    const postAnswer = () => {
        if (!question) {
            return
        }
        (async () => {
            try {
                const answerResult = await answerRequest.postNewAnswer({
                    questionId: question.id,
                    content: newAnswerState.answer
                })
                setNewAnswerState(_prev => {
                    return {
                        posted: answerResult,
                        status: UIStatus.SUCCESS,
                        answer: "",
                        shouldClose: true,
                        shouldConfirm: false
                    }
                })
            } catch (error) {
                if (error instanceof UnauthorizedError) {
                    navigate("/login")
                    return
                }

                setNewAnswerState(prev => {
                    const next = {...prev}
                    next.status = UIStatus.ERROR
                    next.error = new KepoError("UnknownError", "Unknown error")
                    return next
                })
            }
        })()
    }

    const updateAnswer = () => {
        if (!forEdit) {
            return
        }
        (async () => {
            try {
                const answerResult = await answerRequest.update(forEdit.id, {
                    questionId: forEdit.questionId,
                    content: newAnswerState.answer
                })
                setNewAnswerState(_prev => {
                    return {
                        posted: answerResult,
                        status: UIStatus.SUCCESS,
                        answer: "",
                        shouldClose: true,
                        shouldConfirm: false
                    }
                })
            } catch (error) {
                if (error instanceof UnauthorizedError) {
                    navigate("/login")
                    return
                }

                setNewAnswerState(prev => {
                    const next = {...prev}
                    next.status = UIStatus.ERROR
                    next.error = new KepoError("UnknownError", "Unknown error")
                    return next
                })
            }
        })()
    }

    useEffect(() => {
        if (open) {
            setNewAnswerState(_prev => {
                return {
                    answer: forEdit?.content ?? "",
                    status: UIStatus.IDLE,
                    shouldClose: false,
                    shouldConfirm: false
                }
            })
        }
    }, [open])

    useEffect(() => {
        if (newAnswerState.status === UIStatus.LOADING) {
            if (forEdit) {
                updateAnswer()
            } else {
                postAnswer()
            }
            return
        } 

        if (newAnswerState.status === UIStatus.SUCCESS && newAnswerState.posted) {
            onAnswerPosted(newAnswerState.posted)
            return
        }

        if (newAnswerState.shouldClose) {
            closeDialog()
        }
    }, [newAnswerState])

    return <Modal 
        open={open} 
        onClose={() => onClose()}
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}
    >
        <ModalDialog
            sx={(theme) => ({
                [theme.breakpoints.only('xs')]: {
                  top: 'unset',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  borderRadius: 0,
                  transform: 'none',
                  maxWidth: 'unset',
                },
                [theme.breakpoints.not('xs')]: {
                    minWidth: 700
                }
              })}
            size="md"
        >
            <ModalClose />
            <KepoConfirmationDialog
                open={newAnswerState.shouldConfirm}
                title="Discard Answer?"
                negativeMessage="Discard"
                negativeAction={() => {
                    setNewAnswerState(_prev => {
                        return {
                            answer: "",
                            status: UIStatus.IDLE,
                            shouldClose: true,
                            shouldConfirm: false
                        }
                    })
                }}
                positiveMessage="Cancel"
                positiveAction={() => {
                    setNewAnswerState(prev => {
                        const next = {...prev}
                        next.shouldConfirm = false
                        return next
                    })
                }}
            />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    mt: 3
                }}
            >
                {
                    newAnswerState.status === UIStatus.ERROR && newAnswerState.error ?
                    <Alert 
                        variant="soft"
                        color="danger"
                        endDecorator={
                            <IconButton variant="solid" size="sm" color="danger" onClick={() => {
                                setNewAnswerState(prev => {
                                    return {
                                        answer: prev.answer,
                                        shouldClose: prev.shouldClose,
                                        status: UIStatus.IDLE,
                                        shouldConfirm: prev.shouldConfirm
                                    }
                                })
                            }}>
                                <Close />
                            </IconButton>
                        }
                        >
                        {newAnswerState.error.message}
                    </Alert>
                    : null
                }
                <FormControl>
                    <Textarea
                        placeholder="Your answer here..."
                        minRows={5}
                        maxRows={5}
                        sx={{
                            '--Textarea-focusedThickness': '0'
                        }}
                        variant="plain"
                        value={newAnswerState.answer}
                        onChange={(event) => {
                            setNewAnswerState(prev => {
                                const next = {...prev}
                                next.answer = event.target.value
                                return next
                            })
                        }}
                        endDecorator={
                            <Box
                                sx={{
                                    display: 'flex',
                                    flex: 'auto',
                                    pt: 1,
                                    borderTop: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <Button 
                                    sx={{ml: 'auto'}} 
                                    disabled={!isValid} 
                                    loading={newAnswerState.status === UIStatus.LOADING}
                                    onClick={() => {
                                        setNewAnswerState(prev => {
                                            const next = {...prev}
                                            next.status = UIStatus.LOADING
                                            return next
                                        })
                                    }}
                                >Submit</Button>     
                            </Box>
                        }
                    />
                </FormControl>
            </Box>
        </ModalDialog>
    </Modal>
}

export default NewAnswerModal