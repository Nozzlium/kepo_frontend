import { Sheet } from "@mui/joy"
import { useParams } from "react-router-dom"
import KepoNavbar from "../common/KepoNavbar"
import UserContentArea from "./UserContentArea"

const Profile = () => {

    const { id } = useParams()

    return <Sheet
        className="page"
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
                    alignItems: 'stretch'
                },
                [theme.breakpoints.up('md')]: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems:'center'
                }
            })}
        >
            <UserContentArea/>
        </Sheet>
    </Sheet>
}

export default Profile