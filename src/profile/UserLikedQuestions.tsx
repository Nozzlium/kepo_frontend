import { ListItem, Sheet, List, Button } from "@mui/joy"
import { useEffect, useRef, useState } from "react"
import KepoQuestionCard from "../common/KepoQuestionCard"
import Question from "../data/Question"
import User from "../data/User"
import questionRequest from "../request/QuestionRequest"
import { QuestionParam } from "../param/QuestionParam"

const UserLikedQuestions = (
    {
        user
    }:{
        user: User
    }) => {
    const [questions, setQuestions] = useState<Question[]>([])
    const pageRef = useRef<number>(1)

    const items = questions.map(question => 
        <ListItem key={question.id} sx={{ px:0 }}><KepoQuestionCard question={question}/></ListItem>
    )

    const loadMore = () => {
        (async () => {
            const param: QuestionParam = {
                pageNo: pageRef.current,
                pageSize: 10
            }
            try {
                const [questionsResult, page] = await questionRequest.getLikedByUser(user.id, param)
                if (questionsResult.length > 0) {
                    setQuestions(prev => {
                        return prev.concat(questionsResult)
                    })
                    pageRef.current = page + 1
                }
            } catch (error) {
                
            }

        })()
    }
    useEffect(() => {
        loadMore()
    }, [])

    return <Sheet
        sx={{
            display: 'flex',
            flexDirection: 'column'
        }}
    >
        <List style={{
            listStyleType: 'none',
            padding: 0
        }} >{items}</List>
        <Button variant="plain" color="neutral" onClick={() => loadMore()}>Load More</Button>    
    </Sheet>
}

export default UserLikedQuestions