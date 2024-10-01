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

  const viewByLabel = useSelector((state) => state.viewByLabel)

  const openLabelsDrawer = useSelector((state) => state.openLabelsDrawer)

  const [searchTerm, setSearchTerm] = useState("")

  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false)

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
    console.log(searchText)
  }, 300);  // 300ms delay

  /* Options Drowndown Menu */
  const [menuAnchor, setMenuAnchor] = useState(null)
  const openMenu = Boolean(menuAnchor)
  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget)
  }
  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

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
            />
            {viewByLabel?.length > 0 ?
              <Typography fontSize={"1.25rem"} fontWeight={700} color={theme.palette.neutral.darker}>
                {viewByLabel}
              </Typography>
              :
              (
                <Stack onClick={() => navigate("/")} alignItems={"center"} direction="row" spacing={1} p={1} >
                  {/* ----- App Slogan ----- */}
                  <img
                    style={{ objectFit: "cover", width: isLandscape ? "2rem" : "20%" }}
                    alt="user"
                    src={`https://res.cloudinary.com/dngvjrd0n/image/upload/v1725936257/portfolio/voca-logo-${mode}.png`}
                  />
                  <Typography fontSize={"1.25rem"} fontWeight={700} color={theme.palette.neutral.darker}>
                    金字卡
                  </Typography>
                  <Typography fontSize={"1rem"} fontWeight={700} color={theme.palette.primary.main}>
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
                  <Typography onClick={() => navigate("/")} fontSize={"1.25rem"} fontWeight={700} color={theme.palette.neutral.darker}>
                    金字卡
                  </Typography>
                  <Typography fontSize={"1rem"} fontWeight={700} color={theme.palette.primary.main}>
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
            onClick={goToSearch}
            id={uuidv4()}
            placeholder="Search"
            inputRef={searchRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={(e) => handleSearch(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <IoSearchSharp size={24} />
              </InputAdornment>
            }
            required={true}
            sx={isNonMobileScreens ? {
              borderRadius: "1rem",
              padding: "0.5rem 1rem",
              border: `1px solid ${neutralLight}`,
              width: "100%",
              marginLeft: '1rem',
            } : {
              width: "100%",
              borderRadius: "1rem",
              margin: "0",
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
      >
        <MenuItem onClick={() => navigate(`/`)}>
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
              onClick={() => navigate(`/`)}
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