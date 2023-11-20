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
import { UIStatus } from "../lib/ui-status"
import { KepoError } from "../error/KepoError"
import KepoGeneralErrorAlert from "../common/KepoGeneralErrorAlert"

interface QuestionPageState {
    status: UIStatus.IDLE | UIStatus.ERROR
    error?: KepoError
}

const QuestionPage = () => {

    const [questionPageState, setQuestionPageState] = useState<QuestionPageState>({
        status: UIStatus.IDLE
    })

    const onError = (error? : KepoError) => {
        setQuestionPageState(_prev => {
            return {
                status: UIStatus.ERROR,
                error: error ?? new KepoError("", "")
            }
        })
    }

    return <Box
        className="page"
        sx={{
            display: 'flex',
            flexDirection: 'column',
        }}
    >
        <KepoNavbar
            onError={onError}
        />
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
            <AnswerArea 
                onError={onError}
            />
        </Box>
        <KepoGeneralErrorAlert
            title={questionPageState.error?.message ?? "terjadi error"}
            show={questionPageState.status === UIStatus.ERROR}
            onCloseClicked={() => {
                setQuestionPageState(_prev => {
                    return {
                        status: UIStatus.IDLE
                    }
                })
            }}
        />
    </Box>
}

export default QuestionPage