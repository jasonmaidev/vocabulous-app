import { useEffect, useRef, lazy, Suspense } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import PropagateLoader from "react-spinners/PropagateLoader"
import { Box, Typography, useMediaQuery, Stack, useTheme } from "@mui/material"
import { setViewByLabel } from "state"
import Navbar from "views/navbar"
import LabelsDrawer from "components/LabelsDrawer"
import { BiHomeAlt2, BiPulse } from "react-icons/bi";
import { PiRuler, PiCircleBold, PiDiamondBold, PiStarBold, PiBathtub } from "react-icons/pi";
import { MdLabelOutline, MdAccessTime } from "react-icons/md";
import { TbTemperature, TbPin, TbToolsKitchen3 } from "react-icons/tb";
import { IoLanguage, IoBeerOutline, IoBodyOutline, IoBedOutline } from "react-icons/io5";
import { LiaLaughSquint, LiaFeatherAltSolid } from "react-icons/lia";
import { FaRegHeart } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { FiThumbsUp, FiThumbsDown, FiMapPin, FiBriefcase, FiHash } from "react-icons/fi";
import { RiHeartsLine, RiChat3Line } from "react-icons/ri";
import { HiOutlineBookOpen } from "react-icons/hi2";
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
  const mode = useSelector((state) => state.mode)

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

  const navigateHome = () => {
    navigate(`/`)
  }
  const showAllVocabs = () => {
    navigate(`/all/${_id}`)
  }
  const showIntermediateVocabs = () => {
    navigate(`/int/${_id}`)
  }
  const showAdvancedVocabs = () => {
    navigate(`/adv/${_id}`)
  }

  const renderIcon = (text) => {
    switch (text) {
      case 'body':
        return <IoBodyOutline size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
      case 'bathroom':
        return <PiBathtub size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
      case 'bedroom':
        return <IoBedOutline size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
      case 'business':
        return <FiBriefcase size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
      case 'colloquial':
        return <RiChat3Line size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
      case 'degree':
        return <TbTemperature size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
      case 'frequency':
        return <MdAccessTime size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
      case 'grammar':
        return <IoLanguage size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
      case 'house':
        return <BiHomeAlt2 size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
      case 'humor':
        return <LiaLaughSquint size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
      case 'idiom':
        return <LiaFeatherAltSolid size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
      case 'kitchen':
        return <TbToolsKitchen3 size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
      case 'measure':
        return <PiRuler size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
      case 'mood':
        return <FaRegHeart size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
      case 'negative':
        return <FiThumbsDown size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
      case 'personality':
        return <FaRegUser size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
      case 'places':
        return <FiMapPin size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
      case 'positive':
        return <FiThumbsUp size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
      case 'romance':
        return <RiHeartsLine size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
      case 'slang':
        return <FiHash size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
      case 'social':
        return <IoBeerOutline size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
      case 'status':
        return <BiPulse size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
      case 'wisdom':
        return <HiOutlineBookOpen size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
      default:
        return <MdLabelOutline size={isLandscape ? 36 : 32} style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }} color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium} />;
    }
  };

  return (
    <Box>
      <Navbar searchRef={searchRef} />

      {/* ----- Page Body ----- */}

      <LabelsDrawer />

      <Box
        width="100%"
        padding={isLandscape ? "1rem 4%" : "2rem 1%"}
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
                    flexDirection={"row"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    flexWrap={"wrap"}
                    sx={{
                      m: 2,
                      p: "1rem",
                      borderRadius: "1rem",
                    }}
                  >
                    <Stack
                      key={"pinned"}
                      onClick={navigateHome}
                      direction={"column"}
                      alignItems={"center"}
                      sx={{
                        cursor: "pointer",
                        borderRadius: "2rem",
                        padding: "1rem",
                        border: `solid 1px ${palette.neutral.light}`,
                        m: 1,
                        '&:hover': {
                          backgroundColor: mode === "light" ? "rgba(155, 155, 171, 0.1)" : theme.palette.primary.light,
                          border: mode === "light" ? `solid 1px rgba(155, 155, 171, 0.1)` : `solid 1px ${palette.primary.light}`,
                        },
                      }}
                    >
                      <TbPin
                        size={isLandscape ? 36 : 32}
                        style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }}
                        color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium}
                      />
                      <Typography sx={{ fontSize: isLandscape ? "0.8rem" : "0.65rem", fontWeight: mode === "light" ? 500 : 400 }}>
                        Pinned
                      </Typography>
                    </Stack>
                    <Stack
                      key={"pinned"}
                      onClick={showAllVocabs}
                      direction={"column"}
                      alignItems={"center"}
                      sx={{
                        cursor: "pointer",
                        borderRadius: "2rem",
                        padding: "1rem",
                        border: `solid 1px ${palette.neutral.light}`,
                        m: 1,
                        '&:hover': {
                          backgroundColor: mode === "light" ? "rgba(155, 155, 171, 0.1)" : theme.palette.primary.light,
                          border: mode === "light" ? `solid 1px rgba(155, 155, 171, 0.1)` : `solid 1px ${palette.primary.light}`,
                        },
                      }}
                    >
                      <PiCircleBold
                        size={isLandscape ? 36 : 32}
                        style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }}
                        color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium}
                      />
                      <Typography sx={{ fontSize: isLandscape ? "0.8rem" : "0.65rem", fontWeight: mode === "light" ? 500 : 400 }}>
                        All
                      </Typography>
                    </Stack>
                    <Stack
                      key={"pinned"}
                      onClick={showIntermediateVocabs}
                      direction={"column"}
                      alignItems={"center"}
                      sx={{
                        cursor: "pointer",
                        borderRadius: "2rem",
                        padding: "1rem",
                        border: `solid 1px ${palette.neutral.light}`,
                        m: 1,
                        '&:hover': {
                          backgroundColor: mode === "light" ? "rgba(155, 155, 171, 0.1)" : theme.palette.primary.light,
                          border: mode === "light" ? `solid 1px rgba(155, 155, 171, 0.1)` : `solid 1px ${palette.primary.light}`,
                        },
                      }}
                    >
                      <PiDiamondBold
                        size={isLandscape ? 36 : 32}
                        style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }}
                        color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium}
                      />
                      <Typography sx={{ fontSize: isLandscape ? "0.8rem" : "0.65rem", fontWeight: mode === "light" ? 500 : 400 }}>
                        Lv. 2
                      </Typography>
                    </Stack>
                    <Stack
                      key={"pinned"}
                      onClick={showAdvancedVocabs}
                      direction={"column"}
                      alignItems={"center"}
                      sx={{
                        cursor: "pointer",
                        borderRadius: "2rem",
                        padding: "1rem",
                        border: `solid 1px ${palette.neutral.light}`,
                        m: 1,
                        '&:hover': {
                          backgroundColor: mode === "light" ? "rgba(155, 155, 171, 0.1)" : theme.palette.primary.light,
                          border: mode === "light" ? `solid 1px rgba(155, 155, 171, 0.1)` : `solid 1px ${palette.primary.light}`,
                        },
                      }}
                    >
                      <PiStarBold
                        size={isLandscape ? 36 : 32}
                        style={{ margin: isLandscape ? "0.5rem 2rem" : "0.25rem 1.25rem" }}
                        color={mode === "light" ? theme.palette.neutral.darker : theme.palette.neutral.medium}
                      />
                      <Typography sx={{ fontSize: isLandscape ? "0.8rem" : "0.65rem", fontWeight: mode === "light" ? 500 : 400 }}>
                        Lv. 3
                      </Typography>
                    </Stack>
                    {labelsData?.[0].label.sort().map((text, index) => (
                      <Stack
                        key={text}
                        onClick={() => viewLabledVocabs(text)}
                        direction={"column"}
                        alignItems={"center"}
                        sx={{
                          cursor: "pointer",
                          borderRadius: "2rem",
                          padding: "1rem",
                          border: `solid 1px ${palette.neutral.light}`,
                          m: 1,
                          '&:hover': {
                            backgroundColor: mode === "light" ? "rgba(155, 155, 171, 0.1)" : theme.palette.primary.light,
                            border: mode === "light" ? `solid 1px rgba(155, 155, 171, 0.1)` : `solid 1px ${palette.primary.light}`,
                          },
                        }}
                      >
                        {renderIcon(text)}
                        <Typography
                          sx={{
                            fontSize: isLandscape ? "0.8rem" : "0.65rem",
                            fontWeight: mode === "light" ? 500 : 400
                          }}
                        >
                          {text}
                        </Typography>
                      </Stack>
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