import { Box, Divider, List, ListItem, ListItemButton, Dropdown, MenuButton, Menu, MenuItem, ListItemDecorator } from "@mui/joy"
import { NavigateOptions, NavigateProps, useNavigate } from "react-router-dom"
import icon from "../asset/icon.png"
import { AccountBox, Logout } from "@mui/icons-material"

const KepoNavbar = () => {
    const navigate = useNavigate()

    const goToProfile = (id: string) => {
        const props: NavigateOptions = {
            replace: false
        }
        navigate("/profile/"+id, props)
    }

    const goToHomeFeed = () => {
        const props: NavigateOptions = {
            replace: false
        }
        navigate("/", props)
    }

    const isTokenStored = () => {
        return localStorage.getItem('token') !== null
    }

    const onUserOptionSelect = (
        value: number,
    ) => {
        switch(value) {
            case 1 : {
                goToProfile("1")
                return
            }
            case 2 : {
                goToHomeFeed()
                return
            }
        }
    }

    return <Box
        component="nav"
        sx={{
            flexGrow: 1,
        }}
    >
        <List orientation="horizontal" role="menubar">
            <ListItem role="none">
                <ListItemButton role="menuitem" onClick={() => goToHomeFeed()}>
                    <img 
                        src={icon}
                        style={{
                            width: 32
                        }}
                    />
                </ListItemButton>
            </ListItem>
            <ListItem role="none" sx={{ marginInlineStart: 'auto' }}>
                <Dropdown>
                    <MenuButton
                        variant="plain"
                    >
                        Hello, User
                    </MenuButton>
                    <Menu
                        variant="plain">
                            <MenuItem onClick={() => onUserOptionSelect(1)}>
                                <ListItemDecorator>
                                    <AccountBox/>
                                </ListItemDecorator>
                                Profile
                            </MenuItem>
                            <MenuItem onClick={() => onUserOptionSelect(2)}>
                                <ListItemDecorator>
                                    <Logout/>
                                </ListItemDecorator>
                                Logout
                            </MenuItem>
                    </Menu>
                </Dropdown>
            </ListItem>
        </List>
        <Divider/>
    </Box>
}

export default KepoNavbar