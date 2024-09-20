import { TbPinFilled } from "react-icons/tb"
import { useMediaQuery, Stack, useTheme, Typography } from "@mui/material"
import { useSelector } from "react-redux"
import { useQuery } from "@tanstack/react-query"
import { CgArrowTopRight } from "react-icons/cg";
import PinnedVocabBox from "components/PinnedVocabBox"
import VocabBox from "components/VocabBox"
import PinnedVocabRow from "components/PinnedVocabRow"
import VocabRow from "components/VocabRow"
import AddVocabDialog from "components/AddVocabDialog";
import apiUrl from "config/api"

const ViewVocabsWidget = () => {
  const isQHDScreens = useMediaQuery("(min-width:2500px) and (max-height:1600px)") // 2K Laptops
  const isWideScreens = useMediaQuery("(min-width:3400px) and (max-height:1500px)") // Wide and Ultrawide Desktops

  const viewByLabel = useSelector((state) => state.viewByLabel)
  const viewBySearchTerm = useSelector((state) => state.viewBySearchTerm)
  const token = useSelector((state) => state.token)
  const { _id } = useSelector((state) => state.user)
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;

  const theme = useTheme()

  const getLabeledVocabs = () => {
    return fetch(`${apiUrl}/vocabs/${_id}/label?searchLabel=${viewByLabel}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        return data.sort((a, b) => a.pinyin.localeCompare(b.pinyin));
      });
  };

  const { data: labelData } = useQuery(["labeledVocabsData", viewByLabel], getLabeledVocabs, {
    enabled: viewByLabel?.length > 0,
    keepPreviousData: true,
    staleTime: 500,
  });

  const getSearchVocabs = () => {
    return fetch(`${apiUrl}/vocabs/search/${_id}?searchText=${viewBySearchTerm}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
  }

  const { data: searchData } = useQuery(["searchVocabsData", viewBySearchTerm], getSearchVocabs, {
    enabled: viewBySearchTerm?.length > 0,
    keepPreviousData: true,
    staleTime: 500
  })

  const getPinnedVocabs = (dataArray) => {
    return dataArray?.filter(item => item.pinned === true);
  }

  const pinnedVocabs = getPinnedVocabs(labelData);

  return (
    <>
      {viewBySearchTerm?.length > 0 ?
        <>
          <Stack direction={isLandscape ? "row" : "column"} alignItems={"center"} spacing={isLandscape ? 2 : 0}>
            <Typography fontSize={isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.5rem"} sx={{ marginBottom: "0.5rem" }}>
              Showing results for:
            </Typography>
            <Typography fontSize={isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.75rem"}
              sx={{ marginBottom: "0.5rem", color: theme.palette.primary.main }}
            >
              {viewBySearchTerm}
            </Typography>
          </Stack>
          <VocabBox sx={{ border: searchData?.length < 1 && "none" }}>
            {searchData?.map((vocab) => (
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
            ))}
          </VocabBox>
        </>
        :
        <>
          {pinnedVocabs?.length > 0 && (
            <PinnedVocabBox sx={{ border: labelData?.length < 1 && "none" }}>
              <Stack direction={"row"} spacing={0.5} justifyContent={"space-between"}>
                <Typography sx={{ color: theme.palette.neutral.mid }}>
                  Studying
                </Typography>
                <Typography sx={{ color: theme.palette.primary.main }}>
                  <TbPinFilled size={20} />
                </Typography>
              </Stack>
              {pinnedVocabs?.map((vocab) => (
                <PinnedVocabRow
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
              ))}
            </PinnedVocabBox>
          )}
          <VocabBox sx={{ border: labelData?.length < 1 && "none" }}>
            {labelData?.map((vocab) => (
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
            ))}
            {(isLandscape && labelData?.length === 0) && (
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography fontSize="1.5rem" >Add Vocabulary</Typography>
                <CgArrowTopRight size={24} />
              </Stack>
            )
            }

            {(isPortrait && labelData?.length === 0) && (
              <Stack p={1}>
                <AddVocabDialog text={"Add"} />
              </Stack>
            )}
          </VocabBox>
        </>
      }
    </>
  )
}

export default ViewVocabsWidget