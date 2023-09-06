import { ListItem, Sheet, List, Button } from "@mui/joy"
import { useState } from "react"
import KepoQuestionCard from "../common/KepoQuestionCard"
import Question from "../data/Question"

const UserLikedQuestions = () => {
    const [questions, setQuestions] = useState<Question[]>([])

    const items = questions.map(question => 
        <ListItem key={question.id} sx={{ px:0 }}><KepoQuestionCard question={question}/></ListItem>
    )

    const loadMore = () => {
        const curr = questions.slice()
        curr.push(
            {
                id: 1,
                content: 'test1',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam quis mi a sem tempus varius sit amet nec ante. Nullam tincidunt erat eu quam malesuada tristique. Etiam faucibus diam sollicitudin velit rutrum, a vestibulum sapien porttitor. Ut rhoncus leo sit amet molestie hendrerit. Donec id nullam.',
                likes: 10,
                answers: 5,
                isLiked: true,
                user: {
                    id: 1,
                    name: "hmmm"
                },
                category: {
                    id: 1,
                    name: "hayooo"
                }
            }
        )
        setQuestions(curr)
    }

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