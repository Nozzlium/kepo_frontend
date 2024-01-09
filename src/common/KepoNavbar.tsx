import { Box, Divider, List, ListItem, ListItemButton, Dropdown, MenuButton, Menu, MenuItem, ListItemDecorator, Sheet, Badge } from "@mui/joy"
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
import notificationRequest from "../request/NotificationRequest"

interface NavbarState {
    user?: User,
    unread?: number,
    profileStatus: UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR | UIStatus.IDLE,
    notificationStatus: UIStatus.LOADING | UIStatus.SUCCESS | UIStatus.ERROR | UIStatus.IDLE,
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
    if (navbarState.profileStatus === UIStatus.LOADING) {
        return <Progress/>
    } else {
        if (navbarState.user) {
            return <Dropdown>
                <MenuButton
                    variant="plain"
                >
                    Halo, {navbarState.user.username}
                </MenuButton>
                <Menu
                    variant="plain">
                        <MenuItem onClick={() => onUserOptionSelect(1)}>
                            <ListItemDecorator>
                                <AccountBox/>
                            </ListItemDecorator>
                            Profil
                        </MenuItem>
                        <MenuItem onClick={() => onUserOptionSelect(2)}>
                            <ListItemDecorator>
                                <Logout/>
                            </ListItemDecorator>
                            Keluar
                        </MenuItem>
                </Menu>
            </Dropdown>
        } else {
            return <ListItemButton role="menuitem" onClick={() => goToLogin()}>
                Masuk
            </ListItemButton>
        }
    }
}

const NotificationMenuButton = (
    {
        show,
        loading,
        unread,
        onNotificationSelected
    } : {
        show? : boolean,
        loading?: boolean,
        unread?: number,
        onNotificationSelected: (notification: Notification) => void
    }
) => {
    if (show) {

        if (unread && unread > 0)
            return <Dropdown>
                <MenuButton
                    variant="plain"
                >
                    <Badge 
                        badgeContent={unread}
                        size="sm"
                    >
                        <Notifications/>
                    </Badge>
                </MenuButton>
                <Menu
                    className="notif-popup"
                >
                    <KepoNotificationList
                        miniView
                    />
                </Menu>
            </Dropdown>

        return <Dropdown>
            <MenuButton
                variant="plain"
            >
                <Notifications/>
            </MenuButton>
            <Menu
                className="notif-popup"
            >
                <KepoNotificationList
                    miniView
                />
            </Menu>
        </Dropdown>
    }

    if (loading) {
        return <Progress/>
    }

    return null
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
        profileStatus: UIStatus.LOADING,
        notificationStatus: UIStatus.LOADING
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
                setNavbarState(prev => {
                    const next = {...prev}
                    next.user = user
                    next.profileStatus = UIStatus.SUCCESS
                    return next
                })
            } catch (error) {
                if (signal?.aborted) {
                    return
                }

                switch (true) {
                    case error instanceof UnauthorizedError:
                        setNavbarState(prev => {
                            const next = {...prev}
                            next.profileStatus = UIStatus.IDLE
                            return next
                        })
                        break
                    case error instanceof KepoError:
                        setNavbarState(prev => {
                            const next = {...prev}
                            next.profileStatus = UIStatus.ERROR
                            next.error = error as KepoError
                            return next
                        })
                        break
                    default:
                        setNavbarState(prev => {
                            const next = {...prev}
                            next.profileStatus = UIStatus.ERROR
                            next.error = new KepoError()
                            return next
                        })
                        break
                }
            }
        })()
    }

    const loadUnreadNotifications = (
        signal?: AbortSignal
    ) => {
        (async () => {
            try {
                const unread = await notificationRequest.getTotalUnread(signal)
                setNavbarState(prev => {
                    const next = {...prev}
                    next.unread = unread
                    next.notificationStatus = UIStatus.SUCCESS
                    return next
                })
            } catch (error) {
                if (signal?.aborted) {
                    return
                }

                switch (true) {
                    case error instanceof UnauthorizedError:
                        setNavbarState(prev => {
                            const next = {...prev}
                            next.notificationStatus = UIStatus.IDLE
                            return next
                        })
                        break
                    case error instanceof KepoError:
                        setNavbarState(prev => {
                            const next = {...prev}
                            next.notificationStatus = UIStatus.ERROR
                            next.error = error as KepoError
                            return next
                        })
                        break
                    default:
                        setNavbarState(prev => {
                            const next = {...prev}
                            next.notificationStatus = UIStatus.ERROR
                            next.error = new KepoError()
                            return next
                        })
                        break
                }
            }
        })()
    }

    useEffect(() => {
        const controller = new AbortController()
        if (navbarState.profileStatus === UIStatus.LOADING) {
            loadUser(controller.signal)
        }

        if (navbarState.profileStatus === UIStatus.ERROR) {
            if (onError)
                onError(navbarState.error ?? new KepoError())
        }

        return () => {
            controller.abort()
        }
    }, [navbarState.profileStatus])

    useEffect(() => {
        const controller = new AbortController()
        if (navbarState.notificationStatus === UIStatus.LOADING) {
            loadUnreadNotifications(controller.signal)
        }

        return () => {
            controller.abort()
        }
    }, [navbarState.notificationStatus])

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
                    show={ (navbarState.user && navbarState.profileStatus === UIStatus.SUCCESS)}
                    loading={navbarState.notificationStatus == UIStatus.LOADING}
                    unread={navbarState.unread}
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