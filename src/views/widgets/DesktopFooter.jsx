import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { TfiMapAlt } from "react-icons/tfi"
import { MdKeyboardCommandKey, MdOutlineCreate, MdClose } from "react-icons/md";
import { Menu, MenuItem, ListItemIcon, ListItemText, Link, Paper, Box, useTheme, Typography, Button, useMediaQuery } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { setViewByLabel } from "state"
import FlexBetweenBox from "components/FlexBetweenBox"

const DesktopFooter = ({ isLogin }) => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px) and (max-height:2160px)")
  const navigate = useNavigate()
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const mode = useSelector((state) => state.mode)
  const theme = useTheme()

  const getRoadmap = () => {
    dispatch(setViewByLabel({ viewByLabel: "" }))
    navigate(`/roadmap`)
  }

  const [menuAnchor, setMenuAnchor] = useState(null)
  const openMenu = Boolean(menuAnchor)
  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget)
  }
  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  return (
    <Box>
      <Paper sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "0.5rem 1rem",
        background: "none",
        backgroundImage: "none",
        boxShadow: "none"
      }}
      // elevation={0}
      >
        <FlexBetweenBox>
          <Box display={"flex"} flexDirection={"row"} gap={4} alignItems={"center"}>
            {isNonMobileScreens && (
              <>
                <Typography fontSize={"0.75rem"} fontWeight={500} color={palette.neutral.medium}>© 2024 Voca Ai</Typography>
                {isLogin ? null : (
                  <>
                    <Button
                      onClick={getRoadmap}
                      startIcon={<TfiMapAlt />}
                      sx={{
                        color: isLogin ? palette.neutral.dark : palette.neutral.mid,
                        borderRadius: "6rem",
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": {
                          color: palette.primary.main,
                          backgroundColor: palette.background.default,
                        }
                      }}
                    >
                      Roadmap
                    </Button>
                    <Button
                      onClick={handleMenuClick}
                      startIcon={<MdKeyboardCommandKey />}
                      sx={{
                        color: isLogin ? palette.neutral.dark : palette.neutral.mid,
                        borderRadius: "6rem",
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": {
                          color: palette.primary.main,
                          backgroundColor: palette.background.default,
                        }
                      }}
                    >
                      Commands
                    </Button>
                  </>
                )}
              </>
            )}
          </Box>
          <Typography
            fontSize={"0.75rem"}
            fontWeight={600}
            color={isLogin ? palette.neutral.dark : palette.neutral.mid}
          >
            Developed with 💛 by
            <Link href="https://jasonmai.dev/" target="_blank" underline="none" pl={1}>
              JasonMai.dev
            </Link>
          </Typography>
        </FlexBetweenBox>
      </Paper>

      <Menu
        id="basic-menu"
        anchorEl={menuAnchor}
        open={openMenu}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: mode === "light" ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 11, 13, 0.3)", // Semi-transparent background
            backgroundImage: `linear-gradient(
              to bottom right, 
              rgba(255, 255, 255, 0.15), 
              rgba(255, 255, 255, 0.1)
            )`, // Gradient overlay f4r the glassmorphism effect
            backdropFilter: "blur(6px)", // Apply the blur effect
            WebkitBackdropFilter: "blur(6px)", // Safari support for blur effect
            borderRadius: "1rem",
            border: "1px solid rgba(255, 255, 255, 0.2)", // Optional border for frosted effect
          },
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><MdOutlineCreate fontSize="large" color={theme.palette.neutral.darker} /></ListItemIcon>
          <ListItemText sx={{ color: theme.palette.neutral.darker, fontWeight: mode === "light" ? 500 : 400 }}>
            Shift + Enter = Create Vocab
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><MdClose fontSize="large" color={theme.palette.neutral.darker} /></ListItemIcon>
          <ListItemText sx={{ color: theme.palette.neutral.darker, fontWeight: mode === "light" ? 500 : 400 }}>
            Esc or ` = Close Vocab View
          </ListItemText>
        </MenuItem>
      </Menu>

    </Box>
  )
}

export default DesktopFooter