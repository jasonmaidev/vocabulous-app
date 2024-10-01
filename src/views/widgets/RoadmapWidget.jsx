import "../../styles/scrollbar.min.css"
import "react-perfect-scrollbar/dist/css/styles.css"
import PerfectScrollbar from "react-perfect-scrollbar"
import { Typography, useMediaQuery, useTheme, Box } from "@mui/material"
import { FiCheckCircle, FiCircle } from "react-icons/fi"

const RoadmapWidget = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px) and (max-height:2160px)")
  const isHDScreens = useMediaQuery("(min-width:1280px) and (max-height:900px)")
  const { palette } = useTheme()

  return (
    <>
      <div className={isHDScreens ? "laptop-apparels-scrollbar" : isNonMobileScreens ? "apparels-scrollbar" : undefined}>
        <PerfectScrollbar component="div">
          <Box
            display="flex"
            flexDirection={"column"}
            alignItems={"flex-start"}
            flexWrap={"no-wrap"}
            className={isHDScreens ? "laptop-apparels-content" : isNonMobileScreens ? "apparels-content" : undefined}
            height={isNonMobileScreens ? "72vh" : undefined}
          >
            {/* Version 1 */}
            <Box gap={2} display={"flex"} flexDirection={"row"} justifyContent={"flex-start"} alignItems={"center"}>
              <Typography variant={"h4"} fontWeight={500} color={palette.neutral.dark}>
                V1 - Alpha MVP
              </Typography>
              <Typography
                padding={"0.25rem 1rem"}
                border={`solid 1px ${palette.neutral.medium}`}
                borderRadius={"6rem"}
                variant={"h6"}
                fontWeight={500}
                color={palette.neutral.medium}>
                Completed
              </Typography>
            </Box>
            <Box>
              <Typography
                p={"1.5rem 0 0.25rem 0"}
                fontWeight={600}
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"flex-start"}
              >
                Features
              </Typography>
              <Box p={"0.5rem 1.5rem 0 1.5rem"}>
                <Typography pb={1}><FiCheckCircle /> Primary user and app registration.</Typography>
                <Typography pb={1}><FiCheckCircle /> Encrypted user authentication.</Typography>
                <Typography pb={1}><FiCheckCircle /> Create Vocab card.</Typography>
                <Typography pb={1}><FiCheckCircle /> Sort Vocabs by label.</Typography>
                <Typography pb={1}><FiCheckCircle /> Global Vocabs label update.</Typography>
                <Typography pb={1}><FiCheckCircle /> Search Vocabs by chinese text, pinyin, or definition.</Typography>
                <Typography pb={1}><FiCheckCircle /> Search relevant Vocabs via similar text field.</Typography>
                <Typography pb={1}><FiCheckCircle /> View pinned Vocabs.</Typography>
                <Typography pb={1}><FiCheckCircle /> Edit Vocab text.</Typography>
                <Typography pb={1}><FiCheckCircle /> Edit Vocab pinyin.</Typography>
                <Typography pb={1}><FiCheckCircle /> Edit Vocab definition.</Typography>
                <Typography pb={1}><FiCheckCircle /> Edit Vocab similar words.</Typography>
                <Typography pb={1}><FiCheckCircle /> Edit Vocab expressions.</Typography>
                <Typography pb={1}><FiCheckCircle /> Edit Vocab sentences.</Typography>
                <Typography pb={1}><FiCheckCircle /> Dynamic onclick field inputs.</Typography>
                <Typography pb={1}><FiCheckCircle /> Pin Vocabs for study.</Typography>
                <Typography pb={1}><FiCheckCircle /> Delete Vocab.</Typography>
                <Typography pb={1}><FiCheckCircle /> View Vocab content by segment.</Typography>
                <Typography pb={1}><FiCheckCircle /> Mobile responsive scaling.</Typography>
                <Typography pb={1}><FiCheckCircle /> Mobile navigation system.</Typography>
                <Typography pb={1}><FiCheckCircle /> Mobile interaction components.</Typography>
                <Typography pb={1}><FiCheckCircle /> Rate limitation and caching.</Typography>
              </Box>
            </Box>
            {/* Version 2 */}
            <Box
              display="flex"
              flexDirection={"column"}
              alignItems={"flex-start"}
              flexWrap={"no-wrap"}
              className={isHDScreens ? "laptop-apparels-content" : isNonMobileScreens ? "apparels-content" : ""}
              height={"72vh"}
            >
              <Box pt={4} gap={2} display={"flex"} flexDirection={"row"} justifyContent={"flex-start"} alignItems={"center"}>
                <Typography variant={"h4"} fontWeight={500} color={palette.neutral.dark}>
                  V2
                </Typography>
                <Typography
                  padding={"0.25rem 1rem"}
                  border={`solid 1px ${palette.neutral.medium}`}
                  borderRadius={"6rem"}
                  variant={"h6"}
                  fontWeight={500}
                  color={palette.neutral.medium}>
                  In Progress
                </Typography>
              </Box>
              <Box>
                <Typography
                  p={"1.5rem 0 0.25rem 0"}
                  fontWeight={600}
                  display={"flex"}
                  flexDirection={"row"}
                  justifyContent={"flex-start"}
                >
                  Features
                </Typography>
                <Box p={"0.5rem 1.5rem 0 1.5rem"}>
                  <Typography pb={1} color={palette.primary.main}><FiCheckCircle /> OpenAi auto similar-example generation.</Typography>
                  <Typography pb={1} color={palette.primary.main}><FiCheckCircle /> OpenAi auto usage-example generation.</Typography>
                  <Typography pb={1} color={palette.primary.main}><FiCheckCircle /> OpenAi auto definition generation.</Typography>
                  <Typography pb={1} color={palette.primary.main}><FiCheckCircle /> Context-aware vocabulary generation.</Typography>
                  <Typography pb={1}><FiCircle /> Highlighted text to search.</Typography>
                  <Typography pb={1}><FiCircle /> Text to voice.</Typography>
                  <Typography pb={1}><FiCircle /> Daily word set challenge.</Typography>
                  <Typography pb={1}><FiCircle /> Gamification.</Typography>
                </Box>
              </Box>
            </Box >
          </Box >
        </PerfectScrollbar>
      </div >
    </>
  )
}

export default RoadmapWidget