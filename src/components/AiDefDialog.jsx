import { useSelector } from "react-redux"
import { IoCloseSharp } from "react-icons/io5";
import { PiSparkleFill } from "react-icons/pi";
import { useQuery } from "@tanstack/react-query"
import { Typography, Stack, useTheme, IconButton, useMediaQuery } from "@mui/material"
import BarLoader from "react-spinners/BarLoader"
import apiUrl from "config/api"

const AiDefDialog = ({ item, handleDefClose, defOpen }) => {
  const isQHDScreens = useMediaQuery("(min-width:2500px) and (max-height:1600px)") // 2K Laptops
  const isWideScreens = useMediaQuery("(min-width:3400px) and (max-height:1500px)") // Wide and Ultrawide Desktops
  const token = useSelector((state) => state.token)
  const mode = useSelector((state) => state.mode)
  const theme = useTheme()

  const getAiDef = () => {
    return fetch(`${apiUrl}/openai/definition`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Ensure Content-Type is set to JSON
      },
      body: JSON.stringify({ expression: item }), // Send the correct data in the body
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json(); // Parse the response as JSON
      });
  };

  const { data: definitionData, isLoading } = useQuery(["aiDefData", item], getAiDef,
    {
      enabled: !!item && defOpen,
      keepPreviousData: true,
      staleTime: 5000
    }
  );

  return (
    <Stack spacing={1}>
      <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} spacing={0.5}>
        <Typography fontSize={isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.5rem"}>
          {item}
        </Typography>
        <IconButton onClick={handleDefClose}>
          <IoCloseSharp size={24} color={theme.palette.neutral.darker} />
        </IconButton>
      </Stack>
      <Stack direction={"row"} alignItems={"center"} justifyContent={"flex-start"} spacing={1}
        sx={{
          border: "none",
          borderRadius: "0.5rem",
          padding: "1rem",
          backgroundColor: mode === "light" ? "rgba(180, 180, 180, 0.2)" : "rgba(0, 11, 13, 0.45)", // Semi-transparent background
          backdropFilter: "blur(10px)", // Apply the glass effect
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <PiSparkleFill size={16} color={theme.palette.neutral.dark} />
        <Typography
          fontSize={isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.9rem"}
          lineHeight={1.2}
          color={theme.palette.primary.dark}>
          {isLoading ?
            <BarLoader
              color={theme.palette.primary.main}
              loading={true}
              size={16}
              aria-label="Loading Spinner"
              data-testid="loader" />
            :
            definitionData?.data
          }
        </Typography>
      </Stack>
    </Stack>
  )
}

export default AiDefDialog