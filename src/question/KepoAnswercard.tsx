import { Button, Divider, Link, Sheet, Typography } from "@mui/joy"
import Answer from "../data/Answer"
import { ThumbUp, ThumbUpOffAltOutlined } from "@mui/icons-material"
import { useState } from "react"

const KepoAnswerCard = ({answer}: {answer: Answer}) => {
    const [answerDisplay, setAnswerDisplay] = useState<Answer>(answer)

    return <Sheet
        sx={{
            display: 'flex',
            flexDirection: 'column'
        }}
    >
        <Sheet
            sx={{
                display: 'flex',
                flexDirection: 'row',
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
                        loading={false} 
                        variant="plain"
                        color="neutral"
                >
                        {
                            answerDisplay.isLiked ? (<ThumbUp/>) : (<ThumbUpOffAltOutlined/>)
                        }
                </Button>
                <Typography level="body-xs"><b>{answerDisplay.likes}</b></Typography>
            </Sheet>
            <Sheet
                sx={{
                    padding: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Typography
                    startDecorator={<b><Link href={"/profile/" + answerDisplay.user.id} color="neutral">{answerDisplay.user.username}</Link></b>}
                    level="body-xs"
                >
                    {"answered:"}
                </Typography>
                <Typography level="body-sm">{answerDisplay.content}</Typography>
            </Sheet>
        </Sheet>
        <Divider/>
    </Sheet>
}

export default KepoAnswerCard