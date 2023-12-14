interface UserNotification {
    id: number,
    userId: number,
    questionId: number,
    notificationType: string,
    headline: string,
    preview: string,
    isRead: boolean,
    createdAt: string
}

export default UserNotification