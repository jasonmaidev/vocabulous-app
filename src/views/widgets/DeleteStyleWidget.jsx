import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { IoClose } from "react-icons/io5"
import { PiWarning } from "react-icons/pi"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import FlexEvenlyBox from "components/FlexEvenlyBox"
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
import Countdown from "react-countdown"
import apiUrl from "config/api"

const DeleteStyleWidget = ({ userId, styleId, handleDeleteClose, pageNumber }) => {
  const isSmallMobileScreens = useMediaQuery("(max-width:800px) and (max-height:800px)")
  const isNonMobileScreens = useMediaQuery("(min-width:1000px) and (max-height:2160px)")
  const { palette } = useTheme()
  const token = useSelector((state) => state.token)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const sortByOccasion = useSelector((state) => state.sortByOccasion)

  /* Guest User State */
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

  const handleDeleteStyle = () => {
    handleSnackbarOpen()
    setTimeout(() => navigate(`/styles/${userId}`), 1500)
    setTimeout(() => deleteStyleMutation.mutate(), 2000)
  }

  const deleteStyleMutation = useMutation({
    mutationFn: async () => {
      return await fetch(`${apiUrl}/styles/${styleId}/delete/${guestUser}/${dailyAllowedDeletes}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
    },
    onError: (error, _apparelName, context) => {
      console.log("Error fetching:" + context.id + error)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['stylesData', sortByOccasion, pageNumber])
      dispatch(setDailyAllowedDeletes({ dailyAllowedDeletes: dailyAllowedDeletes - 1 }))
      if (dailyAllowedDeletes <= 1 && !nextRefreshDate) {
        dispatch(setNextRefreshDate({ nextRefreshDate: Date.now() + 86400000 }))
      }
    }
  })

  /* Snackbar State */
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleSnackbarOpen = () => {
    setOpenSnackbar(true);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  const action = (
    <>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
        <IoClose />
      </IconButton>
    </>
  )

  return (
    <Box margin={isSmallMobileScreens ? "0 1rem" : "0 2rem"} padding={4}>
      <Box padding={1} margin={1}>

        {/* ----- Delete Confirmation ----- */}
        <Box
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          flexWrap={"wrap"}
        >
          <Typography>
            <PiWarning color={palette.neutral.dark} size={isSmallMobileScreens ? "2.5rem" : "3rem"} />
          </Typography>
          <Typography
            color={palette.neutral.dark}
            fontWeight={600}
            fontSize={isNonMobileScreens ? "2rem" : "1rem"}
            padding={"0 1rem"}>
            Are you sure?
          </Typography>
        </Box>
        <FlexEvenlyBox pt={2} gap={2}>
          <Button
            disabled={openSnackbar || (dailyAllowedDeletes < 1 && guestUser)}
            onClick={handleDeleteStyle}
            sx={{
              padding: "1rem 30%",
              borderRadius: "6rem",
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
              padding: "1rem 30%",
              borderRadius: "6rem",
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
          margin={"0 1rem 1rem 1rem"}
          gap={2}
        >
          <Typography color={palette.neutral.dark}>Deletions Remaining: {dailyAllowedDeletes}</Typography>
          {dailyAllowedDeletes < 1 && (
            <Box>
              <Typography color={palette.neutral.dark}>
                Refreshes in: <Countdown date={nextRefreshDate} renderer={renderer} />
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* ----- Snackbar on Deleting Style ----- */}
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
          message="Deleting style..."
          action={action}
        />
      </div>
    </Box>
  )
}

export default DeleteStyleWidget