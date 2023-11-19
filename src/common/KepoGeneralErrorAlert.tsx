import { CloseRounded, Warning } from "@mui/icons-material"
import { Alert, IconButton, Typography } from "@mui/joy"

const KepoGeneralErrorAlert = (
    {
        title,
        show,
        onCloseClicked
    } : {
        title: string,
        show: boolean,
        onCloseClicked?: () => void
    }
) => {
    if (!show) 
        return null

    return <Alert
                key={title}
                sx={{ 
                    alignItems: 'flex-start',
                    position: 'fixed',
                    bottom: 0, 
                    width: '100%',
                    margin: 1 
                }}
                startDecorator={<Warning/>}
                variant="soft"
                color="danger"
                endDecorator={
                <IconButton 
                    variant="soft" 
                    color="danger"
                    onClick={onCloseClicked}
                >
                    <CloseRounded />
                </IconButton>
                }
            >
                <div>
                <div>{title}</div>
                <Typography level="body-sm" color="danger">
                    Mohon coba lagi.
                </Typography>
                </div>
            </Alert>
}

export default KepoGeneralErrorAlert