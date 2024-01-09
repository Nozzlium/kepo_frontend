import { Modal, ModalDialog, Sheet, Textarea, Box, Button, Input, Select, Option } from "@mui/joy"
import { useState, useEffect } from "react"
import Category from "../data/Category"
import Question from "../data/Question"
import questionRequest from "../request/QuestionRequest"
import { UIStatus } from "../lib/ui-status"
import { KepoError, UnauthorizedError } from "../error/KepoError"
import { useNavigate } from "react-router-dom"
import KepoConfirmationDialog from "./KepoConfirmationDialog"
import KepoDialogErrorAlert from "./KepoDialogErrorAlert"

interface NewQuestionState {
    categoryId: number,
    content: string,
    description: string,
    posted?: Question,
    error?: KepoError,
    shouldClose: boolean,
    shouldConfirm: boolean,
    status: UIStatus.IDLE | UIStatus.LOADING | UIStatus.ERROR | UIStatus.SUCCESS
}

interface CategoriesWrapper {
    categories: Category[],
    selected: number
}

const NewQuestionModal = ({
    open,
    closeDialog,
    categories,
    onQuestionPosted,
    forEdit
}: {
    open: boolean,
    closeDialog: () => void,
    categories: CategoriesWrapper,
    onQuestionPosted: (question: Question) => void,
    forEdit?: Question
}) => {
    const navigate = useNavigate()
    const [newQuestionState, setPostQuestionParam] = useState<NewQuestionState>({
        categoryId: categories.selected,
        content: "",
        description: "",
        status: UIStatus.IDLE,
        shouldClose: false,
        shouldConfirm: false
    })

    const isDataValid: boolean = 
            newQuestionState.categoryId !== 0
            && newQuestionState.content.length !== 0
            && newQuestionState.description.length !== 0

    const onCategoryChange = (
        _ : React.SyntheticEvent | null,
        newValue: number | null,
    ) => {
        setPostQuestionParam(prev => {
            const next = {...prev}
            next.categoryId = newValue ?? 0
            return next
        })
    }

    const isFormEmpty = newQuestionState.content.length === 0
    && newQuestionState.description.length === 0

    const onClose = () => {
        if (!isFormEmpty) {
            setPostQuestionParam(prev => {
                const next = {...prev}
                next.shouldConfirm = true
                return next
            })
        } else {
            setPostQuestionParam(_prev => {
                return {
                    categoryId: categories.selected,
                    content: "",
                    description: "",
                    status: UIStatus.IDLE,
                    shouldClose: true,
                    shouldConfirm: false
                }
            })
        }
    }

    const onSubmit = () => {
        setPostQuestionParam(prev => {
            const next = {...prev}
            next.status = UIStatus.LOADING
            return next
        })
    }

    const postQuestion = () => {
        (async () => {
            try {
                const questionResponse = await questionRequest.postQuestion(newQuestionState)
                setPostQuestionParam(_prev => {
                    return {
                        posted: questionResponse,
                        status: UIStatus.SUCCESS,
                        content: "",
                        description: "",
                        categoryId: 0,
                        shouldClose: true,
                        shouldConfirm: false
                    }
                })
            } catch (error) {
                if (error instanceof UnauthorizedError) {
                    navigate('/login')
                }
                switch (true) {
                    case error instanceof UnauthorizedError:
                        navigate('/login')
                        break
                    case error instanceof KepoError:
                        setPostQuestionParam(prev => {
                            const next = {...prev}
                            next.status = UIStatus.ERROR
                            next.error = error as KepoError
                            return next
                        })
                        break
                    default:
                        setPostQuestionParam(prev => {
                            const next = {...prev}
                            next.status = UIStatus.ERROR
                            next.error = new KepoError()
                            return next
                        })
                }
            }
        })()
    }

    const editQuestion = (id: number) => {
        (async () => {
            try {
                const questionResponse = await questionRequest.edit(id, newQuestionState)
                setPostQuestionParam(_prev => {
                    return {
                        posted: questionResponse,
                        status: UIStatus.SUCCESS,
                        content: "",
                        description: "",
                        categoryId: 0,
                        shouldClose: true,
                        shouldConfirm: false
                    }
                })
            } catch (error) {
                if (error instanceof UnauthorizedError) {
                    navigate('/login')
                }
            }
        })()
    }

    useEffect(() => {
        if (open) {
            setPostQuestionParam({
                categoryId: categories.selected,
                content: forEdit?.content ?? "",
                description: forEdit?.description ?? "",
                status: UIStatus.IDLE,
                shouldClose: false,
                shouldConfirm: false
            })
        }
    }, [open])

    useEffect(() => {
        if (newQuestionState.status === UIStatus.LOADING) {
            if (!forEdit) {
                postQuestion()
            } else {
                editQuestion(forEdit.id)
            }
        }

        if (newQuestionState.status === UIStatus.SUCCESS && newQuestionState.posted) {
            onQuestionPosted(newQuestionState.posted)
        }

        if (newQuestionState.shouldClose) {
            closeDialog()
        }
    }, [newQuestionState])

    const categoryItems = categories.categories.map(category => 
        <Option key={category.id} value={category.id}>{category.name}</Option>
    )

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
            size="lg"
        >
        <KepoConfirmationDialog
                open={newQuestionState.shouldConfirm}
                title="Discard Answer?"
                negativeMessage="Discard"
                negativeAction={() => {
                    setPostQuestionParam(_prev => {
                        return {
                            categoryId: categories.selected,
                            content: "",
                            description: "",
                            status: UIStatus.IDLE,
                            shouldClose: true,
                            shouldConfirm: false
                        }
                    })
                }}
                positiveMessage="Cancel"
                positiveAction={() => {
                    setPostQuestionParam(prev => {
                        const next = {...prev}
                        next.shouldConfirm = false
                        return next
                    })
                }}
            />
        <Sheet
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1
            }}
        >
            <KepoDialogErrorAlert
                text={newQuestionState.error?.message}
                show={newQuestionState.status === UIStatus.ERROR}
                onClose={() => {
                    setPostQuestionParam(prev => {
                        const next = {...prev}
                        next.status = UIStatus.IDLE
                        next.error = undefined
                        return next
                    })
                }}
            />
            <Select
                defaultValue={categories.selected}
                variant="soft"
                placeholder="Kategori"
                onChange={onCategoryChange}
            >{categoryItems}</Select>
            <Input
                placeholder="Tulis pertanyaanmu di sini..."
                required={true}
                value={newQuestionState.content}
                onChange={(event) => {
                    setPostQuestionParam(prev => {
                        const next = {...prev}
                        next.content = event.target.value
                        return next
                    })
                }}
                disabled={newQuestionState.status === UIStatus.LOADING}
            />
            <Textarea
                placeholder="Perlu lebih detil? Jabarkan di sini..."
                minRows={5}
                required={true}
                onChange={(event) => {
                    setPostQuestionParam(prev => {
                        const next = {...prev}
                        next.description = event.target.value
                        return next
                    })
                }}
                value={newQuestionState.description}
                maxRows={5}
                disabled={newQuestionState.status === UIStatus.LOADING}
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
                            onClick={() => onSubmit()} 
                            disabled={!isDataValid} 
                            loading={newQuestionState.status === UIStatus.LOADING}
                        >
                            Submit
                        </Button>     
                    </Box>
                }
            />
        </Sheet>
        </ModalDialog>
    </Modal>
}

export default NewQuestionModal