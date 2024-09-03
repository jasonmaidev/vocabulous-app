import { Edit } from "@mui/icons-material"
import { v4 as uuidv4 } from "uuid"
import { Box, Typography, InputBase, useTheme, Button, IconButton, useMediaQuery } from "@mui/material"
import { useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Snackbar from "@mui/material/Snackbar"
import CloseIcon from "@mui/icons-material/Close"
import { IoClose } from "react-icons/io5"
import {
  setDailyAllowedResets,
  setDailyAllowedUploads,
  setDailyAllowedSaves,
  setDailyAllowedEdits,
  setDailyAllowedDeletes,
  setNextRefreshDate
} from "state"
import {
  dailyGuestAllowedResets,
  dailyGuestAllowedUploads,
  dailyGuestAllowedSaves,
  dailyGuestAllowedEdits,
  dailyGuestAllowedDeletes,
  dailyFriendAllowedUploads,
  dailyFriendAllowedSaves,
  dailyFriendAllowedEdits,
  dailyFriendAllowedDeletes
} from "config/userAccountCredits"
import Countdown from "react-countdown"
import apiUrl from "config/api"

const EditApparelWidget = ({ picturePath, name, apparelId, section, handleEditClose }) => {
  const isSmallMobileScreens = useMediaQuery("(max-width:800px) and (max-height:800px)")
  const isNonMobileScreens = useMediaQuery("(min-width:1000px) and (max-height:2160px)")
  const isHDScreens = useMediaQuery("(min-width:1280px) and (max-height:900px)")
  const dispatch = useDispatch()
  const { palette } = useTheme()
  const token = useSelector((state) => state.token)

  /* Guest User State */
  const guestUser = useSelector((state) => state.user.guestUser)
  const friendUser = useSelector((state) => state.user.friendUser)
  const dailyAllowedEdits = useSelector((state) => state.dailyAllowedEdits)
  const nextRefreshDate = useSelector((state) => state.nextRefreshDate)

  const refreshDailyActions = () => {
    if (guestUser === true) {
      dispatch(setDailyAllowedResets({ dailyAllowedResets: dailyGuestAllowedResets }))
      dispatch(setDailyAllowedUploads({ dailyAllowedUploads: dailyGuestAllowedUploads }))
      dispatch(setDailyAllowedSaves({ dailyAllowedSaves: dailyGuestAllowedSaves }))
      dispatch(setDailyAllowedEdits({ dailyAllowedEdits: dailyGuestAllowedEdits }))
      dispatch(setDailyAllowedDeletes({ dailyAllowedDeletes: dailyGuestAllowedDeletes }))
      dispatch(setNextRefreshDate({ nextRefreshDate: null }))
    } else if (friendUser === true) {
      dispatch(setDailyAllowedUploads({ dailyAllowedUploads: dailyFriendAllowedUploads }))
      dispatch(setDailyAllowedSaves({ dailyAllowedSaves: dailyFriendAllowedSaves }))
      dispatch(setDailyAllowedEdits({ dailyAllowedEdits: dailyFriendAllowedEdits }))
      dispatch(setDailyAllowedDeletes({ dailyAllowedDeletes: dailyFriendAllowedDeletes }))
      dispatch(setNextRefreshDate({ nextRefreshDate: null }))
    } else {
      return
    }
  }

  // Countdown renderer callback with condition
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      refreshDailyActions()
    } else {
      return (
        <span>
          {hours}:{minutes}:{seconds}
        </span>
      )
    }
  }

  // const [image, setImage] = useState(null)
  const [newApparelName, setNewApparelName] = useState("")
  const inputRef = useRef(null)

  const queryClient = useQueryClient()

  const handleUpdateApparel = (updatedData) => {
    if (!newApparelName) {
      return alert(`Please update apparel name.`)
    } else {
      updateMutation.mutate(updatedData)
    }
  }

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (newApparelName) {
        setNewApparelName(newApparelName)
      }
      const updatedData = {
        name: newApparelName ? newApparelName : name,
      }
      return await fetch(`${apiUrl}/apparels/${apparelId}/update/${guestUser}/${dailyAllowedEdits}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
    },
    onError: (error, _newApparelName, context) => {
      console.log("Error fetching:" + context.id + error)
    },
    onSettled: () => {
      queryClient.invalidateQueries(["sectionedApparelsData", section])
      handleOpen({ vertical: "top", horizontal: "center" })()
      setTimeout(() => handleEditClose(), 2500)
      dispatch(setDailyAllowedEdits({ dailyAllowedEdits: dailyAllowedEdits - 1 }))
      if (dailyAllowedEdits === 1 && !nextRefreshDate) {
        dispatch(setNextRefreshDate({ nextRefreshDate: Date.now() + 86400000 }))
      }
    }
  })

  /* Snackbar State */
  const [snackbar, setSnackbar] = useState({ open: false, })
  const { open } = snackbar
  const handleOpen = (newSnackbar) => () => {
    setSnackbar({ ...newSnackbar, open: true })
  }
  const handleClose = () => {
    setSnackbar({ ...snackbar, open: false })
  }
  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  )

  // Remove file extension from apparel name
  const displayName = name.replace(/\..*$/, "")

  return (
    <Box margin={isNonMobileScreens ? "0 2rem" : 0.5} padding={isNonMobileScreens ? 4 : 1}>

      {/* ----- Snackbar ----- */}
      <div>
        <Snackbar
          open={open}
          anchorOrigin={{ vertical: "top", horizontal: "center", }}
          autoHideDuration={2000}
          onClose={handleClose}
          message="Update Successful!"
          action={action}
        />
      </div>

      {!isNonMobileScreens && (
        <Box
          padding={"0.5rem 0.5rem 1rem 0.75rem"}
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant="h4" color={palette.neutral.dark} fontWeight={500}>Editting</Typography>
          <IconButton onClick={handleEditClose}>
            <IoClose color={palette.neutral.dark} />
          </IconButton>
        </Box>
      )}
      <Box pb={2} margin={isNonMobileScreens ? 1 : 0}>

        {/* ----- Text Input Field ----- */}
        <Box
          display={"flex"}
          alignItems={"center"}
          flexDirection={"row"}
          margin={"0 1rem"}
        >
          {!isNonMobileScreens && (
            <IconButton onClick={() => { inputRef.current.focus() }}>
              <Edit />
            </IconButton>
          )}
          <InputBase
            id={uuidv4()}
            placeholder={displayName}
            onChange={(e) => setNewApparelName(e.target.value)}
            value={newApparelName}
            required={true}
            inputRef={inputRef}
            sx={isNonMobileScreens ? {
              width: "100%",
              fontSize: "1.5rem",
              borderRadius: "2rem",
              margin: "1rem 1rem 0 1rem",
            } : {
              width: "100%",
              fontSize: "1.5rem",
              borderRadius: "2rem",
              margin: "0",
            }}
          />
          {isNonMobileScreens && (
            <IconButton onClick={() => { inputRef.current.focus() }}>
              <Edit />
            </IconButton>
          )}
        </Box>
        <Box pb={2} display={"flex"} flexDirection={"row"} justifyContent={"center"}>
          {picturePath && (
            <img
              width={isSmallMobileScreens ? "72%" : isHDScreens ? "60%" : isNonMobileScreens ? "100%" : "80%"}
              height="auto"
              alt="apparel"
              style={{ borderRadius: "0.75rem", marginTop: "0.75rem", aspectRatio: "1" }}
              src={`https://slay-style-app.s3.us-west-1.amazonaws.com/${picturePath}`}
            />
          )}
        </Box>

        <Box m={1} display={"flex"} justifyContent={"center"}>
          <Button
            disabled={dailyAllowedEdits < 1 && guestUser}
            onClick={handleUpdateApparel}
            sx={{
              padding: "1rem 4rem",
              borderRadius: "6rem",
              fontWeight: 600,
              color: palette.background.alt,
              borderColor: palette.neutral.dark,
              backgroundColor: palette.neutral.dark,
              "&:hover": {
                color: palette.background.alt,
                backgroundColor: palette.primary.main
              },
            }}
          >
            Update
          </Button>
        </Box>
      </Box>

      {guestUser && (
        <Box
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          borderRadius={"6rem"}
          margin={"1rem"}
          gap={2}
        >
          <Typography color={palette.neutral.medium}>Edits Remaining: {dailyAllowedEdits}</Typography>
          {dailyAllowedEdits < 1 && (
            <Box>
              <Typography color={palette.neutral.medium}>
                Refreshes in: <Countdown date={nextRefreshDate} renderer={renderer} />
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default EditApparelWidget