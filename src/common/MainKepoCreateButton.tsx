import { Create } from "@mui/icons-material"
import { Button } from "@mui/joy"

const MainKepoCreateButton = (
    {
        text,
        onClick
    }:
    {   
        text?: string,
        onClick?: () => void
    }) => {
        return <Button
            startDecorator={<Create/>}
            onClick={onClick}
            sx={{
                backgroundColor: '#eb6f00',
                color: '#f2f2f2',
                "&:hover": {
                    backgroundColor: '#aa5000'
                }
            }}
        >{text ?? 'Create'}</Button>
}

export default MainKepoCreateButton