import { useEffect, useState } from "react"
import UserNotification from "../data/Notification"
import { UIStatus } from "../lib/ui-status"
import KepoNotificationCard from "./KepoNotificationCard"
import { Button } from "@mui/joy"
import notificationRequest from "../request/NotificationRequest"
import { useNavigate } from "react-router-dom"
import ListElement from "./ListElement"
import { UnauthorizedError } from "../error/KepoError"

interface NotificationListState {
    data: UserNotification[]
    page: number
    status: UIStatus.SUCCESS | UIStatus.ERROR | UIStatus.LOADING | UIStatus.IDLE
}

const InteractButton = (
    {
        miniView,
        onInteractButtonClicked,
        status
    }: {
        miniView?: boolean,
        onInteractButtonClicked?: () => void,
        status: UIStatus
    }
) => {
    let hint = "Muat lebih banyak lagi"

    if (miniView) {
        hint = "Lihat semua"
    }

    return <Button 
        variant="plain" 
        color="neutral" 
        onClick={() => {
            if (onInteractButtonClicked)
                onInteractButtonClicked()
        }} 
        loading={status === UIStatus.LOADING}>{ hint }</Button>
}

const KepoNotificationList = (
    {
        size,
        miniView
    } : {
        size?: number,
        miniView?: boolean
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

                switch (true) {
                    case error instanceof UnauthorizedError: {
                        navigate("/login", {
                            replace: true
                        })
                    }
                }
            }
        })()
    }

    const redirectToNotificationPage = () => {
        navigate(`/notification`)
    }

    const onInteractButtonClicked = () => {
        if (miniView) {
            redirectToNotificationPage()
        } else {
            setNotificationListState(prev => {
                const next = {...prev}
                next.status = UIStatus.LOADING
                return next
            })
        }
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
            margin: 8,
            gap: "8px"
        }}
    >
        <ListElement
            status={notificationListState.status}
            items={listItem}
            emptyMessage="Tidak ada notifikasi"
        />
        <InteractButton
            miniView={miniView}
            status={notificationListState.status}
            onInteractButtonClicked={() => {
                onInteractButtonClicked()
            }}
        />
    </div>
}

export default KepoNotificationList