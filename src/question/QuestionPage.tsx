import { Box, Sheet } from "@mui/joy"
import KepoNavbar from "../common/KepoNavbar"
import AnswerArea from "./AnswerArea"
import Question from "../data/Question"
import { useEffect, useRef, useState } from "react"
import Progress from "../common/Progress"
import { useParams } from "react-router-dom"
import axios from "axios"
import QuestionResponse from "../response/QuestionResponse"
import { height } from "@mui/system"

const QuestionPage = () => {
    const [navbarHeight, setNavbarHeight] = useState<number>(0)
    const navbarRef = useRef<HTMLDivElement>()

    useEffect(() => {}, [])

    return <Box
        className="page"
        sx={{
            display: 'flex',
            flexDirection: 'column',
        }}
    >
        <KepoNavbar/>
        <Box
            sx={(theme) => ({
                [theme.breakpoints.down('md')]: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    mt: `55px`
                },
                [theme.breakpoints.up('md')]: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems:'center',
                    mt: `55px`
                }
            })}
        >
            <AnswerArea />
        </Box>
    </Box>
}

export default QuestionPage