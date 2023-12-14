import { Box, Sheet } from "@mui/joy"
import { useParams } from "react-router-dom"
import KepoNavbar from "../common/KepoNavbar"
import UserContentArea from "./UserContentArea"
import { useState, useRef, useEffect } from "react"
import Progress from "../common/Progress"
import { UIStatus } from "../lib/ui-status"
import { KepoError } from "../error/KepoError"
import KepoGeneralErrorAlert from "../common/KepoGeneralErrorAlert"

interface ProfilePageState {
    status: UIStatus.IDLE | UIStatus.ERROR
    error?: KepoError
}

const Profile = () => {

    const [profilePageState, setProfilePageState] = useState<ProfilePageState>({
        status: UIStatus.IDLE
    })

    const onError = (error?: KepoError) => {
        if (profilePageState.status === UIStatus.ERROR) {
            return
        }
        setProfilePageState(_prev => {
            return {
                status: UIStatus.ERROR,
                error: error ?? new KepoError()
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
            <UserContentArea
                onError={onError}
            />
        </Box>
        <KepoGeneralErrorAlert
            title={profilePageState.error?.message ?? "terjadi error"}
            show={profilePageState.status === UIStatus.ERROR}
            onCloseClicked={() => {
                setProfilePageState(_prev => {
                    return {
                        status: UIStatus.IDLE
                    }
                })
            }}
        />
    </Box>
}

export default Profile