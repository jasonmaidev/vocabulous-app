import { Box } from "@mui/material"
import { styled } from "@mui/system"

const isLandscape = window.matchMedia("(orientation: landscape)").matches;

const PinnedVocabBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  alignItems: "space-between",
  flexWrap: "no-wrap",
  border: "1px solid #7a7a86",
  borderRadius: "1rem",
  padding: isLandscape ? "0.5rem 1rem" : "0.5rem 0.5rem",
  width: isLandscape ? "64%" : "100%",
})

export default PinnedVocabBox