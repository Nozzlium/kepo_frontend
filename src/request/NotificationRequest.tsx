import UserNotification from "../data/Notification"
import NotificationParam from "../param/NotificationParam"
import { NotificationResponse, NotificationsResponse, NotificationsTotalUnreadResponse } from "../response/NotificationResponse"
import networkCall from "./NetworkCall"

/* 
    Returns [data, pageNo, totalUnread]
*/
class NotificationRequest {
    get: (params: NotificationParam, signal?: AbortSignal) => Promise<[UserNotification[], number]> = async (params: NotificationParam, signal?: AbortSignal) => {
        const resp = await networkCall.get<NotificationsResponse>('http://localhost:2637/api/notification', {
            params: {
                pageNo: params.pageNo ?? 1,
                pageSize: params.pageSize ?? 5
            },
            signal: signal
        })
        const data = resp.data.data
        return [
            data.notifications,
            data.pageNo
        ]
    }

    read: (notificationId: number, signal?: AbortSignal) => Promise<UserNotification> = async (notificationId: number, signal?: AbortSignal) => {
        const resp = await networkCall.put<NotificationResponse>(`http://localhost:2637/api/notification/${notificationId}/read`, {
            signal: signal
        })
        const data = resp.data.data
        return data
    }

    getTotalUnread: (signal?: AbortSignal) => Promise<number> = async (signal?: AbortSignal) => {
        const resp = await networkCall.get<NotificationsTotalUnreadResponse>(`http://localhost:2637/api/notification/unread`, {
            signal: signal
        })
        return resp.data.data.totalUnread
    }
}

const notificationRequest = new NotificationRequest()

export default notificationRequest