import { Button, List, ListItem, Sheet, Select, Option } from "@mui/joy"
import KepoQuestionCard from "../common/KepoQuestionCard"
import Question from "../data/Question"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import Category from "../data/Category"
import axios from "axios"
import QuestionsResponse from "../response/QuestionsResponse"
import { QuestionParam } from "../param/QuestionParam"
import questionRequest from "../request/QuestionRequest"

const QuestionList = (
    {
        categories,
        questions,
        setQuestions
    }:{
        categories: Category[],
        questions: Question[],
        setQuestions: Dispatch<SetStateAction<Question[]>>,
    }
) => {
    const [isQuestionsLoading, setIsQuestionsLoading] = useState<boolean>(false)
    const page = useRef<number>(1)
    const category = useRef<number>(1)

    function load() {
        setIsQuestionsLoading(true);
        (async () => {
            const params: QuestionParam = {
                pageNo: page.current,
                pageSize: 10
            }
            if (category.current !== 0) {
                params.category = category.current
            }
            const [questions, pageNo] = await questionRequest.getFeed(params)
            if (questions.length > 0) {
                if (pageNo === 1) {
                    setQuestions(questions)
                } else {
                    const curr = questions.slice()
                    const res = curr.concat(questions)
                    page.current = pageNo + 1
                    setQuestions(res)
                }
            }
            setIsQuestionsLoading(false)
        })()
    }

    const handleChange = (
        event: React.SyntheticEvent | null,
        newValue: number | null,
    ) => {
        category.current = newValue ? newValue : 0
        page.current = 1
        setQuestions([])
        load()
    };

    useEffect(() => {
        load()
    }, [])

    const listItem = questions.map(question => 
        <ListItem key={question.id}><KepoQuestionCard question={question} /></ListItem>
    )

    const categoryItems = categories.map(category => 
        <Option key={category.id} value={category.id}>{category.name}</Option>
    )

    return <Sheet
        sx={{
            display: 'flex',
            flexDirection: 'column',
        }}
    >
        <Select 
            defaultValue={1}
            variant="soft"
            sx={{
                my: 1
            }}
            onChange={handleChange}
        >{categoryItems}</Select>
        <List sx={{
            listStyleType: 'none',
            p: 0,
            mb: 1
        }} >{listItem}</List>
        <Button variant="plain" color="neutral" onClick={() => load()} loading={isQuestionsLoading}>Load More</Button>
    </Sheet>
}

export default QuestionList