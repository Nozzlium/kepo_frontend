import { Sheet } from "@mui/joy"
import KepoNavbar from "../common/KepoNavbar"
import AnswerArea from "./AnswerArea"
import Question from "../data/Question"
import { useEffect, useRef, useState } from "react"
import Progress from "../common/Progress"
import { useParams } from "react-router-dom"
import axios from "axios"
import QuestionResponse from "../response/QuestionResponse"
import { height } from "@mui/system"

const MainView = (
    {
        height,
    }:
    {
        height: number
    }
) => {
    if (height === 0) {
        return <Progress/>
    } else {
        return <Sheet
            sx={(theme) => ({
                [theme.breakpoints.down('md')]: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    mt: `${height}px`
                },
                [theme.breakpoints.up('md')]: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems:'center',
                    mt: `${height}px`
                }
            })}
        >
            <AnswerArea />
        </Sheet>
    }
}

const QuestionPage = () => {
    const [navbarHeight, setNavbarHeight] = useState<number>(0)
    const navbarRef = useRef<HTMLDivElement>()

    useEffect(() => {
        if (navbarRef.current) {
            setNavbarHeight(navbarRef.current.offsetHeight)
        }
    }, [])

    return <Sheet
        className="page"
        sx={{
            display: 'flex',
            flexDirection: 'column',
        }}
    >
        <Sheet
            sx={{
                position: "fixed",
                width: "100%",
                zIndex: 1
            }}
        >
            <KepoNavbar ref={navbarRef}/>
        </Sheet>
        <MainView height={navbarHeight}/>
    </Sheet>
}

export default QuestionPage