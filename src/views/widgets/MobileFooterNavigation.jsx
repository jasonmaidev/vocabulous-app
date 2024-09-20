import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { IoLanguage, IoSearchSharp } from "react-icons/io5"
import { BottomNavigation, BottomNavigationAction, Paper, Box, } from "@mui/material"
import { setOpenLabelsDrawer } from "state"
import AddVocabDialog from "components/AddVocabDialog"

const MobileFooterNavigation = ({ isHome, isRoadmap }) => {
  const { _id } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const openLabelsDrawer = useSelector((state) => state.openLabelsDrawer)


  const toggleLabelsDrawer = () => {
    dispatch(setOpenLabelsDrawer({ openLabelsDrawer: !openLabelsDrawer }))
  }


  const goToSearch = () => {
    navigate(`/search/${_id}`)
  }

  return (
    <Box sx={{ pb: 7 }} >
      <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0, ml: 4 }} elevation={3}>
        <BottomNavigation showLabels>

          <AddVocabDialog />

          <BottomNavigationAction
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

    </Box>
  )
}

export default MobileFooterNavigation