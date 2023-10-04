import { Box, Divider, List, ListItem, ListItemButton, Dropdown, MenuButton, Menu, MenuItem, ListItemDecorator, Sheet } from "@mui/joy"
import { NavigateOptions, NavigateProps, useNavigate } from "react-router-dom"
import icon from "../asset/icon.png"
import { AccountBox, Logout } from "@mui/icons-material"
import { Ref, forwardRef, useEffect, useRef, useState } from "react"
import User from "../data/User"
import userDetailRequest, { UserDetailsRequest } from "../request/UserDetailsRequest"
import { UnauthorizedError } from "../error/KepoError"
import Progress from "./Progress"

interface Prop {}

const KepoNavbar = forwardRef((
    prop: Prop,
    ref: Ref<HTMLDivElement | undefined>
) => {
    const navigate = useNavigate()
    const [isUserLoading, setIsUserLoading] = useState<boolean>(false)
    const [user, setUser] = useState<{hasUser: boolean, user: User | null}>({ hasUser: false, user: null})

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

    const goToLogin = () => {
        const props: NavigateOptions = {
            replace: false
        }
        navigate("/login", props)
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

    const ProfileMenuButton = () => {
        if (isUserLoading) {
            return <Progress/>
        } else {
            if (user.hasUser) {
                return <Dropdown>
                    <MenuButton
                        variant="plain"
                    >
                        Hello, {user.user?.username}
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
            } else {
                return <ListItemButton role="menuitem" onClick={() => goToLogin()}>
                    Sign in
                </ListItemButton>
            }
        }
    }

    const loadUser = () => {
        if (isUserLoading) {
            return
        }
        setIsUserLoading(true);
        (async () => {
            try {
                const user = await userDetailRequest.getDetails()
                setUser({
                    hasUser: true,
                    user: user
                })
            } catch (error) {
                if (error instanceof UnauthorizedError) {
                    setUser({
                        hasUser: false,
                        user: null
                    })
                }
            }
            setIsUserLoading(false)
        })()
    }

    useEffect(() => {
        loadUser()
    }, [])

    return <Sheet
        component="nav"
        sx={{
            flexGrow: 1,
            boxShadow: 'md',
            position: "fixed",
            width: "100%",
            overflow: 'hidden',
            margin: 0,
            top: 0,
            zIndex: 1
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
                <ProfileMenuButton/>
            </ListItem>
        </List>
        <Divider/>
    </Sheet>
})

export default KepoNavbar