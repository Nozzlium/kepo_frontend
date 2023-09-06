import { Button, List, ListItem, Sheet } from "@mui/joy"
import { useEffect, useRef, useState } from "react"
import Answer from "../data/Answer"
import KepoAnswerCard from "../question/KepoAnswercard"
import User from "../data/User"
import axios from "axios"
import AnswersResponse from "../response/AnswersResponse"
import AnswerParam from "../param/AnswerParam"

const UserAnswerList = ({
    user
}:{
    user: User
}) => {
    const [answers, setAnswers] = useState<Answer[]>([])
    const [isAnswersLoading, setIsAnswersLoading] = useState<boolean>(true)
    const page = useRef<number>(1)

    const items = answers.map(answer => 
        <ListItem sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch'
        }}><KepoAnswerCard answer={answer}/></ListItem>
    )

    const load = () => {
        setIsAnswersLoading(true);
        (async () => {
            const param: AnswerParam = {
                pageNo: page.current,
                pageSize: 10
            }
            const url = `http://localhost:2637/api/user/${user.id}/answer`
            const curr = answers.slice()
            const response = await axios.get<AnswersResponse>(url, {params: param})
            const answersData = response.data.data.answers
            if (answersData.length > 0) {
                const result = curr.concat(answersData)
                page.current = response.data.data.page + 1
                setIsAnswersLoading(false)
                setAnswers(result)
            } else {
                setIsAnswersLoading(false)
            }
        })()
    }

    useEffect(() => {
        load()
    }, [])

    return <Sheet
        sx={{
            display: 'flex',
            flexDirection: 'column',
        }}
    >
        <List style={{
            listStyleType: 'none',
            padding: 0
        }} >{items}</List>
        <Button variant="plain" color="neutral" onClick={() => load()} loading={isAnswersLoading}>Load More</Button>    
    </Sheet>
}

export default UserAnswerList