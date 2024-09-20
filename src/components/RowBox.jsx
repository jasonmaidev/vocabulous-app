import { Box } from "@mui/material"
import { styled } from "@mui/system"

const RowBox = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "no-wrap",
  padding: "0.5rem 1rem",
  width: "100%"
})

export default RowBox