import "../../styles/radio-button.min.css"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IoClose } from "react-icons/io5"
import { PiWarning } from "react-icons/pi"
import Countdown from "react-countdown"
import { Box, Typography, useTheme, Button, IconButton, useMediaQuery, Snackbar } from "@mui/material"
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
import FlexEvenlyBox from "components/FlexEvenlyBox"
import apiUrl from "config/api"

const DeleteApparelWidget = ({ picturePath, apparelId, section, handleDeleteClose }) => {
  const isSmallMobileScreens = useMediaQuery("(max-width:800px) and (max-height:800px)")
  const isNonMobileScreens = useMediaQuery("(min-width:1000px) and (max-height:2160px)")
  const token = useSelector((state) => state.token)
  const { palette } = useTheme()
  const dispatch = useDispatch()

  /* Guest  & Friend User State */
  const guestUser = useSelector((state) => state.user.guestUser)
  const friendUser = useSelector((state) => state.user.friendUser)
  const nextRefreshDate = useSelector((state) => state.nextRefreshDate)
  const dailyAllowedDeletes = useSelector((state) => state.dailyAllowedDeletes)

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

  const queryClient = useQueryClient()

  const handleDeleteApparel = () => {
    deleteMutation.mutate()
    setTimeout(() => handleDeleteClose(), 2500)
  }

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await fetch(`${apiUrl}/apparels/${apparelId}/delete/${guestUser}/${dailyAllowedDeletes}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      })
    },
    onError: (error, _apparelName, context) => {
      console.log("Error fetching:" + context.id + error)
    },
    onSettled: () => {
      handleSnackbarOpen()
      setTimeout(() => queryClient.invalidateQueries(["sectionedApparelsData", section]), 1500)
      dispatch(setDailyAllowedDeletes({ dailyAllowedDeletes: dailyAllowedDeletes - 1 }))
      if (dailyAllowedDeletes <= 1 && !nextRefreshDate) {
        dispatch(setNextRefreshDate({ nextRefreshDate: Date.now() + 86400000 }))
      }
    }
  })

  const handleDeleteDemoApparel = () => {
    deleteDemoMutation.mutate()
  }

  const deleteDemoMutation = useMutation({
    mutationFn: async () => {
      return await fetch(`${apiUrl}/apparels/${apparelId}/deletedemo/${guestUser}/${dailyAllowedDeletes}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
    },
    onError: (error, _apparelName, context) => {
      console.log("Error fetching:" + context.id + error)
    },
    onSettled: () => {
      handleSnackbarOpen()
      setTimeout(() => queryClient.invalidateQueries(["sectionedApparelsData", section]), 1500)
      dispatch(setDailyAllowedDeletes({ dailyAllowedDeletes: dailyAllowedDeletes - 1 }))
      if (dailyAllowedDeletes === 1 && !nextRefreshDate) {
        dispatch(setNextRefreshDate({ nextRefreshDate: Date.now() + 86400000 }))
      }
    }
  })

  /* Snackbar State */
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const handleSnackbarOpen = () => {
    setOpenSnackbar(true)
  }
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }
  const action = (
    <>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
        <IoClose />
      </IconButton>
    </>
  )

  return (
    <Box margin={isNonMobileScreens ? "0 2rem 1rem 2rem" : "1rem"} padding={isNonMobileScreens ? 4 : 1}>
      <Box padding={isNonMobileScreens ? 1 : 0.5} margin={isNonMobileScreens ? 1 : "0 1rem"}>

        {/* ----- Text Input Field ----- */}
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          flexWrap={"wrap"}
        >
          <Typography>
            <PiWarning color={palette.neutral.dark} size={isSmallMobileScreens ? "2.5rem" : "3rem"} />
          </Typography>
          <Typography color={palette.neutral.dark} fontWeight={600} fontSize={isNonMobileScreens ? "2rem" : "1.5rem"} padding={"0 0.5rem"}>
            Are you sure?
          </Typography>
        </Box>
        <Typography textAlign={"center"} color={palette.neutral.main} fontWeight={600} fontSize={"0.75rem"}>
          *Deleting an apparel may alter some of the saved styles.
        </Typography>

        {picturePath && (
          <img
            width="100%"
            height="auto"
            alt="apparel"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem", aspectRatio: "1" }}
            src={`https://slay-style-app.s3.us-west-1.amazonaws.com/${picturePath}`}
          />
        )}

        <FlexEvenlyBox pt={0.5} gap={isNonMobileScreens ? undefined : 2}>
          <Button
            disabled={dailyAllowedDeletes < 1 && guestUser}
            onClick={guestUser ? handleDeleteDemoApparel : handleDeleteApparel}
            sx={{
              padding: isNonMobileScreens ? "1rem 4rem" : "1rem 2rem",
              borderRadius: "6rem",
              fontWeight: 600,
              color: palette.background.alt,
              borderColor: palette.neutral.dark,
              backgroundColor: palette.neutral.dark,
              "&:hover": {
                color: palette.background.alt,
                backgroundColor: palette.primary.main
              }
            }}
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            onClick={handleDeleteClose}
            sx={{
              padding: isNonMobileScreens ? "1rem 4rem" : "1rem 2rem",
              borderRadius: "6rem",
              fontWeight: 600,
              color: palette.neutral.dark,
              borderColor: palette.neutral.dark,
              "&:hover": {
                color: palette.primary.main,
              }
            }}
          >
            Cancel
          </Button>
        </FlexEvenlyBox>
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
          <Typography color={palette.neutral.medium}>Deletions Remaining: {dailyAllowedDeletes}</Typography>
          {dailyAllowedDeletes < 1 && (
            <Box>
              <Typography color={palette.neutral.medium}>
                Refreshes in: <Countdown date={nextRefreshDate} renderer={renderer} />
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* ----- Snackbar on Delete Confirmation ----- */}
      <div>
        <Snackbar
          sx={{ height: "auto" }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          message="Apparel Deleted."
          action={action}
        />
      </div>
    </Box>
  )
}

export default DeleteApparelWidget