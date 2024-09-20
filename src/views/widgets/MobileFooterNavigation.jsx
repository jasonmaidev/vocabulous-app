import { useState, useRef, useEffect, forwardRef, lazy, Suspense, CSSProperties } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { PiCoatHangerBold } from "react-icons/pi"
import { GiClothes } from "react-icons/gi"
import { IoIosHome, IoMdAdd } from "react-icons/io"
import { TfiMapAlt } from "react-icons/tfi"
import { TbArrowBackUp } from "react-icons/tb"
import { IoAddCircleOutline, IoOptions, IoLanguage, IoSearchSharp, IoMenu } from "react-icons/io5"
import GridLoader from "react-spinners/GridLoader"
import { makeStyles } from "@mui/styles"
import { styled, BottomNavigation, BottomNavigationAction, Paper, Box, Slide, Dialog, useTheme } from "@mui/material"
import { setMode, setLogout, setViewBySearchTerm, setOpenLabelsDrawer } from "state"
import AddVocabDialog from "components/AddVocabDialog"

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const FilterDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "1.5rem"
  },
}))


const MobileFooterNavigation = ({ isHome, isWardrobe, isStyles, isRoadmap }) => {
  const { _id } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const searchRef = useRef(null)


  const viewByLabel = useSelector((state) => state.viewByLabel)
  const openLabelsDrawer = useSelector((state) => state.openLabelsDrawer)


  const toggleLabelsDrawer = () => {
    dispatch(setOpenLabelsDrawer({ openLabelsDrawer: !openLabelsDrawer }))
  }


  const goToSearch = () => {
    navigate(`/search/${_id}`)
  }

  // Override default Dialog styles
  const slideDialogStyles = makeStyles({
    dialog: {
      width: "90%",
      position: "absolute",
      bottom: "2%"
    }
  })
  const classes = slideDialogStyles()

  /* Filter SlideUp Dialog State */
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const handleFilterDialogOpen = () => {
    setFilterDialogOpen(true)
  }
  const handleFilterDialogClose = () => {
    setFilterDialogOpen(false)
  }

  /* Actions SlideUp Dialog State */
  const [actionsDialogOpen, setActionsDialogOpen] = useState(false)
  const handleActionsDialogOpen = () => {
    setActionsDialogOpen(true)
  }
  const handleActionsDialogClose = () => {
    setActionsDialogOpen(false)
  }

  const dialogoverride: CSSProperties = {
    display: "block",
    margin: "0 auto",
  }

  return (
    <Box sx={{ pb: 7 }} >
      <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation showLabels>

          {/* <BottomNavigationAction
            icon={<IoAddCircleOutline size="2rem" />}
            onClick={handleActionsDialogOpen}
          /> */}

          <AddVocabDialog />

          <BottomNavigationAction
            // label="Home"
            // value="home"
            icon={<IoSearchSharp size="2rem" />}
            onClick={goToSearch}
          />

          <BottomNavigationAction
            label="Labels"
            value="labels"
            icon={<IoLanguage size="1.5rem" />}
            onClick={toggleLabelsDrawer}
          />

        </BottomNavigation>
      </Paper>

      <FilterDialog
        open={filterDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleFilterDialogClose}
        aria-describedby="alert-dialog-slide-description"
        disableScrollLock
        classes={{ paper: classes.dialog }}
      >
      </FilterDialog>

    </Box>
  )
}

export default MobileFooterNavigation