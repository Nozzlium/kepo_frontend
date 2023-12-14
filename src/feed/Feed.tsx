import { Box } from "@mui/joy"
import FeedArea from "./FeedArea"
import KepoNavbar from "../common/KepoNavbar"
import KepoGeneralErrorAlert from "../common/KepoGeneralErrorAlert"
import { useState } from "react"
import { UIStatus } from "../lib/ui-status"
import { KepoError } from "../error/KepoError"

interface FeedPageState {
    status: UIStatus.IDLE | UIStatus.ERROR
    error?: KepoError
}

const Feed = () => {

    const [feedPageState, setFeedPageState] = useState<FeedPageState>({
        status: UIStatus.IDLE
    })

    const onError = (error?: KepoError) => {
        if (feedPageState.status === UIStatus.ERROR) {
            return
        }
        setFeedPageState(_prev => {
            return {
                status: UIStatus.ERROR,
                error: error ?? new KepoError()
            }
        })
    }

    return <Box
        className="page"
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
            <FeedArea
                onError={onError}
            />
        </Box>
        <KepoGeneralErrorAlert
            title={feedPageState.error?.message ?? "terjadi error"}
            show={feedPageState.status === UIStatus.ERROR}
            onCloseClicked={() => {
                setFeedPageState(_prev => {
                    return {
                        status: UIStatus.IDLE
                    }
                })
            }}
        />
    </Box>
}

export default Feed