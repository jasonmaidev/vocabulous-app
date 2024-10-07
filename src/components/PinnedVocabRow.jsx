import { useSelector } from "react-redux"
import { useState, forwardRef, lazy, Suspense } from "react"
import { Menu, MenuItem, Tooltip, ListItemIcon, ListItemText, Stack, Dialog, Grow, IconButton, Typography, useTheme, useMediaQuery } from "@mui/material"
import { IoMdMore } from "react-icons/io";
import { TbPin, TbTrashX } from "react-icons/tb";
import { PiCircleBold, PiDiamondBold, PiStarBold } from "react-icons/pi";
import RowBox from "./RowBox";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import GridLoader from "react-spinners/GridLoader"
import apiUrl from "config/api"
const ViewVocabDialog = lazy(() => import("./ViewVocabDialog"))


const Transition = forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />
})

const PinnedVocabRow = ({ id, text, pinyin, label, difficulty, definition, similar, expression, sentence, pinned }) => {
  const isQHDScreens = useMediaQuery("(min-width:2500px) and (max-height:1600px)") // 2K Laptops
  const isWideScreens = useMediaQuery("(min-width:3400px) and (max-height:1500px)") // Wide and Ultrawide Desktops
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  const mode = useSelector((state) => state.mode)
  const token = useSelector((state) => state.token)

  const theme = useTheme()
  const queryClient = useQueryClient()

  const [viewVocab, setViewVocab] = useState(false)
  const [viewUsage, setViewUsage] = useState(false)

  /* View Vocab Dialog State */
  const [uploadOpen, setUploadOpen] = useState(false)
  const handleViewOpen = () => {
    setUploadOpen(true)
    setViewVocab(true)
  }
  const handleViewClose = () => {
    setUploadOpen(false)
  }

  function HighlightCaps({ text }) {
    const theme = useTheme();
    const mode = useSelector((state) => state.mode);

    // Function to process the string
    const processText = (text) => {
      // Regular expression to match consecutive 2 or more uppercase letters or characters inside parentheses (including the parentheses)
      const regex = /[A-Z]{2,}|\(.*?\)/g;

      // Split the text based on the match
      const parts = text.split(regex);

      // Find the matches (consecutive capital letters and text inside parentheses)
      const matches = text.match(regex);

      // If no matches found, return the original text
      if (!matches) {
        return text;
      }

      return parts.reduce((acc, part, index) => {
        acc.push(<span key={`part-${index}`}>{part}</span>); // Add normal text
        if (matches[index]) {
          // If there's a match at this index, add it with the highlighted color
          acc.push(
            <span key={`match-${index}`}
              style={{ color: mode === "light" ? theme.palette.neutral.darker : theme.palette.primary.dark, fontWeight: mode === "light" ? 500 : 400 }}
            >
              {matches[index]}
            </span>
          );
        }
        return acc;
      }, []);
    };

    return <div>{processText(text)}</div>;
  }

  /* Options Drowndown Menu */
  const [highlightRow, setHighlightRow] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState(null)
  const openMenu = Boolean(menuAnchor)
  const handleMenuClick = (event) => {
    setHighlightRow(true)
    setMenuAnchor(event.currentTarget)
  }
  const handleMenuClose = () => {
    setHighlightRow(false)
    setMenuAnchor(null)
  }

  const handleUpdatePinned = (updatedData) => {
    updatePinnedMutation.mutate(updatedData)
  }

  const updatePinnedMutation = useMutation({
    mutationFn: async () => {
      const updatedData = {
        pinned: !pinned
      }
      return await fetch(`${apiUrl}/vocabs/${id}/update`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
    },
    onError: (error, context) => {
      console.log("Error fetching:" + context.id + error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["pinnedVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["intVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["advVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["searchVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["labeledVocabsData"] })
      setMenuAnchor(null)
      setHighlightRow(false)
    }
  })

  const handleSetBeg = (updatedData) => {
    setBegMutation.mutate(updatedData)
  }

  const setBegMutation = useMutation({
    mutationFn: async () => {
      const updatedData = {
        difficulty: "2"
      }
      return await fetch(`${apiUrl}/vocabs/${id}/update`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
    },
    onError: (error, context) => {
      console.log("Error fetching:" + context.id + error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["pinnedVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["intVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["advVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["searchVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["labeledVocabsData"] })
    }
  })

  const handleSetInt = (updatedData) => {
    setIntMutation.mutate(updatedData)
  }

  const setIntMutation = useMutation({
    mutationFn: async () => {
      const updatedData = {
        difficulty: "2"
      }
      return await fetch(`${apiUrl}/vocabs/${id}/update`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
    },
    onError: (error, context) => {
      console.log("Error fetching:" + context.id + error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["pinnedVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["intVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["advVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["searchVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["labeledVocabsData"] })
    }
  })

  const handleSetAdv = (updatedData) => {
    setAdvMutation.mutate(updatedData)
  }

  const setAdvMutation = useMutation({
    mutationFn: async () => {
      const updatedData = {
        difficulty: "3"
      }
      return await fetch(`${apiUrl}/vocabs/${id}/update`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
    },
    onError: (error, context) => {
      console.log("Error fetching:" + context.id + error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["pinnedVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["intVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["advVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["searchVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["labeledVocabsData"] })
    }
  })

  const handleDeleteVocab = (id) => {
    deleteMutation.mutate(id)
  }

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await fetch(`${apiUrl}/vocabs/${id}/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
    },
    onError: (error, context) => {
      console.log("Error fetching:" + context.id + error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["pinnedVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["intVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["advVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["searchVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["labeledVocabsData"] })
    }
  })

  return (
    <>
      {isLandscape ? (
        <Stack direction={"row"}>
          <RowBox
            display="flex"
            flexDirection="row"
            onClick={handleViewOpen}
            gap={1}
            sx={{
              cursor: "pointer",
              borderRadius: "0.5rem",
              padding: "0.125rem 1rem",
              backgroundImage: highlightRow ? `linear-gradient(to right, rgba(197, 197, 217, 0.05),  rgba(197, 197, 217, 0.03))` : "none",
              "&:hover": {
                backgroundImage: highlightRow ? `linear-gradient(to right, rgba(197, 197, 217, 0.05),  rgba(197, 197, 217, 0.03))` : "none",
              }
            }}
          >
            <Stack direction="column" spacing={0} pt={0.5} pb={0.5} onClick={handleViewOpen}>
              <Stack direction="row" alignItems={"flex-end"} spacing={1}>
                <Typography
                  color={(difficulty === "1" && mode === "light") ? "#00c4b7" :
                    (difficulty === "2" && mode === "light") ? "#d97706" :
                      difficulty === "1" ? "#03f1c7" :
                        difficulty === "2" ? "#fbbf24" :
                          "#ff589e"}
                  fontSize={isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.5rem"}
                  lineHeight={1.1}
                >
                  {text}
                </Typography>
                <Typography
                  fontSize={isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem"}
                  color={theme.palette.neutral.medium}
                  fontStyle={"italic"} lineHeight={1.1}
                >
                  {pinyin}
                </Typography>
              </Stack>
              <Typography fontSize={isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem"}>
                <HighlightCaps text={definition} />
              </Typography>
            </Stack>

          </RowBox>
          <Tooltip title="Quick Edit" placement="right">
            <IconButton zindex={10} onClick={handleMenuClick} sx={{ opacity: 0.3 }}>
              <IoMdMore size={24} style={{ margin: "0 0.75rem" }} />
            </IconButton>
          </Tooltip>
        </Stack>
      ) :
        /* Mobile */
        (
          <Stack direction={"row"}>
            <RowBox
              onClick={handleViewOpen}
              display="flex"
              flexDirection="row"
              gap={1}
              sx={{
                cursor: "pointer",
                borderRadius: "0.5rem",
                padding: "0.25rem",
                backgroundImage: highlightRow ? `linear-gradient(to right, rgba(197, 197, 217, 0.05),  rgba(197, 197, 217, 0.03))` : "none",
                "&:hover": {
                  backgroundImage: highlightRow ? `linear-gradient(to right, rgba(197, 197, 217, 0.05),  rgba(197, 197, 217, 0.03))` : "none",
                }
              }}
            >
              <Stack direction="column" spacing={0}>
                <Stack direction="row" alignItems={"flex-end"} spacing={0.5}>
                  <Typography
                    onClick={handleViewOpen}
                    sx={{ lineHeight: 1.1 }}
                    fontSize="1.3rem"
                    color={(difficulty === "1" && mode === "light") ? "#00c4b7" :
                      (difficulty === "2" && mode === "light") ? "#d97706" :
                        difficulty === "1" ? "#03f1c7" :
                          difficulty === "2" ? "#fbbf24" :
                            "#ff589e"}
                  >
                    {text}
                  </Typography>
                  <Typography
                    onClick={handleViewOpen}
                    sx={{ lineHeight: 1.1, fontSize: "0.8rem", fontStyle: "italic" }}
                    color={theme.palette.neutral.medium}>
                    {pinyin}
                  </Typography>
                </Stack>

                <Typography onClick={handleViewOpen} sx={{ lineHeight: 1.1 }} fontSize="1rem">
                  <HighlightCaps text={definition} />
                </Typography>
              </Stack>

            </RowBox>
            <IconButton zindex={10} onClick={handleMenuClick} sx={{ opacity: 0.3 }}>
              <IoMdMore />
            </IconButton>
          </Stack>
        )}

      {/* ----- Popup View Vocab Dialog ----- */}
      <Dialog
        open={uploadOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleViewClose}
        aria-describedby="alert-dialog-grow-description"
        sx={{
          "& .MuiDialog-paper": {
            width: isLandscape ? "20%" : "100%",
            borderRadius: "1rem",
            display: "flex",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
            backgroundColor: mode === "light" ? "rgba(255, 255, 255, 1)" : "rgba(0, 11, 13, 0.3)", // Semi-transparent background
            backgroundImage: `linear-gradient(
              to top left, 
              rgba(255, 255, 255, 0.15), 
              rgba(255, 255, 255, 0.05)
            )`, // Gradient overlay
            backdropFilter: "blur(6px)", // Apply the glass effect
            WebkitBackdropFilter: "blur(6px)", // For Safari support
            border: "1px solid rgba(255, 255, 255, 0.2)"
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 11, 13, 0.7)", // Custom backdrop color
            },
          },
        }}
      >
        <Suspense fallback={
          <GridLoader
            color={theme.palette.neutral.light}
            loading={true}
            size={50}
            margin={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        }>
          <ViewVocabDialog
            viewVocab={viewVocab}
            viewUsage={viewUsage}
            setViewVocab={setViewVocab}
            setViewUsage={setViewUsage}
            handleViewClose={handleViewClose}
            id={id}
            text={text}
            pinyinText={pinyin}
            label={label}
            difficulty={difficulty}
            definition={definition}
            similar={similar}
            expression={expression}
            sentence={sentence}
            pinned={pinned}
          />
        </Suspense>
      </Dialog>
      <Menu
        id="basic-menu"
        anchorEl={menuAnchor}
        open={openMenu}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
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
            boxShadow: mode === "light" ? "0px 4px 12px rgba(197, 197, 217, 0.4)" : "0px 4px 12px rgba(0, 11, 13, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.2)", // Optional border for frosted effect
          },
        }}
      >
        <MenuItem onClick={handleUpdatePinned}>
          <ListItemIcon><TbPin fontSize="large" color={theme.palette.neutral.darker} /></ListItemIcon>
          <ListItemText sx={{ color: theme.palette.neutral.darker }}>{pinned ? "Unpin" : "Pin"}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSetBeg}>
          <ListItemIcon><PiCircleBold fontSize="large" color={theme.palette.neutral.darker} /></ListItemIcon>
          <ListItemText sx={{ color: theme.palette.neutral.darker }}>Set Lv. 1</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSetInt}>
          <ListItemIcon><PiDiamondBold fontSize="large" color={theme.palette.neutral.darker} /></ListItemIcon>
          <ListItemText sx={{ color: theme.palette.neutral.darker }}>Set Lv. 2</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSetAdv}>
          <ListItemIcon><PiStarBold fontSize="large" color={theme.palette.neutral.darker} /></ListItemIcon>
          <ListItemText sx={{ color: theme.palette.neutral.darker }}>Set Lv. 3</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteVocab}>
          <ListItemIcon><TbTrashX fontSize="large" color={theme.palette.neutral.darker} /></ListItemIcon>
          <ListItemText sx={{ color: theme.palette.neutral.darker }}>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

export default PinnedVocabRow