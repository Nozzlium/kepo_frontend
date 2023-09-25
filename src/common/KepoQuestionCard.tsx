import { Box, Button, Link, Sheet, Typography } from "@mui/joy"
import Question from "../data/Question"
import { ThumbUp, ThumbUpOffAltOutlined } from "@mui/icons-material"
import { useState } from "react"
import likeRequest from "../request/LikeRequest"
import { QuestionLikeParam } from "../param/LikeParam"

const KepoQuestionCard = (
    {
        question
    }: 
    {
        question: Question
    }
) => {
    const [itemLikeLoading, setItemLikeLoading] = useState<boolean>(false)
    const [questionDisplay, setQuestionDisplay] = useState<Question>(question)

    function handleCLick() {
        setItemLikeLoading(true);
        (async () => {
            const param: QuestionLikeParam = {
                questionId: questionDisplay.id,
                isLiked: !questionDisplay.isLiked
            }
            const result = await likeRequest.likeQuestion(param)
            setQuestionDisplay(result)
            setItemLikeLoading(false)
        })()
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
                loading={itemLikeLoading} 
                variant="plain"
                color="neutral"
                onClick={() => handleCLick()}
            >
                {
                    questionDisplay.isLiked ? (<ThumbUp/>) : (<ThumbUpOffAltOutlined/>)
                }
            </Button>
            <Typography level="body-xs"><b>{questionDisplay.likes}</b></Typography>
        </Box>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 1,
            }}
        >
            <Link level="body-lg" color="neutral" sx={{my: 1}} href={"/question/" + questionDisplay.id}><b>{questionDisplay.content}</b></Link>
            <Typography level="body-sm">{questionDisplay.description}</Typography>
            <Typography level="body-xs" sx={{my: 1}}><b>{questionDisplay.answers} Answer(s)</b></Typography>
        </Box>
    </Sheet>
}
export default KepoQuestionCard