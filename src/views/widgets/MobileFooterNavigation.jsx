import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { IoLanguage, IoSearchSharp, IoCloseSharp } from "react-icons/io5"
import { BottomNavigation, BottomNavigationAction, Stack, Paper, Box, useTheme } from "@mui/material"
import { setOpenLabelsDrawer } from "state"
import AddVocabDialog from "components/AddVocabDialog"

const MobileFooterNavigation = ({ isHome, isRoadmap }) => {
  const { _id } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const openLabelsDrawer = useSelector((state) => state.openLabelsDrawer)
  const theme = useTheme()

  const toggleLabelsDrawer = () => {
    dispatch(setOpenLabelsDrawer({ openLabelsDrawer: !openLabelsDrawer }))
  }


  const goToSearch = () => {
    navigate(`/search/${_id}`)
  }

  return (
    <Box sx={{ pb: 7 }} >
      <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation>
          <Stack direction={"row"} width={"100%"}>

            <AddVocabDialog />

            <BottomNavigationAction
              icon={<IoSearchSharp size="2rem" />}
              onClick={goToSearch}
            />

            <BottomNavigationAction
              label="Labels"
              value="labels"
              icon={openLabelsDrawer ? <IoCloseSharp size="2rem" style={{ color: theme.palette.primary.main }} /> : <IoLanguage size="2rem" />}
              onClick={toggleLabelsDrawer}
            />
          </Stack>

        </BottomNavigation>
      </Paper>

    </Box>
  )
}

export default MobileFooterNavigation