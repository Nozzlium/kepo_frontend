import { Warning } from "@mui/icons-material"
import { Box, Button, DialogContent, DialogTitle, Modal, ModalDialog, Typography } from "@mui/joy"

const KepoConfirmationDialog = (
    {
        open,
        title,
        subtitle,
        positiveMessage,
        positiveAction,
        negativeMessage,
        negativeAction,
    } : {
        open: boolean,
        title?: string,
        subtitle?: string,
        positiveMessage?: string,
        positiveAction: () => void,
        negativeMessage?: string,
        negativeAction: () => void
    }
) => {
    return <Modal open={open}>
        <ModalDialog role="alertdialog">
            {
                title ?
                <DialogTitle>
                    {title}
                </DialogTitle>
                : null
            }
            <DialogContent>
                <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}
                    >
                    {
                        subtitle ?
                        <Typography>{subtitle}</Typography>
                        : null
                    }
                    <Button variant="solid" color="danger" onClick={negativeAction}>
                        {negativeMessage ?? "No"}
                    </Button>
                    <Button variant="plain" onClick={positiveAction}>
                        {positiveMessage ?? "Yes"}
                    </Button>
                </Box>
            </DialogContent>
        </ModalDialog>
    </Modal>
}

export default KepoConfirmationDialog