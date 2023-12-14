import UserNotification from "../data/Notification"

export interface NotificationResponse {
    code: number,
    status: string,
    data: UserNotification
}

interface NotificationsData {
    pageNo: number,
    pageSize: number,
    totalUnread: number,
    notifications: UserNotification[]
}

interface NotificationsTotalUnreadData {
    totalUnread: number
}

export interface NotificationsResponse {
    code: number,
    status: string,
    data: NotificationsData
}

export interface NotificationsTotalUnreadResponse {
    code: number,
    status: string,
    data: NotificationsTotalUnreadData
}


