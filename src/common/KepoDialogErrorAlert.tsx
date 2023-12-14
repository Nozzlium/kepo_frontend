import { Close } from "@mui/icons-material"
import { Alert, IconButton } from "@mui/joy"

const KepoDialogErrorAlert = (
    {
        show,
        text,
        onClose
    }:
    {
        show?: Boolean,
        text?: string,
        onClose?: () => void
    }
) => {
    if (!show) {
        return null
    }

    return <Alert 
        variant="soft"
        color="danger"
        sx={{
            mt: 1
        }}
        endDecorator={
            <IconButton variant="solid" size="sm" color="danger" onClick={onClose}>
                <Close />
            </IconButton>
        }
    >
        {text ?? "Terjadi error"}
    </Alert>
    
}

export default KepoDialogErrorAlert