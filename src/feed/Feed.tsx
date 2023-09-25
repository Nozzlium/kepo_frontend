import { Box, CssBaseline, CssVarsProvider, Sheet } from "@mui/joy"
import FeedArea from "./FeedArea"
import KepoNavbar from "../common/KepoNavbar"
import { useEffect, useRef, useState } from "react"
import Progress from "../common/Progress"

const Feed = () => {
    const navbarRef = useRef<HTMLDivElement>()
    const [navBarHeight, setNavbarHeight] = useState<number>(0)

    useEffect(() => {
    }, [])

    return <Box
        className="page"
    >   
        <KepoNavbar ref={navbarRef}/>
        <Box
            sx={(theme) => ({
                [theme.breakpoints.down('md')]: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    mt: '55px'
                },
                [theme.breakpoints.up('md')]: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems:'center',
                    mt: '55px'
                }
            })}
        >
            <FeedArea/>
        </Box>
    </Box>
}

export default Feed