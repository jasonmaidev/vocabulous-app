import { useState } from "react"
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
  setNextRefreshDate,
  setStylingHeadwear,
  setStylingShortTops,
  setStylingLongTops,
  setStylingOuterwear,
  setStylingOnePiece,
  setStylingPants,
  setStylingShorts,
  setStylingFootwear,
  setHasApparel
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

const ResetWardrobe = ({ handleResetWardrobeClose, _id }) => {
  const isSmallMobileScreens = useMediaQuery("(max-width:800px) and (max-height:800px)")
  const isNonMobileScreens = useMediaQuery("(min-width:1000px) and (max-height:2160px)")
  const { palette } = useTheme()
  const token = useSelector((state) => state.token)
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const sortBySection = useSelector((state) => state.sortBySection)

  /* Guest User State */
  const guestUser = useSelector((state) => state.user.guestUser)
  const friendUser = useSelector((state) => state.user.friendUser)
  const nextRefreshDate = useSelector((state) => state.nextRefreshDate)
  const dailyAllowedResets = useSelector((state) => state.dailyAllowedResets)

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

  // Clear Section(s)
  const clearAllStylingSections = () => {
    dispatch(setStylingShortTops({ stylingShortTops: null }))
    dispatch(setStylingLongTops({ stylingLongTops: null }))
    dispatch(setStylingOuterwear({ stylingOuterwear: null }))
    dispatch(setStylingOnePiece({ stylingOnePiece: null }))
    dispatch(setStylingPants({ stylingPants: null }))
    dispatch(setStylingShorts({ stylingShorts: null }))
    dispatch(setStylingFootwear({ stylingFootwear: null }))
    dispatch(setStylingHeadwear({ stylingHeadwear: null }))
  }

  const handleHasApparel = () => {
    dispatch(setHasApparel({ hasApparel: true }))
  }

  const handleResetWardrobe = () => {
    handleSnackbarWaitOpen()
    setTimeout(() => resetWardrobeMutation.mutate(), 2500)
    setTimeout(handleSnackbarCompleteOpen(), 3500)
    setTimeout(() => handleResetWardrobeClose(), 4000)
    setTimeout(() => handleHasApparel(), 4500)
  }

  const resetWardrobeMutation = useMutation({
    mutationFn: async () => {
      return await fetch(`${apiUrl}/apparels/${_id}/resetwardrobe/${guestUser}/${dailyAllowedResets}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
    },
    onError: (error, _apparelName, context) => {
      console.log("Error fetching:" + context.id + error)
    },
    onSettled: () => {
      clearAllStylingSections()
      dispatch(setDailyAllowedResets({ dailyAllowedResets: dailyAllowedResets - 1 }))
      queryClient.invalidateQueries(["sectionedApparelsData", sortBySection])
      if (dailyAllowedResets <= 1 && !nextRefreshDate) {
        dispatch(setNextRefreshDate({ nextRefreshDate: Date.now() + 86400000 }))
      }
    }
  })

  /* Waiting Snackbar State */
  const [openSnackbarWait, setOpenSnackbarWait] = useState(false)
  const handleSnackbarWaitOpen = () => {
    setOpenSnackbarWait(true)
  }
  const handleSnackbarWaitClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbarWait(false)
  }
  /* Complete Snackbar State */
  const [openSnackbarComplete, setOpenSnackbarComplete] = useState(false)
  const handleSnackbarCompleteOpen = () => {
    setOpenSnackbarComplete(true)
  }
  const handleSnackbarCompleteClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbarComplete(false)
  }
  const action = (
    <>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarCompleteClose}>
        <IoClose />
      </IconButton>
    </>
  )
  const completedAction = (
    <>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarCompleteClose}>
        <IoClose />
      </IconButton>
    </>
  )

  return (
    <Box padding={"0.75rem 0.75rem 1rem 0.75rem"}>
      <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
        <IconButton onClick={handleResetWardrobeClose}>
          <IoClose color={palette.neutral.dark} size={isSmallMobileScreens ? "1.5rem" : "2rem"} />
        </IconButton>
      </Box>
      <Box padding={isNonMobileScreens ? "0 4rem" : "0 0.5rem"} margin={"0 1rem 2rem 1rem"}>
        {/* ----- Reset Confirmation ----- */}
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
          <Typography textAlign={"center"} color={palette.secondary.main} fontWeight={600} fontSize={"0.75rem"}>
            *Please note that this will replenish the default demo apparels AND delete all current saved styles.
          </Typography>
        </Box>
        <FlexEvenlyBox pt={2} gap={2}>
          <Button
            disabled={(dailyAllowedResets < 1 && guestUser) || openSnackbarWait || openSnackbarComplete}
            onClick={handleResetWardrobe}
            sx={{
              padding: isNonMobileScreens ? "1rem 4rem" : "1rem 2rem",
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
            onClick={handleResetWardrobeClose}
            sx={{
              padding: isNonMobileScreens ? "1rem 4rem" : "1rem 2rem",
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
          <Typography color={dailyAllowedResets <= 1 ? palette.secondary.main : palette.neutral.dark}>
            Resets Remaining: {dailyAllowedResets}
          </Typography>
          {dailyAllowedResets < 1 && (
            <Box>
              <Typography color={palette.neutral.dark}>
                Refreshes in: <Countdown date={nextRefreshDate} renderer={renderer} />
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* ----- SnackbarWait on Reseting Wardrobe ----- */}
      <div>
        <Snackbar
          sx={{ height: "auto" }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          open={openSnackbarWait}
          autoHideDuration={3000}
          onClose={handleSnackbarWaitClose}
          message="Your wardrobe has been replenished!"
          action={completedAction}
        />
      </div>

      {/* ----- Snackbar Complete on Reseting Wardrobe ----- */}
      <div>
        <Snackbar
          sx={{ height: "auto" }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          open={openSnackbarComplete}
          autoHideDuration={2000}
          onClose={handleSnackbarCompleteClose}
          message="Just a sec..."
          action={action}
        />
      </div>
    </Box>
  )
}

export default ResetWardrobe