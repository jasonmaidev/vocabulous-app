import { useState, forwardRef } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { setViewByLabel, setOpenLabelsDrawer } from "state"
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Box,
  Grow,
  Dialog,
  List,
  ListItem,
  ListItemButton,
  IconButton,
  useTheme,
  useMediaQuery,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import PerfectScrollbar from "react-perfect-scrollbar"
import Drawer from '@mui/material/Drawer';
import { BiHomeAlt2 } from "react-icons/bi";
import { IoLanguage } from "react-icons/io5";
import { MdLabelOutline, MdClose } from "react-icons/md";
import { BsArrowRightSquareFill } from "react-icons/bs";
import { FiEdit3 } from "react-icons/fi";
import { styled } from "@mui/system";
import EditLabelsWidget from 'views/widgets/EditLabelsWidget';
import apiUrl from "config/api"

const Transition = forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />
})

const EditLabelsDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "0.3rem",
    display: "flex",
  },
}))

export default function LabelsDrawer() {
  const isQHDScreens = useMediaQuery("(min-width:2500px) and (max-height:1600px)") // 2K Laptops
  const isWideScreens = useMediaQuery("(min-width:3400px) and (max-height:1500px)") // Wide and Ultrawide Desktops

  const openLabelsDrawer = useSelector((state) => state.openLabelsDrawer)
  const token = useSelector((state) => state.token)
  const { _id } = useSelector((state) => state.user)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const theme = useTheme()

  const dispatch = useDispatch()
  const mode = useSelector((state) => state.mode)

  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;

  const toggleLabelsDrawer = () => {
    dispatch(setOpenLabelsDrawer({ openLabelsDrawer: !openLabelsDrawer }))
  }

  const viewLabledVocabs = (text) => {
    dispatch(setViewByLabel({ viewByLabel: text }))
    queryClient.invalidateQueries({ queryKey: ["labeledVocabsData"] })
    navigate(`/label/${_id}`)
    if (isPortrait) {
      // toggleLabelsDrawer()
      dispatch(setOpenLabelsDrawer({ openLabelsDrawer: false }))
    }
  }

  const navigateHome = () => {
    navigate(`/`)
    toggleLabelsDrawer()
  }

  const showAllVocabs = () => {
    navigate(`/all/${_id}`)
    toggleLabelsDrawer()
  }

  const getVocabLabels = () => {
    return fetch(`${apiUrl}/labels/${_id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
  }

  const { data } = useQuery(["vocabLabelsData"], getVocabLabels, {
    // keepPreviousData: true,
    staleTime: 300
  })

  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const capFirstLetter = (str) => {
    if (typeof str !== 'string' || str.length === 0) {
      return str; // Return the original string if it's empty or not a string
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const DrawerList = (
    <PerfectScrollbar component="div">
      <Box sx={{ width: isWideScreens ? 400 : isQHDScreens ? 300 : isPortrait ? 200 : 250, pt: isLandscape ? 10 : 8 }} role="presentation" onClick={navigateHome}>
        <List sx={{ margin: 0, padding: 0 }}>
          <ListItem disablePadding sx={{ margin: 0, padding: 0 }}>
            <ListItemButton
              sx={{
                borderTopRightRadius: '6rem',
                borderBottomRightRadius: '6rem',
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                },
              }}
            >
              <ListItemIcon>
                <BiHomeAlt2 size={24} />
              </ListItemIcon>
              <ListItemText
                primary={"Home"}
                primaryTypographyProps={{ fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.1rem" : undefined }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Box sx={{ width: isWideScreens ? 400 : isQHDScreens ? 300 : 250 }} role="presentation" onClick={showAllVocabs}>
        <List sx={{ margin: 0, padding: 0 }}>
          <ListItem disablePadding sx={{ margin: 0, padding: 0 }}>
            <ListItemButton
              sx={{
                borderTopRightRadius: '6rem',
                borderBottomRightRadius: '6rem',
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                },
              }}
            >
              <ListItemIcon>
                <IoLanguage size={24} />
              </ListItemIcon>
              <ListItemText primary={"All"}
                primaryTypographyProps={{ fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.1rem" : undefined }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <Box sx={{ width: isWideScreens ? 400 : isQHDScreens ? 300 : 250 }} role="presentation">
        <List sx={{ margin: 0, padding: 0 }}>
          {data?.[0].label.sort().map((text, index) => (
            <ListItem
              key={text}
              disablePadding
              sx={{ margin: 0, padding: 0 }}
              onClick={() => viewLabledVocabs(text)}
            >
              <ListItemButton
                sx={{
                  borderTopRightRadius: '6rem',
                  borderBottomRightRadius: '6rem',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                  },
                }}
              >
                <ListItemIcon>
                  <MdLabelOutline size={24} />
                </ListItemIcon>
                <ListItemText
                  primary={capFirstLetter(text)}
                  primaryTypographyProps={{ fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.1rem" : undefined }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      {/* <Divider /> */}
      <Box sx={{ width: isWideScreens ? 400 : isQHDScreens ? 300 : 250 }} role="presentation" onClick={() => handleEditLabelsOpen()}>
        <List sx={{ margin: 0, padding: 0 }}>
          <ListItem disablePadding sx={{ margin: 0, padding: 0 }}>
            <ListItemButton
              sx={{
                borderTopRightRadius: '6rem',
                borderBottomRightRadius: '6rem',
                '&:hover': {
                  color: mode === "dark" ? theme.palette.neutral.lighter : theme.palette.neutral.darker,
                  backgroundColor: theme.palette.tertiary.main,
                },
              }}
            >
              <ListItemIcon>
                <FiEdit3 size={24} />
              </ListItemIcon>
              <ListItemText
                primary={"Edit Labels"}
                primaryTypographyProps={{ fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.1rem" : undefined }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

    </PerfectScrollbar>
  );

  const MobileDrawerList = (
    <>
      <Box sx={{ width: isWideScreens ? 400 : isQHDScreens ? 300 : isPortrait ? 200 : 250, pt: isLandscape ? 10 : 8 }} role="presentation" onClick={navigateHome}>
        {isPortrait && (
          <IconButton onClick={toggleLabelsDrawer} sx={{ position: "relative", top: 5, left: "98%", p: 0 }}>
            <MdClose size={24} color={theme.palette.primary.main}
            />
          </IconButton>
        )}
        <List sx={{ margin: 0, padding: 0 }}>
          <ListItem disablePadding sx={{ margin: 0, padding: 0 }}>
            <ListItemButton
              sx={{
                borderTopRightRadius: '6rem',
                borderBottomRightRadius: '6rem',
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                },
              }}
            >
              <ListItemIcon>
                <BiHomeAlt2 size={24} />
              </ListItemIcon>
              <ListItemText
                primary={"Home"}
                primaryTypographyProps={{ fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.1rem" : undefined }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Box sx={{ width: isWideScreens ? 400 : isQHDScreens ? 300 : 250 }} role="presentation" onClick={showAllVocabs}>
        <List sx={{ margin: 0, padding: 0 }}>
          <ListItem disablePadding sx={{ margin: 0, padding: 0 }}>
            <ListItemButton
              sx={{
                borderTopRightRadius: '6rem',
                borderBottomRightRadius: '6rem',
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                },
              }}
            >
              <ListItemIcon>
                <IoLanguage size={24} />
              </ListItemIcon>
              <ListItemText primary={"All"}
                primaryTypographyProps={{ fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.1rem" : undefined }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <Box sx={{ width: isWideScreens ? 400 : isQHDScreens ? 300 : 250 }} role="presentation">
        <List sx={{ margin: 0, padding: 0 }}>
          {data?.[0].label.sort().map((text, index) => (
            <ListItem
              key={text}
              disablePadding
              sx={{ margin: 0, padding: 0 }}
              onClick={() => viewLabledVocabs(text)}
            >
              <ListItemButton
                sx={{
                  borderTopRightRadius: '6rem',
                  borderBottomRightRadius: '6rem',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                  },
                }}
              >
                <ListItemIcon>
                  <MdLabelOutline size={24} />
                </ListItemIcon>
                <ListItemText
                  primary={capFirstLetter(text)}
                  primaryTypographyProps={{ fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.1rem" : undefined }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      {/* <Divider /> */}
      <Box sx={{ width: isWideScreens ? 400 : isQHDScreens ? 300 : 250 }} role="presentation" onClick={() => handleEditLabelsOpen()}>
        <List sx={{ margin: 0, padding: 0 }}>
          <ListItem disablePadding sx={{ margin: 0, padding: 0 }}>
            <ListItemButton
              sx={{
                borderTopRightRadius: '6rem',
                borderBottomRightRadius: '6rem',
                '&:hover': {
                  color: mode === "dark" ? theme.palette.neutral.lighter : theme.palette.neutral.darker,
                  backgroundColor: theme.palette.tertiary.main,
                },
              }}
            >
              <ListItemIcon>
                <FiEdit3 size={24} />
              </ListItemIcon>
              <ListItemText
                primary={"Edit Labels"}
                primaryTypographyProps={{ fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.1rem" : undefined }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </>
  );

  /* Edit Labels Popup Dialog State */
  const [editLabelsOpen, setEditLabelsOpen] = useState(false)
  const handleEditLabelsOpen = () => {
    setEditLabelsOpen(true)
  }
  const handleEditLabelsClose = () => {
    setEditLabelsOpen(false)
  }

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      borderRadius: '1rem',
      padding: '0.75rem 0.75rem 0 0.75rem',
    }}>
      {isLandscape && (
        <Box
          onMouseOver={isLandscape ? () => setTimeout(() => { toggleLabelsDrawer() }, 200) : null}
          p={0}
        >
          <BsArrowRightSquareFill
            size={36}
            color={theme.palette.primary.main}
          />
        </Box>
      )}
      <Drawer
        variant="persistent"
        anchor="left"
        transitionDuration={{ start: 50, enter: 150, exit: 300 }}
        open={openLabelsDrawer}
        onMouseLeave={() => setTimeout(() => { toggleLabelsDrawer() }, 300)}
        onClose={toggleDrawer(false)}
        ModalProps={{
          keepMounted: true, // Improves performance when the drawer is open
          disablePortal: true, // Ensures the Drawer stays within its current container
          disableEnforceFocus: true, // Allows interaction with background elements
          disableRestoreFocus: true, // Prevents Drawer from refocusing elements on close
        }}
        hideBackdrop={true}
        sx={{
          width: isWideScreens ? 400 : isQHDScreens ? 320 : isPortrait ? 260 : 280,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isWideScreens ? 400 : isQHDScreens ? 320 : isPortrait ? 260 : 280,
            border: "none",
          },
        }}
      >
        {isLandscape ? DrawerList : MobileDrawerList}
      </Drawer>
      <EditLabelsDialog
        open={editLabelsOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleEditLabelsClose}
        aria-describedby="alert-dialog-grow-description"
        sx={{
          "& .MuiDialog-paper": {
            width: isLandscape ? "20%" : "100%",
            borderRadius: "0.4rem",
            display: "flex",
            backgroundColor: mode === "light" ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 11, 13, 0.2)",
            backgroundImage: `linear-gradient(
                to top left, 
                rgba(255, 255, 255, 0.15), 
                rgba(255, 255, 255, 0.05)
              )`,
            backdropFilter: "blur(10px)", // Apply the glass effect
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          },
          "& .MuiDialog-paperElevation24": {
            boxShadow: "none", // Remove elevation shadows
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 11, 13, 0.5)", // Custom backdrop color
            },
          },
        }}
      >
        <EditLabelsWidget data={data?.[0].label} id={data?.[0]._id} handleEditLabelsClose={handleEditLabelsClose} />
      </EditLabelsDialog>
    </Box>
  );
}
