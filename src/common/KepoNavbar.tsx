import { Box, Divider, List, ListItem, ListItemButton, Dropdown, MenuButton, Menu, MenuItem, ListItemDecorator, Sheet } from "@mui/joy"
import { NavigateOptions, NavigateProps, useLocation, useNavigate } from "react-router-dom"
import icon from "../asset/icon.png"
import { AccountBox, Logout, Notifications } from "@mui/icons-material"
import { Ref, forwardRef, useEffect, useRef, useState } from "react"
import User from "../data/User"
import userDetailRequest, { UserDetailsRequest } from "../request/UserDetailsRequest"
import Progress from "./Progress"
import { UIStatus } from "../lib/ui-status"
import token from "../lib/Token"
import { KepoError, UnauthorizedError } from "../error/KepoError"
import KepoNotificationCard from "./KepoNotificationCard"
import KepoNotificationList from "./KepoNotificationList"

interface NavbarState {
    user?: User,
    status: UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR | UIStatus.IDLE,
    error?: KepoError
}

const ProfileMenuButton = (
    {
        navbarState,
        onUserOptionSelect,
        goToLogin
    }:{
        navbarState: NavbarState,
        onUserOptionSelect: (item: number) => void,
        goToLogin: () => void
    }
) => {
    if (navbarState.status === UIStatus.LOADING) {
        return <Progress/>
    } else {
        if (navbarState.user) {
            return <Dropdown>
                <MenuButton
                    variant="plain"
                >
                    Hello, {navbarState.user.username}
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

const NotificationMenuButton = (
    {
        status,
        onNotificationSelected
    } : {
        status : UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR,
        onNotificationSelected: (notification: Notification) => void
    }
) => {
    if (status === UIStatus.SUCCESS) {
        return <Dropdown>
            <MenuButton
                variant="plain"
            >
                <Notifications/>
            </MenuButton>
            <Menu
                className="notif-popup"
            >
                <KepoNotificationList/>
            </Menu>
        </Dropdown>
    }

    return <Progress/>
}

const KepoNavbar = (
    {
        onError
    }: {
        onError?: (error: KepoError) => void
    }
) => {
    const navigate = useNavigate()
    const [navbarState, setNavbarState] = useState<NavbarState>({
        status: UIStatus.LOADING
    })

    const goToProfile = () => {
        navigate(`/profile/${navbarState.user?.id}`)
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
                goToProfile()
                return
            }
            case 2 : {
                token.discardToken()
                window.location.reload()
                return
            }
        }
    }

    const loadUser = (
        signal?: AbortSignal
    ) => {
        (async () => {
            try {
                const user = await userDetailRequest.getDetails(signal)
                setNavbarState({
                    user: user,
                    status: UIStatus.SUCCESS
                })
            } catch (error) {
                if (signal?.aborted) {
                    return
                }

                switch (true) {
                    case error instanceof UnauthorizedError:
                        setNavbarState({
                            status: UIStatus.IDLE
                        })
                        break
                    case error instanceof KepoError:
                        setNavbarState({
                            status: UIStatus.ERROR,
                            error: error as KepoError
                        })
                        break
                    default:
                        setNavbarState({
                            status: UIStatus.ERROR,
                            error: new KepoError()
                        })
                        break
                }
            }
        })()
    }

    useEffect(() => {
        const controller = new AbortController()
        if (navbarState.status === UIStatus.LOADING) {
            loadUser(controller.signal)
        }

        if (navbarState.status === UIStatus.ERROR) {
            if (onError)
                onError(navbarState.error ?? new KepoError())
        }

        return () => {
            controller.abort()
        }
    }, [navbarState])

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
                <NotificationMenuButton
                    status={UIStatus.SUCCESS}
                    onNotificationSelected={() => {}}
                />
                <ProfileMenuButton
                    navbarState={navbarState}
                    onUserOptionSelect={onUserOptionSelect}
                    goToLogin={goToLogin}
                />
            </ListItem>
        </List>
        <Divider/>
    </Sheet>
}

export default KepoNavbar