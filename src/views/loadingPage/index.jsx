import { useRef, lazy, Suspense } from "react"
import PropagateLoader from "react-spinners/PropagateLoader"
import PulseLoader from "react-spinners/PulseLoader"
import { Box, useMediaQuery, useTheme } from "@mui/material"
import Navbar from "views/navbar"
import LabelsDrawer from "components/LabelsDrawer"
const MobileFooterNavigation = lazy(() => import("../widgets/MobileFooterNavigation"))
const DesktopFooter = lazy(() => import("../widgets/DesktopFooter"))

const LoadingPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px) and (max-height:2160px)")
  const { palette } = useTheme()

  const theme = useTheme()

  const searchRef = useRef(null)

  const isLandscape = window.matchMedia("(orientation: landscape)").matches;

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
          <PulseLoader
            color={theme.palette.neutral.light}
            loading={true}
            size={24}
            speedMultiplier={1.2}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
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

export default LoadingPage