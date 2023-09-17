import { Sheet } from "@mui/joy"
import { useParams } from "react-router-dom"
import KepoNavbar from "../common/KepoNavbar"
import UserContentArea from "./UserContentArea"
import { useState, useRef, useEffect } from "react"
import Progress from "../common/Progress"

const MainView = (
{
    navbarHeight
}: {
    navbarHeight: number
}) => {
    if (navbarHeight === 0) {
        return <Progress />
    }
    return <Sheet
        sx={(theme) => ({
            [theme.breakpoints.down('md')]: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                mt: `${navbarHeight}px`
            },
            [theme.breakpoints.up('md')]: {
                display: 'flex',
                flexDirection: 'column',
                alignItems:'center',
                mt: `${navbarHeight}px`
            }
        })}
    >
        <UserContentArea/>
    </Sheet>
}

const Profile = () => {
    const [navbarHeight, setNavbarHeight] = useState<number>(0)
    const navbarRef = useRef<HTMLDivElement>()

    const { id } = useParams()

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
        <MainView navbarHeight={navbarHeight} />
    </Sheet>
}

export default Profile