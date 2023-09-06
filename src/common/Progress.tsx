import { CircularProgress, Sheet } from "@mui/joy"

const Progress = () => {
    return <Sheet
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 1
        }}
    >
        <CircularProgress variant="plain" />
    </Sheet>
}

export default Progress