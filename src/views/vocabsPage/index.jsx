import "../../styles/gradient-button.min.css"
import { useEffect, lazy, Suspense, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useQuery } from "@tanstack/react-query"
import SyncLoader from "react-spinners/SyncLoader"
import { Box, Typography, useMediaQuery, Button, useTheme } from "@mui/material"
import { setViewBySearchTerm } from "state"
import Navbar from "views/navbar"
import LabelsDrawer from "components/LabelsDrawer"
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";
import VocabBox from "components/VocabBox"
import VocabRow from "components/VocabRow"
import ViewVocabsWidget from "views/widgets/ViewVocabsWidget"
import apiUrl from "config/api"
const MobileFooterNavigation = lazy(() => import("../widgets/MobileFooterNavigation"))
const DesktopFooter = lazy(() => import("../widgets/DesktopFooter"))

const VocabsPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px) and (max-height:2160px)")
  const isHDScreens = useMediaQuery("(min-width:1280px) and (max-height:900px)")
  const { palette } = useTheme()
  const mode = useSelector((state) => state.mode)
  const dispatch = useDispatch()
  const viewByLabel = useSelector((state) => state.viewByLabel)
  const viewBySearchTerm = useSelector((state) => state.viewBySearchTerm)

  const isLandscape = window.matchMedia("(orientation: landscape)").matches;

  const token = useSelector((state) => state.token)
  const { _id } = useSelector((state) => state.user)

  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 100,
    })
  );

  const getPinnedVocabs = () => {
    return fetch(`${apiUrl}/vocabs/${_id}/pinned`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
  }

  const { data } = useQuery(["pinnedVocabsData"], getPinnedVocabs, {
    // keepPreviousData: true,
    staleTime: 500
  })

  useEffect(() => {
    if (viewBySearchTerm !== "") {
      dispatch(setViewBySearchTerm(""))
    }
  }, [viewBySearchTerm, dispatch])

  return (
    <Box>
      <Navbar />

      {/* ----- Page Body ----- */}

      <LabelsDrawer />

      <Box
        width="100%"
        padding={isLandscape ? "1rem 4%" : "0.5rem 4%"}
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="center"
      >

        {/* ----- Mid Page Column ----- */}

        <Box
          flexBasis={isNonMobileScreens ? "64%" : undefined}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          zIndex={10}
        >

          {(data?.length > 0 && viewByLabel === "") ? (
            <VocabBox>
              <div style={{ width: "100%", height: "80vh" }}>
                <AutoSizer>
                  {({ width, height }) => (
                    <List
                      width={width}
                      height={height}
                      rowHeight={cache.current.rowHeight}
                      deferredMeasurementCache={cache.current}
                      rowCount={data?.length}
                      rowRenderer={({ key, index, style, parent }) => {
                        const vocab = data[index]
                        return (
                          <CellMeasurer
                            key={key}
                            cache={cache.current}
                            parent={parent}
                            columnIndex={0}
                            rowIndex={index}
                          >
                            <div style={style}>
                              <VocabRow
                                key={vocab._id}
                                id={vocab._id}
                                text={vocab.text}
                                pinyin={vocab.pinyin}
                                difficulty={vocab.difficulty}
                                definition={vocab.definition}
                                similar={vocab.similar}
                                label={vocab.label}
                                expression={vocab.expression}
                                sentence={vocab.sentence}
                                pinned={vocab.pinned}
                              />
                            </div>
                          </CellMeasurer>
                        );
                      }}
                    />
                  )}
                </AutoSizer>
              </div>
            </VocabBox>
          ) :
            (data?.length < 1 && viewByLabel === "") ?
              (
                <>
                  <Typography
                    variant={isHDScreens ? "h2" : isNonMobileScreens ? "h1" : "h2"}
                    textAlign={"center"}
                    color={palette.neutral.darker}
                  >
                    Pin Vocabulary For Studying
                  </Typography>
                  <Button
                    className={mode === "light" ? "gradient-button" : "gradient-button-dark"}
                    size="medium"
                    sx={
                      (isNonMobileScreens && mode === "light") ?
                        {
                          color: palette.neutral.dark,
                          margin: "2rem 32%",
                          padding: "1.5rem 6%",
                          borderRadius: "6rem",
                          fontSize: "1rem",
                          fontWeight: 700,
                          textTransform: "none",
                          boxShadow: "12px 16px 38px rgba(0,0,0, 0.15),-12px -12px 30px #ffffff",
                          ":hover": {
                            backgroundColor: palette.background.default
                          }
                        }
                        :
                        (!isNonMobileScreens && mode === "light") ?
                          {
                            color: palette.neutral.dark,
                            margin: "2rem 16%",
                            padding: "1.5rem 6%",
                            borderRadius: "6rem",
                            fontSize: "1rem",
                            fontWeight: 700,
                            textTransform: "none",
                            boxShadow: "12px 16px 38px rgba(0,0,0, 0.15),-19px -19px 40px #ffffff",
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
                              margin: "2rem 32%",
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
                    +
                  </Button>
                </>
              ) :
              <ViewVocabsWidget data={data} />
          }

        </Box>
        {isNonMobileScreens &&
          <Suspense fallback={
            <SyncLoader
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
            <SyncLoader
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

export default VocabsPage