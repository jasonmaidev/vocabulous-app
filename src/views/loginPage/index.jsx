import "../../styles/gradient-button.min.css"
import { useState, forwardRef, lazy, Suspense, CSSProperties } from "react"
import { useSelector, useDispatch } from "react-redux"
import GridLoader from "react-spinners/GridLoader"
import { styled } from "@mui/system"
import { Box, Typography, Stack, useTheme, useMediaQuery, Button, Dialog, Grow, IconButton } from "@mui/material"
import { DarkMode, LightMode } from "@mui/icons-material"
import { PiSparkleFill } from "react-icons/pi";
import { IoLanguage } from "react-icons/io5";
import { setMode } from "state"
import DesktopFooter from "views/widgets/DesktopFooter"
const Form = lazy(() => import("./Form"))

const Transition = forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />
})

const LoginPage = () => {
  const theme = useTheme()
  const isSmallMobileScreens = useMediaQuery("(max-width:800px) and (max-height:800px)")
  const isNonMobileScreens = useMediaQuery("(min-width:1000px) and (max-height:2160px)")
  const isHDScreens = useMediaQuery("(min-width:1280px) and (max-height:900px)")
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const mode = useSelector((state) => state.mode)

  const FormDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
      borderRadius: isNonMobileScreens ? "3rem" : "2rem",
      padding: isNonMobileScreens ? "6rem" : "3rem"
    },
  }))

  /* Upload Popup Dialog State */
  const [formOpen, setFormOpen] = useState(false)
  const handleFormOpen = () => {
    setFormOpen(true)
  }
  const handleFormClose = () => {
    setFormOpen(false)
  }

  const formoverride: CSSProperties = {
    display: "block",
    margin: "0 auto",
  };

  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="0.5rem 6%"
        textAlign="center"
        display={"flex"}
        flexDirection={"row"}
        justifyContent={isNonMobileScreens ? "space-between" : "center"}
        alignItems={"center"}
        sx={{ boxShadow: "6px 6px 12px rgba(0,0,0, 0.05)" }}
      >
        <Stack direction={"row"} gap={1} alignItems={"center"}>
          {/* ----- Logo ----- */}
          <img
            style={{ objectFit: "cover", width: "8%" }}
            alt="user"
            src={`https://res.cloudinary.com/dngvjrd0n/image/upload/v1725936257/portfolio/voca-logo-${mode}.png`}
          />

          {/* ----- App Slogan ----- */}
          <Typography fontSize={"1.25rem"} fontWeight={700} color={theme.palette.neutral.darker}>
            金字卡
          </Typography>
          <Typography fontSize={"1rem"} fontWeight={700} color={theme.palette.primary.main}>
            Ai
          </Typography>
        </Stack>
        {isNonMobileScreens && (
          <Box display={"flex"} flexDirection={"row"} gap={4}>
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? (
                <DarkMode
                  sx={{
                    color: theme.palette.neutral.dark,
                    borderRadius: "6rem",
                    "&:hover": {
                      color: theme.palette.primary.main,
                      backgroundColor: theme.palette.background.alt,
                    }
                  }}
                />
              ) : (
                <LightMode
                  sx={{
                    color: theme.palette.neutral.dark,
                    borderRadius: "6rem",
                    "&:hover": {
                      color: theme.palette.primary.main,
                      backgroundColor: theme.palette.background.alt,
                    }
                  }}
                />
              )}
            </IconButton>
            <Button
              onClick={handleFormOpen}
              size="medium"
              variant="outlined"
              sx={
                isNonMobileScreens ?
                  {
                    padding: "0.5rem 1.5rem",
                    textTransform: "none",
                    borderRadius: "6rem",
                    fontWeight: 600,
                    color: palette.neutral.dark,
                    borderColor: palette.neutral.dark,
                    "&:hover": {
                      color: palette.primary.main,
                    }
                  }
                  :
                  {
                    padding: "0.5rem 1.5rem",
                    textTransform: "none",
                    borderRadius: "6rem",
                    fontWeight: 600,
                    color: palette.neutral.dark,
                    borderColor: palette.neutral.dark,
                    "&:hover": {
                      color: palette.primary.main,
                    }
                  }
              }
            >
              Sign In
            </Button>
          </Box>
        )}
      </Box>

      <Box
        width="100%"
        padding={isNonMobileScreens ? "8rem 16%" : "1rem 12%"}
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="center"
      >
        <Box
          display={"flex"}
          gap="0.5rem"
          justifyContent="center"
        >
        </Box>
        {/* ----- Mid Page Column ----- */}
        <Box
          flexBasis={isNonMobileScreens ? "64%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Stack direction={"row"} spacing={1} pb={isLandscape ? 4 : 2}>
            <IoLanguage size={isLandscape ? "8rem" : "4rem"} style={{
              padding: "0.5rem", borderRadius: "1rem",
              border: `4px solid ${theme.palette.neutral.darker}`,
            }} />
            <PiSparkleFill
              size={isLandscape ? "4rem" : "2rem"}
            />
          </Stack>
          {isLandscape ?
            <Typography
              variant={isSmallMobileScreens ? "h3" : isHDScreens ? "h2" : isNonMobileScreens ? "h1" : "h3"}
              textAlign={"center"}
            >
              The most powerful Ai-driven
            </Typography>
            :
            <Typography
              variant={isSmallMobileScreens ? "h3" : isHDScreens ? "h2" : isNonMobileScreens ? "h1" : "h3"}
              textAlign={"center"}
            >
              The most powerful Ai
            </Typography>
          }
          <Typography
            variant={isSmallMobileScreens ? "h3" : isHDScreens ? "h2" : isNonMobileScreens ? "h1" : "h2"}
            fontWeight={800}
            textAlign={"center"}
          >
            vocabulary learning.
          </Typography>
          <Typography
            pt={0.5}
            textAlign={"center"}
          >
            Currently supports Mandarin.
          </Typography>
          <Button
            onClick={handleFormOpen}
            className={mode === "light" ? "gradient-button" : "gradient-button-dark"}
            size="large"
            sx={
              (isNonMobileScreens && mode === "light") ?
                {
                  color: palette.neutral.dark,
                  margin: "2rem 36%",
                  padding: isLandscape ? "1.5rem 6%" : "1.5rem 12%",
                  borderRadius: "6rem",
                  fontSize: "1rem",
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "12px 16px 38px rgba(0,0,0, 0.1),-19px -19px 40px #ffffff",
                  ":hover": {
                    backgroundColor: palette.background.default
                  }
                }
                :
                (!isNonMobileScreens && mode === "light") ?
                  {
                    color: palette.neutral.dark,
                    margin: "2rem 16%",
                    padding: isLandscape ? "1.5rem 6%" : "1.5rem 12%",
                    borderRadius: "6rem",
                    fontSize: "1rem",
                    fontWeight: 700,
                    textTransform: "none",
                    boxShadow: "12px 16px 38px rgba(0,0,0, 0.1),-19px -19px 40px #ffffff",
                    ":hover": {
                      backgroundColor: palette.background.default
                    }
                  }
                  :
                  (!isNonMobileScreens && mode === "dark") ?
                    {
                      color: palette.primary.main,
                      margin: "2rem 16%",
                      padding: "1.5rem 2rem",
                      borderRadius: "6rem",
                      fontSize: "1rem",
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "15px 15px 40px rgba(0,0,0, 0.35), -15px -15px 40px #212125",
                      ":hover": {
                        backgroundColor: palette.background.default
                      }
                    }
                    :
                    {
                      color: palette.primary.main,
                      margin: "2rem 36%",
                      padding: "1.5rem 2rem",
                      borderRadius: "6rem",
                      fontSize: "1rem",
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "15px 15px 40px rgba(0,0,0, 0.35), -12px -12px 40px #212125",
                      ":hover": {
                        backgroundColor: palette.background.default
                      }
                    }
            }
          >
            Get Started
          </Button>
        </Box>
      </Box>

      {/* ----- Desktop Footer ----- */}
      <DesktopFooter isLogin />

      {/* ----- Popup Apparel Upload Form Dialog ----- */}
      <FormDialog
        open={formOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleFormClose}
        aria-describedby="alert-dialog-slide-description"
        disableScrollLock
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "1rem",
            display: "flex",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
            backgroundColor: mode === "light" ? "rgba(255, 255, 255, 1)" : "rgba(0, 11, 13, 0.3)", // Semi-transparent background
            backgroundImage: `linear-gradient(
              to top left, 
              rgba(255, 255, 255, 0.15), 
              rgba(255, 255, 255, 0.05)
            )`, // Gradient overlay
            backdropFilter: "blur(10px)", // Apply the glass effect
            WebkitBackdropFilter: "blur(10px)", // For Safari support
            border: "1px solid rgba(255, 255, 255, 0.2)"
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 11, 13, 0.7)", // Custom backdrop color
            },
          },
        }}
      >
        <Suspense fallback={
          <GridLoader
            color="#eee"
            loading={true}
            cssOverride={formoverride}
            size={50}
            margin={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        }>
          <Form />
        </Suspense>
      </FormDialog>

    </Box>
  )
}

export default LoginPage