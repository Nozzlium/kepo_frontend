import { Box, Button, FormControl, ModalDialog, Sheet, Textarea, Typography } from "@mui/joy"
import Modal from "@mui/joy/Modal"
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react"
import CreateAnswerBody from "../request/CreateAnswerBody"

const NewAnswerModal = ({
    open,
    setOpen,
}: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
}) => {

    const [createanswerBody, setCreateQuestionBody] = useState<CreateAnswerBody>({
        questionId: 1,
        content: ""
    })

    const isValid = createanswerBody.content.length > 0

    const closeDialog = () => {
        setCreateQuestionBody({
            questionId: 1,
            content: ""
        })
        setOpen(false)
    }

    const onContentChange = (
        event: ChangeEvent<HTMLTextAreaElement>
    ) => {
        const curr = {...createanswerBody}
        curr.content = event.target.value
        setCreateQuestionBody(curr)
    }

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
            <FormControl>
                <Textarea
                    placeholder="Your answer here..."
                    minRows={5}
                    maxRows={5}
                    onChange={(event) => onContentChange(event)}
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
                            <Button sx={{ml: 'auto'}} disabled={!isValid}>Submit</Button>     
                        </Box>
                    }
                />
            </FormControl>
        </Sheet>
        </ModalDialog>
    </Modal>
}

export default NewAnswerModal