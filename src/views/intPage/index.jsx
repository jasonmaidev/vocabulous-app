import "../../styles/gradient-button.min.css"
import { useEffect, lazy, Suspense, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useQuery } from "@tanstack/react-query"
import SyncLoader from "react-spinners/SyncLoader"
import { Box, useMediaQuery, useTheme } from "@mui/material"
import { setViewByLabel, setViewBySearchTerm } from "state"
import Navbar from "views/navbar"
import LabelsDrawer from "components/LabelsDrawer"
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";
import VocabRow from "components/VocabRow"
import VocabBox from "components/VocabBox"
import apiUrl from "config/api"
const MobileFooterNavigation = lazy(() => import("../widgets/MobileFooterNavigation"))
const DesktopFooter = lazy(() => import("../widgets/DesktopFooter"))

const IntPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px) and (max-height:2160px)")
  const { palette } = useTheme()
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

  const getIntVocabs = () => {
    return fetch(`${apiUrl}/vocabs/${_id}/int`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        return data.sort((a, b) => a.pinyin.localeCompare(b.pinyin));
      });
  };

  const { data } = useQuery(["intVocabsData"], getIntVocabs, {
    keepPreviousData: true,
    staleTime: 500,
  });

  useEffect(() => {
    if (viewByLabel !== "") {
      dispatch(setViewByLabel(""))
    }
    if (viewBySearchTerm !== "") {
      dispatch(setViewBySearchTerm(""))
    }
  }, [viewByLabel, viewBySearchTerm, dispatch])

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

          {(data?.length > 0) ? (
            <VocabBox sx={{ border: data?.length < 1 && "none" }}>
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
            (
              <>

              </>
            )
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

export default IntPage