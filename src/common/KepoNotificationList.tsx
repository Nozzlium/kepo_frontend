import { useEffect, useState } from "react"
import UserNotification from "../data/Notification"
import { UIStatus } from "../lib/ui-status"
import KepoNotificationCard from "./KepoNotificationCard"
import { Button } from "@mui/joy"
import notificationRequest from "../request/NotificationRequest"
import { useNavigate } from "react-router-dom"

interface NotificationListState {
    data: UserNotification[]
    page: number
    status: UIStatus.SUCCESS | UIStatus.ERROR | UIStatus.LOADING | UIStatus.IDLE
}

const KepoNotificationList = (
    {
        size
    } : {
        size?: number
    }
) => {
    const navigate = useNavigate()
    const [notificationListState, setNotificationListState] = useState<NotificationListState>({
        data: [],
        page: 0,
        status: UIStatus.LOADING
    })

    const loadNotifications = (signal?: AbortSignal) => {
        (async () => {
            try {
                const [notifs, pageNo] = await notificationRequest.get({
                    pageNo: notificationListState.page + 1,
                    pageSize: size
                }, signal)
                setNotificationListState(prev => {
                    const next = {...prev}
                    if (notifs.length > 0) {
                        next.data = prev.data.concat(notifs)
                        next.page = pageNo
                    }
                    next.status = UIStatus.SUCCESS
                    return next
                })
            } catch (error) {
                if (signal?.aborted)
                    return
            }
        })()
    }

    useEffect(() => {
        const controller = new AbortController()

        if (notificationListState.status === UIStatus.LOADING) {
            loadNotifications(controller.signal)
        }

        return () => {
            controller.abort()
        }
    }, [notificationListState.status])

    const listItem = notificationListState.data.map(userNotification =>
        <li key={userNotification.id}>
            <KepoNotificationCard
                notification={userNotification}
                onNotificationSelected={(notification) => {
                    notificationRequest.read(notification.id)
                    navigate(`/question/${notification.questionId}`)
                }}
            />
        </li>
    )

    return <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            margin: 8
        }}
    >
        <ul
        >
            {listItem}
        </ul>
        <Button 
            variant="plain" 
            color="neutral" 
            onClick={() => {
                setNotificationListState(prev => {
                    const next = {...prev}
                    next.status = UIStatus.LOADING
                    return next
                })
            }} 
            loading={notificationListState.status === UIStatus.LOADING}>Load More</Button>
    </div>
}

export default KepoNotificationList