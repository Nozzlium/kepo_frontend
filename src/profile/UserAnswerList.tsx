import { Box, Button, List, ListItem, Sheet } from "@mui/joy"
import { useEffect, useRef, useState } from "react"
import Answer from "../data/Answer"
import KepoAnswerCard from "../question/KepoAnswercard"
import User from "../data/User"
import axios from "axios"
import { AnswersResponse } from "../response/AnswersResponse"
import { AnswerParam } from "../param/AnswerParam"
import answerRequest from "../request/AnswerRequest"

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
            const [answersResult, currentPage] = await answerRequest.getByUser(user.id, param)
            if (answersResult.length > 0) {
                const curr = answers.slice()
                const result = curr.concat(answersResult)
                page.current = currentPage + 1
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

    return <Box
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
    </Box>
}

export default UserAnswerList