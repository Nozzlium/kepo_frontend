import { CssBaseline, CssVarsProvider, Sheet } from "@mui/joy"
import FeedArea from "./FeedArea"
import KepoNavbar from "../common/KepoNavbar"

const Feed = () => {
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
        <KepoNavbar/>
    </Sheet>
    <Sheet
        sx={{
            zIndex: -1
        }}
    >
        <KepoNavbar/>
    </Sheet>
    <Sheet
    sx={(theme) => ({
        [theme.breakpoints.down('md')]: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
        },
        [theme.breakpoints.up('md')]: {
            display: 'flex',
            flexDirection: 'column',
            alignItems:'center',
        }
    })}
    >
        <FeedArea/>
    </Sheet>
</Sheet>
}

export default Feed