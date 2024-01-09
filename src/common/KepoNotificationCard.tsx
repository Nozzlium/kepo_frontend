import { Box, ThemeProvider, Typography, useTheme } from "@mui/joy"
import UserNotification from "../data/Notification"
import { Forum, Recommend } from "@mui/icons-material"
import { MAIN_INTERACTION_COLOR, TEXT_COLOR_WHITE } from "../constants/color"

interface NotificationCardState {
    userNotification?: UserNotification
}

const NotificationIcon = (
    {
        notificationType,
        color
    } : {
        notificationType?: string,
        color: string
    }
) => {
    switch (notificationType) {
        case "LKE":
            return <Recommend
                sx={{
                    color: color
                }}
            />
        default:
            return <Forum/>
    }
}

const getBackgroundColor = (
    isRead: boolean,
    backdrop: string
) => {
    if (!isRead) {
        return MAIN_INTERACTION_COLOR
    }

    return backdrop
}

const getTextColor = (
    isRead: boolean,
    textColorRead: string,
    textColorUnread: string
) => {
    if (!isRead) {
        return textColorUnread
    }

    return textColorRead
}

const KepoNotificationCard = (
    {
        notification,
        onNotificationSelected
    } : {
        notification: UserNotification,
        onNotificationSelected: (notification: UserNotification) => void
    }
) => {

    const theme = useTheme()

    const textColor = getTextColor(
        notification.isRead,
        theme.getCssVar("palette-text-primary"),
        TEXT_COLOR_WHITE
    )

    return <div
        style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 8,
            padding: 8,
            margin: "4px 0px",
            borderRadius: "8px",
            backgroundColor: getBackgroundColor(notification.isRead, theme.getCssVar("palette-background-body"))
        }}
        onClick={() => onNotificationSelected(notification)}
    >
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <NotificationIcon
                notificationType={notification.notificationType}
                color={textColor}
            />
        </div>
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
            }}
        >
            <Typography level="title-sm" sx={{color: textColor}} >{notification.headline} - <Typography noWrap level="body-xs" sx={{color: textColor}}>{notification.createdAt}</Typography></Typography>
            <Typography level="body-sm" sx={{color: textColor}}>{notification.preview}</Typography>
        </div>
    </div>

}

export default KepoNotificationCard