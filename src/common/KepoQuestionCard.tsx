import { Button, Link, Sheet, Typography } from "@mui/joy"
import Question from "../data/Question"
import { ThumbUp, ThumbUpOffAltOutlined } from "@mui/icons-material"
import { useState } from "react"

const KepoQuestionCard = (
    {
        question
    }: 
    {
        question: Question
    }
) => {
    const [itemLikeLoading, setItemLikeLoading] = useState(false)
    const [questionDisplay, setQuestionDisplay] = useState(question)

    function handleCLick() {
        const currDis: Question = {...questionDisplay}
        const currLike = currDis.isLiked = !currDis.isLiked
        if (currLike) {
            currDis.likes +=1
        } else {
            currDis.likes -= 1
        }
        setQuestionDisplay(currDis)
    }

    return <Sheet
        variant="outlined"
        sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%'
        }}
    >
        <Sheet
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
        </Sheet>
        <Sheet
            sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 1,
            }}
        >
            <Link level="body-lg" color="neutral" sx={{my: 1}} href={"/question/" + questionDisplay.id}><b>{questionDisplay.content}</b></Link>
            <Typography level="body-sm">{questionDisplay.description}</Typography>
            <Typography level="body-xs" sx={{my: 1}}><b>{questionDisplay.answers} Answer(s)</b></Typography>
        </Sheet>
    </Sheet>
}
export default KepoQuestionCard