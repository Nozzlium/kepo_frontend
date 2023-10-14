import { Box, Sheet } from "@mui/joy"
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
            <UserContentArea/>
        </Box>
    </Box>
}

export default Profile