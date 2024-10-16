import "../../styles/gradient-button.min.css"
import { v4 as uuidv4 } from "uuid"
import _ from 'lodash';
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { IoClose } from "react-icons/io5"
import { FaUserAlt } from "react-icons/fa"
import { TbLogout } from "react-icons/tb"
import { CgMenuGridO } from "react-icons/cg"
import { IoSearchSharp, IoMenu } from "react-icons/io5";
import {
  Box,
  Stack,
  InputBase,
  IconButton,
  InputAdornment,
  Typography,
  MenuItem,
  useTheme,
  useMediaQuery,
  Button,
  Tooltip,
  ListItemIcon,
  ListItemText,
  Menu,
} from "@mui/material"
import { DarkMode, LightMode } from "@mui/icons-material"
import { setMode, setLogout, setViewBySearchTerm, setOpenLabelsDrawer } from "state"
import FlexBetweenBox from "components/FlexBetweenBox"
import UserImage from "components/UserImage"
import AddVocabDialog from "components/AddVocabDialog";

const Navbar = ({
  searchRef
}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { _id, picturePath } = useSelector((state) => state.user)
  const isNonMobileScreens = useMediaQuery("(min-width:1000px) and (max-height:2160px)")
  const theme = useTheme()
  const mode = useSelector((state) => state.mode)
  const neutralLight = theme.palette.neutral.light
  const dark = theme.palette.neutral.dark
  const background = theme.palette.background.default
  const alt = theme.palette.background.alt

  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;

  const viewByLabel = useSelector((state) => state.viewByLabel)

  const openLabelsDrawer = useSelector((state) => state.openLabelsDrawer)

  const [searchTerm, setSearchTerm] = useState("")

  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false)

  const navigateHome = () => {
    navigate(`/loading/${_id}`)
    setTimeout(() => {
      navigate(`/`)
    }, 200);
    if (isPortrait) {
      dispatch(setOpenLabelsDrawer({ openLabelsDrawer: false }))
    }
  }

  const goToSearch = () => {
    navigate(`/search/${_id}`)
  }

  const handleLogout = () => {
    navigate(`/`)
    dispatch(setLogout())
  }

  const toggleLabelsDrawer = () => {
    dispatch(setOpenLabelsDrawer({ openLabelsDrawer: !openLabelsDrawer }))
  }

  const handleSearch = _.debounce((searchText) => {
    dispatch(setViewBySearchTerm({ viewBySearchTerm: searchText }))
  }, 400);  // 400ms delay

  /* Options Drowndown Menu */
  const [menuAnchor, setMenuAnchor] = useState(null)
  const openMenu = Boolean(menuAnchor)
  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget)
  }
  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const [highlightSearch, setHighlightSearch] = useState(false)

  return (
    <FlexBetweenBox
      backgroundColor={alt}
      width="100%"
      position="sticky"
      top="0"
      zIndex={theme.zIndex.drawer + 1}
      sx={{ boxShadow: "6px 6px 12px rgba(0,0,0, 0.05)" }}
    >
      <Stack direction="row" spacing={isLandscape ? 12 : 1}
        alignItems="center"
      >
        {isLandscape ? (
          <Stack sx={{ cursor: "pointer" }} direction={"row"} spacing={2} alignItems={"center"} pl={1}>
            <IoMenu
              onClick={toggleLabelsDrawer}
              size={24}
              color={theme.palette.neutral.darker}
            />
            {viewByLabel?.length > 0 ?
              <Typography fontSize={"1.25rem"} fontWeight={700} color={theme.palette.neutral.darker}>
                {viewByLabel}
              </Typography>
              :
              (
                <Stack onClick={navigateHome} alignItems={"center"} direction="row" spacing={1} p={1} >
                  {/* ----- App Slogan ----- */}
                  <img
                    style={{ objectFit: "cover", width: isLandscape ? "2rem" : "20%" }}
                    alt="user"
                    src={`https://res.cloudinary.com/dngvjrd0n/image/upload/v1725936257/portfolio/voca-logo-${mode}.png`}
                  />
                  <Typography fontSize={"1.25rem"} fontWeight={700} color={theme.palette.neutral.darker}>
                    金字卡
                  </Typography>
                  <Typography fontSize={"1.25rem"} fontWeight={700} color={theme.palette.primary.main}>
                    Ai
                  </Typography>
                </Stack>
              )
            }
          </Stack>
        ) : (
          <Stack sx={{ cursor: "pointer" }} direction={"row"} spacing={1} alignItems={"center"} pl={1}>
            <img
              onClick={toggleLabelsDrawer}
              style={{ objectFit: "cover", width: "10%" }}
              alt="user"
              src={`https://res.cloudinary.com/dngvjrd0n/image/upload/v1725936257/portfolio/voca-logo-${mode}.png`}
            />
            {viewByLabel?.length > 0 ?
              <Typography fontSize={"1.25rem"} fontWeight={700} color={theme.palette.neutral.darker}>
                {viewByLabel}
              </Typography>
              :
              (
                <>
                  <Typography onClick={navigateHome} fontSize={"1.25rem"} fontWeight={700} color={theme.palette.neutral.darker}>
                    金字卡
                  </Typography>
                  <Typography fontSize={"1.25rem"} fontWeight={700} color={theme.palette.primary.main}>
                    Ai
                  </Typography>
                </>
              )
            }
          </Stack>
        )
        }
        <Stack>
          <InputBase
            onMouseOver={() => setHighlightSearch(true)}
            onMouseLeave={() => setHighlightSearch(false)}
            onClick={goToSearch}
            id={uuidv4()}
            placeholder="Search"
            inputRef={searchRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={(e) => handleSearch(e.target.value)}
            onPaste={(e) => {
              // Get the pasted value from the clipboard
              const pastedValue = e.clipboardData.getData('text');
              handleSearch(pastedValue); // Call handleSearch with the pasted value
            }}
            startAdornment={
              <InputAdornment position="start">
                <IoSearchSharp size={searchRef?.current?.focus ? 20 : 24}
                  color={mode === "light" ? theme.palette.neutral.dark : theme.palette.neutral.mid}
                />
              </InputAdornment>
            }
            required={true}
            sx={isNonMobileScreens ? {
              borderRadius: "1rem",
              padding: "0.5rem 1rem",
              border: searchRef?.current?.focus ? `3px solid ${theme.palette.primary.main}` : `1px solid ${neutralLight}`,
              width: "100%",
              marginLeft: '1rem',
              backgroundColor: highlightSearch ? "rgba(197, 197, 217, 0.1)" : undefined,
            } : {
              width: "100%",
              padding: "0 0.5rem",
              border: searchRef?.current?.focus ? `3px solid ${theme.palette.primary.main}` : undefined,
              borderRadius: "2rem",
              margin: "0",
              backgroundColor: highlightSearch ? "rgba(197, 197, 217, 0.1)" : undefined,
            }}
          />
        </Stack>
      </Stack>

      {/* ----- Desktop NavBar Buttons ----- */}
      {isNonMobileScreens ? (
        <FlexBetweenBox gap="2rem">

          <AddVocabDialog />

          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode
                sx={{
                  color: theme.palette.neutral.dark,
                  borderRadius: "6rem",
                  "&:hover": {
                    color: theme.palette.primary.main,
                    backgroundColor: theme.palette.background.alt,
                  }
                }}
              />
            ) : (
              <LightMode
                sx={{
                  color: theme.palette.neutral.dark,
                  borderRadius: "6rem",
                  "&:hover": {
                    color: theme.palette.primary.main,
                    backgroundColor: theme.palette.background.alt,
                  }
                }}
              />
            )}
          </IconButton>

          <Tooltip title="Account">
            <IconButton
              id="basic-IconButton"
              onClick={handleMenuClick}
              sx={{ padding: "4px", margin: 0 }}
            >
              <UserImage userId={_id} image={picturePath} />
            </IconButton>
          </Tooltip>
        </FlexBetweenBox>
      ) : (
        // sets mobile menu icon
        <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
          <CgMenuGridO color={theme.palette.neutral.dark} />
        </IconButton>
      )}

      <Menu
        id="basic-menu"
        anchorEl={menuAnchor}
        open={openMenu}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: mode === "light" ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 11, 13, 0.3)", // Semi-transparent background
            backgroundImage: `linear-gradient(
              to bottom right, 
              rgba(255, 255, 255, 0.15), 
              rgba(255, 255, 255, 0.05)
            )`, // Gradient overlay for the glassmorphism effect
            backdropFilter: "blur(6px)", // Apply the blur effect
            WebkitBackdropFilter: "blur(6px)", // Safari support for blur effect
            borderRadius: "1rem",
            boxShadow: mode === "light" ? "0px 4px 12px rgba(155, 155, 171, 0.4)" : "0px 4px 12px rgba(0, 11, 13, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.2)", // Optional border for frosted effect
          },
        }}
      >
        <MenuItem onClick={navigateHome}>
          <ListItemIcon><FaUserAlt fontSize="small" color={theme.palette.neutral.dark} /></ListItemIcon>
          <ListItemText sx={{ color: theme.palette.neutral.dark }}>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><TbLogout fontSize="large" color={theme.palette.neutral.dark} /></ListItemIcon>
          <ListItemText sx={{ color: theme.palette.neutral.dark }}>Logout</ListItemText>
        </MenuItem>
      </Menu>

      {/* ----- Mobile Nav ----- */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* ----- Close icon ----- */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <IoClose />
            </IconButton>
          </Box>

          {/* ----- Menu items ----- */}
          <FlexBetweenBox
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="2rem"
          >
            {/* ----- Dark / Light Icons ----- */}
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>

            <Button
              onClick={navigateHome}
              startIcon={<FaUserAlt />}
              sx={{
                color: theme.palette.neutral.dark,
                borderRadius: "6rem",
                textTransform: "none",
                fontWeight: 700,
                "&:hover": {
                  color: theme.palette.primary.main,
                  backgroundColor: theme.palette.background.default,
                }
              }}
            >
              Profile
            </Button>
            <Button
              onClick={() => dispatch(setLogout())}
              startIcon={<TbLogout />}
              sx={{
                color: theme.palette.neutral.dark,
                borderRadius: "6rem",
                textTransform: "none",
                fontWeight: 700,
                "&:hover": {
                  color: theme.palette.primary.main,
                  backgroundColor: theme.palette.background.default,
                }
              }}
            >
              Logout
            </Button>

          </FlexBetweenBox>
        </Box>
      )}
    </FlexBetweenBox>
  )
}

export default Navbar