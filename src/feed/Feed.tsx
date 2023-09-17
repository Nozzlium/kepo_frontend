import { CssBaseline, CssVarsProvider, Sheet } from "@mui/joy"
import FeedArea from "./FeedArea"
import KepoNavbar from "../common/KepoNavbar"
import { useEffect, useRef, useState } from "react"
import Progress from "../common/Progress"

const MainView = ({height}: {height: number}) => {
    if (height == 0) {
        return <Progress/>
    }
    return <Sheet
        sx={(theme) => ({
            [theme.breakpoints.down('md')]: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                mt: `${height}px`,
            },
            [theme.breakpoints.up('md')]: {
                display: 'flex',
                flexDirection: 'column',
                alignItems:'center',
                mt: `${height}px`
            }
        })}
    >
        <FeedArea/>
    </Sheet>
}

const Feed = () => {
    const navbarRef = useRef<HTMLDivElement>()
    const [navBarHeight, setNavbarHeight] = useState<number>(0)

    useEffect(() => {
        if (navbarRef.current) {
            setNavbarHeight(navbarRef.current.offsetHeight)
        }
    }, [])

    return <Sheet
    className="page"
    sx={{
        display: 'flex',
        flexDirection: 'column'
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
    <MainView height={navBarHeight}/>
</Sheet>
}

export default Feed