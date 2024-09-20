import { useEffect, useRef, lazy, Suspense } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import PropagateLoader from "react-spinners/PropagateLoader"
import { Box, Typography, useMediaQuery, Button, useTheme } from "@mui/material"
import { setViewByLabel } from "state"
import Navbar from "views/navbar"
import LabelsDrawer from "components/LabelsDrawer"
import { MdLabelOutline } from "react-icons/md";
import ViewVocabsWidget from "views/widgets/ViewVocabsWidget"
import apiUrl from "config/api"
const MobileFooterNavigation = lazy(() => import("../widgets/MobileFooterNavigation"))
const DesktopFooter = lazy(() => import("../widgets/DesktopFooter"))

const SearchPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px) and (max-height:2160px)")
  const isHDScreens = useMediaQuery("(min-width:1280px) and (max-height:900px)")
  const { palette } = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const viewByLabel = useSelector((state) => state.viewByLabel)
  const viewBySearchTerm = useSelector((state) => state.viewBySearchTerm)

  const searchRef = useRef(null)


  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;

  const theme = useTheme()

  const queryClient = useQueryClient()

  const token = useSelector((state) => state.token)
  const { _id } = useSelector((state) => state.user)

  const getVocabLabels = () => {
    return fetch(`${apiUrl}/labels/${_id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
  }

  const { data: labelsData } = useQuery(["vocabLabelsData"], getVocabLabels, {
    keepPreviousData: true,
    staleTime: 5000
  })

  const viewLabledVocabs = (text) => {
    dispatch(setViewByLabel({ viewByLabel: text }))
    queryClient.invalidateQueries({ queryKey: ["labeledVocabsData"] })
    navigate(`/label/${_id}`)
  }

  useEffect(() => {
    if (viewByLabel !== "") {
      dispatch(setViewByLabel(""))
    }
  }, [viewByLabel, dispatch])

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus()
    }
  }, [searchRef])

  return (
    <Box>
      <Navbar searchRef={searchRef} />

      {/* ----- Page Body ----- */}

      <LabelsDrawer />

      <Box
        width="100%"
        padding={isLandscape ? "1rem 4%" : "2rem 4%"}
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="center"
      >

        {/* ----- Mid Page Column ----- */}

        <Box
          flexBasis={isNonMobileScreens ? "64%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {
            !viewBySearchTerm ?
              (
                <>
                  <Typography
                    variant={isHDScreens ? "h2" : isNonMobileScreens ? "h1" : "h2"}
                    textAlign={"center"}
                    color={palette.neutral.darker}
                  >
                    Search by Text or Label
                  </Typography>
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"flex-start"}
                    alignItems={"flex-start"}
                    sx={{
                      m: 2,
                      p: "1rem",
                      borderRadius: "1rem",
                      border: `solid 1px ${palette.neutral.light}`,
                    }}
                  >
                    {labelsData?.[0].label?.sort().map((text, index) => (
                      <Box
                        key={text}
                        onClick={() => viewLabledVocabs(text)}
                      >
                        <Button
                          startIcon={<MdLabelOutline size={24} />}
                          sx={{
                            borderRadius: "6rem",
                            padding: "1rem 2rem",
                            '&:hover': {
                              backgroundColor: theme.palette.primary.light,
                            },
                          }}
                        >
                          {text}
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </>
              ) :
              <ViewVocabsWidget />
          }
        </Box>
        {isNonMobileScreens &&
          <Suspense fallback={
            <PropagateLoader
              color={palette.neutral.light}
              loading={true}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          }>
            <DesktopFooter isHome />
          </Suspense>
        }
        {!isNonMobileScreens &&
          <Suspense fallback={
            <PropagateLoader
              color={palette.neutral.light}
              loading={true}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          }>
            <MobileFooterNavigation isHome />
          </Suspense>
        }
      </Box>

    </Box>
  )
}

export default SearchPage