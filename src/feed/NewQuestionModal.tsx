import { Modal, ModalDialog, Sheet, FormControl, Textarea, Box, Button, Input, Select, Option } from "@mui/joy"
import { Dispatch, SetStateAction, useState, useRef, useEffect } from "react"
import Category from "../data/Category"
import CreateQuestionBody from "../request/CreateQuestionBody"
import { create } from "domain"
import Progress from "../common/Progress"
import axios from "axios"
import CategoriesResponse from "../response/CategoriesResponse"
import QuestionResponse from "../response/QuestionResponse"
import Question from "../data/Question"

const NewQuestionModal = ({
    open,
    setOpen,
    onQuestionPosted
}: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    onQuestionPosted: (question: Question) => void
}) => {
    const [isCategoryLoading, setIsCategoryLoading] = useState<boolean>(true)
    const [isPostingLoading, setIsPostingLoading] = useState<boolean>(false)
    const categories = useRef<Category[]>([])
    const [createQuestionBody, setCreateQuestionBody] = useState<CreateQuestionBody>({
        categoryId: 0,
        content: "",
        description: ""
    })

    const closeDialog = () => {
        setCreateQuestionBody({
            categoryId: 0,
            content: "",
            description: ""
        })
        setOpen(false)
    }

    const isDataValid: boolean = 
            createQuestionBody.categoryId != 0
            && createQuestionBody.content.length !== 0
            && createQuestionBody.description.length !== 0



    const onContentInput = (
        event: React.ChangeEvent<HTMLInputElement> | null,
    ) => {
        const curr = {...createQuestionBody}
        curr.content = event ? event.target.value : ""
        setCreateQuestionBody(curr)
        console.log(createQuestionBody)
    }

    const onDescInput = (
        event: React.ChangeEvent<HTMLTextAreaElement> | null,
    ) => {
        const curr = {...createQuestionBody}
        curr.description = event ? event.target.value : ""
        setCreateQuestionBody(curr)
        console.log(createQuestionBody)
    }

    const onCategoryChange = (
        _ : React.SyntheticEvent | null,
        newValue: number | null,
    ) => {
        const curr = {...createQuestionBody}
        curr.categoryId = newValue ? newValue : 0
        setCreateQuestionBody(curr)
    }

    const onSubmit = () => {
        setIsPostingLoading(true);
        (async () => {
            const response = await axios.post<QuestionResponse>(
                "http://localhost:2637/api/question",
                createQuestionBody
            )
            setIsPostingLoading(false)
            onQuestionPosted(response.data.data)
            closeDialog();
        })()
    }

    const loadCategories = () => {
        (async () => {
            const response = await axios.get<CategoriesResponse>('http://localhost:2637/api/category')
            categories.current = response.data.data
            setIsCategoryLoading(false)
        })()
    }

    useEffect(() => {
        console.log("efek")
        loadCategories()
    }, [])

    const categoryItems = categories.current.map(category => 
        <Option value={category.id}>{category.name}</Option>
    )

    return <Modal 
        open={open} 
        onClose={() => closeDialog()}
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
        <Sheet
            sx={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {
                isCategoryLoading ?
                    <Progress/> :
                    <Select 
                        variant="soft"
                        placeholder="Category"
                        onChange={onCategoryChange}
                    >{categoryItems}</Select>
            }
            <Input
                sx={{
                    my: 1
                }}
                placeholder="Your question here..."
                required={true}
                onChange={onContentInput}
                disabled={isPostingLoading || isCategoryLoading}
            />
            <Textarea
                placeholder="Need to add details? Put them here..."
                minRows={5}
                required={true}
                onChange={onDescInput}
                maxRows={5}
                disabled={isPostingLoading || isCategoryLoading}
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
                            loading={isPostingLoading}
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