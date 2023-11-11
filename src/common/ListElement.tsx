import { List, Typography } from "@mui/joy"
import { UIStatus } from "../lib/ui-status"

const ListElement = ({
        status,
        items,
        emptyMessage
    } : {
        status: UIStatus,
        items: JSX.Element[],
        emptyMessage?: string
    }
) => {
    if (items.length === 0) {
        if (status === UIStatus.LOADING)
            return null
        
        return <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                padding: '16px 0 16px 0'
            }}
        >
            <Typography
                level="body-sm"
            ><b>{emptyMessage ?? ""}</b></Typography>
        </div>
    }

    return <List style={{
                listStyleType: 'none',
                padding: 0
            }} >{items}</List>
}

export default ListElement