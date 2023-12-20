import { useState } from "react"
import { UIStatus } from "../lib/ui-status"
import { KepoError } from "../error/KepoError"
import KepoNavbar from "../common/KepoNavbar"
import KepoNotificationList from "../common/KepoNotificationList"
import KepoGeneralErrorAlert from "../common/KepoGeneralErrorAlert"

interface NotificationPageState {
    status: UIStatus.IDLE | UIStatus.SUCCESS | UIStatus.ERROR
    error?: KepoError
}

const NotificationPage = () => {
    const [notificationPageState, setNotificationPageState] = useState<NotificationPageState>({
        status: UIStatus.IDLE
    })

    const onError = (error?: KepoError) => {
        if (notificationPageState.status === UIStatus.ERROR) {
            return
        }
        setNotificationPageState(_prev => {
            return {
                status: UIStatus.ERROR,
                error: error ?? new KepoError()
            }
        })
    }

    return <div
        className="page"
    >
        <KepoNavbar
            onError={onError}
        />
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '55px'
            }}
        >
            <div
                className="page-content"
            >
                <KepoNotificationList/>
            </div>
        </div>
        <KepoGeneralErrorAlert
            title={notificationPageState.error?.message ?? "terjadi error"}
            show={notificationPageState.status === UIStatus.ERROR}
            onCloseClicked={() => {
                setNotificationPageState(_prev => {
                    return {
                        status: UIStatus.IDLE
                    }
                })
            }}
        />
    </div>
}

export default NotificationPage