import "../styles/gradient-button.min.css"
import { v4 as uuidv4 } from "uuid"
import { useState, forwardRef } from "react"
import { useSelector } from "react-redux"
import { IoClose } from "react-icons/io5"
import { FaCircle, FaRegCircle } from "react-icons/fa";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { IoLanguageSharp } from "react-icons/io5";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import {
  Box,
  Stack,
  Button,
  Checkbox,
  Dialog,
  Slide,
  Snackbar,
  InputBase,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import pinyin from "chinese-to-pinyin"
import apiUrl from "config/api"

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function AddVocabDialog({ text }) {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px) and (max-height:2160px)")
  const isQHDScreens = useMediaQuery("(min-width:2500px) and (max-height:1600px)") // 2K Laptops
  const isWideScreens = useMediaQuery("(min-width:3400px) and (max-height:1500px)") // Wide and Ultrawide Desktops
  const isSmallMobileScreens = useMediaQuery("(max-width:800px) and (max-height:800px)")
  const isFullHDScreens = useMediaQuery("(min-width:1800px) and (max-height:2160px)")
  const theme = useTheme()
  const mode = useSelector((state) => state.mode)
  const { _id } = useSelector((state) => state.user)
  const token = useSelector((state) => state.token)
  const queryClient = useQueryClient()

  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;

  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  /* Create Vocab State */
  const [vocabText, setVocabText] = useState("")
  const [requireVocabText, setRequireVocabText] = useState(false)

  const [vocabPinyin, setVocabPinyin] = useState("")
  const convertToPinyin = (chinese) => {
    return pinyin(chinese)
  }
  const [vocabLevel, setVocabLevel] = useState("1")
  const [vocabLevelHover, setVocabLevelHover] = useState("1")

  /* Get Label Data for Edit */
  const getVocabLabels = () => {
    return fetch(`${apiUrl}/labels/${_id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
  }

  const { data: labelsData } = useQuery(["vocabLabelsData"], getVocabLabels, {
    keepPreviousData: true,
    staleTime: 500
  })

  /* Labels Input States */
  const [checkedLabels, setCheckedLabels] = useState([]);
  const [showLabels, setShowLabels] = useState(false)

  // Handle check/uncheck actions
  const handleCheckboxChange = (text) => {
    setCheckedLabels((prevCheckedLabels) =>
      prevCheckedLabels.includes(text)
        ? prevCheckedLabels.filter((label) => label !== text) // Uncheck (remove from array)
        : [...prevCheckedLabels, text] // Check (add to array)
    );
  }
  const [vocabDefinition, setVocabDefinition] = useState("")

  const [vocabSimilarOne, setVocabSimilarOne] = useState("")
  const [vocabSimilarTwo, setVocabSimilarTwo] = useState("")
  const [vocabSimilarThree, setVocabSimilarThree] = useState("")
  const [vocabSimilarFour, setVocabSimilarFour] = useState("")
  const [vocabSimilar, setVocabSimilar] = useState([]) //max 2
  const [vocabSimilarShowCount, setVocabSimilarShowCount] = useState(1)
  const incrementVocabSimilarCount = () => {
    if (vocabSimilarShowCount >= 4) return
    setVocabSimilarShowCount(vocabSimilarShowCount + 1)
  }
  const updateVocabSimilar = () => {
    let newVocabSimilar = [];

    // Check each expression and add to the newVocabSimilar array if its length is greater than 0
    if (vocabSimilarOne.length > 0) {
      newVocabSimilar.push(vocabSimilarOne);
    }
    if (vocabSimilarTwo.length > 0) {
      newVocabSimilar.push(vocabSimilarTwo);
    }
    if (vocabSimilarThree.length > 0) {
      newVocabSimilar.push(vocabSimilarThree);
    }
    if (vocabSimilarFour.length > 0) {
      newVocabSimilar.push(vocabSimilarFour);
    }

    // Update the vocabSimilar state
    setVocabSimilar(newVocabSimilar);
  };

  const [vocabExpressionOne, setVocabExpressionOne] = useState("")
  const [vocabExpressionTwo, setVocabExpressionTwo] = useState("")
  const [vocabExpressionThree, setVocabExpressionThree] = useState("")
  const [vocabExpressionFour, setVocabExpressionFour] = useState("")
  const [vocabExpression, setVocabExpression] = useState([]) // max 4
  const [vocabExpressionShowCount, setVocabExpressionShowCount] = useState(1)
  const incrementVocabExpressionCount = () => {
    if (vocabExpressionShowCount >= 4) return
    setVocabExpressionShowCount(vocabExpressionShowCount + 1)
  }
  const updateVocabExpression = () => {
    let newVocabExpression = [];

    // Check each expression and add to the newVocabExpression array if its length is greater than 0
    if (vocabExpressionOne.length > 0) {
      newVocabExpression.push(vocabExpressionOne);
    }
    if (vocabExpressionTwo.length > 0) {
      newVocabExpression.push(vocabExpressionTwo);
    }
    if (vocabExpressionThree.length > 0) {
      newVocabExpression.push(vocabExpressionThree);
    }
    if (vocabExpressionFour.length > 0) {
      newVocabExpression.push(vocabExpressionFour);
    }

    // Update the vocabExpression state
    setVocabExpression(newVocabExpression);
  };

  const [vocabSentenceOne, setVocabSentenceOne] = useState("")
  const [vocabSentenceTwo, setVocabSentenceTwo] = useState("")
  const [vocabSentence, setVocabSentence] = useState([]) // max 2
  const [vocabSentenceShowTwo, setVocabSentenceShowTwo] = useState(false)
  const updateVocabSentence = () => {
    let newVocabSentence = [];

    // Check each expression and add to the newVocabSentence array if its length is greater than 0
    if (vocabSentenceOne.length > 0) {
      newVocabSentence.push(vocabSentenceOne);
    }
    if (vocabSentenceTwo.length > 0) {
      newVocabSentence.push(vocabSentenceTwo);
    }

    // Update the vocabSentence state
    setVocabSentence(newVocabSentence);
  };

  const [openSnackbar, setOpenSnackbar] = useState(false)
  const handleSnackbarOpen = () => {
    setOpenSnackbar(true)
  }
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setOpenSnackbar(false)
  }
  const createAction = (
    <>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
        <IoClose />
      </IconButton>
    </>
  )

  const createVocabMutation = useMutation({
    mutationFn: async () => {
      return await fetch(`${apiUrl}/vocabs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: _id,
          text: vocabText,
          pinyin: vocabPinyin,
          difficulty: vocabLevel,
          label: checkedLabels,
          definition: vocabDefinition,
          similar: vocabSimilar,
          expression: vocabExpression,
          sentence: vocabSentence
        }),
      })
    },
    onError: (error, _styleName, context) => {
      console.log("Error fetching:" + context.id + error)
    },
    onSettled: () => {
      handleSnackbarOpen()
      queryClient.invalidateQueries({ queryKey: ["allVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["pinnedVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["searchVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["labeledVocabsData"] })
    }
  })

  const handleCreateVocab = () => {
    if (vocabText.length < 1) {
      setRequireVocabText(true)
      return
    }
    updateVocabSimilar()
    updateVocabExpression()
    updateVocabSentence()
    createVocabMutation.mutate()
  }

  return (
    <>
      {isLandscape ? (
        <Button
          startIcon={<IoLanguageSharp size={16} color={theme.palette.neutral.darker} />}
          onClick={handleDialogOpen}
          className={(mode === "light") ? "gradient-button" : "gradient-button-dark"}
          size="medium"
          sx={
            (mode === "light") ?
              {
                color: theme.palette.neutral.dark,
                margin: "0.5rem 1rem",
                padding: "0.5rem 1rem",
                borderRadius: "6rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "none",
                border: `1px solid ${theme.palette.neutral.light}`,
                ":hover": {
                  backgroundColor: theme.palette.background.alt
                }
              }
              :
              {
                color: theme.palette.primary.main,
                margin: "0.5rem 1rem",
                padding: "0.5rem 1rem",
                borderRadius: "6rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "none",
                border: `1px solid ${theme.palette.neutral.light}`,
                ":hover": {
                  backgroundColor: theme.palette.background.alt
                }
              }
          }
        >
          Add
        </Button>)
        :
        (<Button
          onClick={handleDialogOpen}
          className={(mode === "light") ? "gradient-button" : "gradient-button-dark"}
          size="medium"
          sx={
            (mode === "light") ?
              {
                color: theme.palette.neutral.dark,
                margin: "0.5rem 1.75rem",
                padding: "0.5rem 1.75rem",
                borderRadius: "6rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "none",
                border: `1px solid ${theme.palette.neutral.light}`,
                ":hover": {
                  backgroundColor: theme.palette.background.alt
                }
              }
              :
              {
                color: theme.palette.primary.main,
                margin: "0.5rem 1.75rem",
                padding: "0.5rem 1.75rem",
                borderRadius: "6rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "none",
                border: `1px solid ${theme.palette.neutral.light}`,
                ":hover": {
                  backgroundColor: theme.palette.background.alt
                }
              }
          }
        >
          <IoMdAdd />{text}
        </Button>)
      }
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDialogClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          "& .MuiDialog-paper": {
            width: isLandscape ? "20%" : "100%",
            borderRadius: "0.4rem",
            display: "flex",
            backgroundColor: mode === "light" ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 11, 13, 0.2)",
            backgroundImage: `linear-gradient(
                to top left, 
                rgba(255, 255, 255, 0.15), 
                rgba(255, 255, 255, 0.05)
              )`,
            backdropFilter: "blur(10px)", // Apply the glass effect
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          },
          "& .MuiDialog-paperElevation24": {
            boxShadow: "none", // Remove elevation shadows
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundImage: `linear-gradient(
                to right, 
                rgba(3, 241, 232, 0.075), 
                rgba(18, 77, 115, 0.05)
              )`
            },
          },
        }}
      >
        <Box
          margin={!isNonMobileScreens ? "0.25rem 0.25rem 1.5rem 0.25rem" : "1.5rem 1.5rem 2rem 1.5rem"}
          padding={isPortrait ? 1 : "0 0.5rem"}
        >
          <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} pb={2}>
            <Typography
              variant={isSmallMobileScreens ? "h6" : isNonMobileScreens ? "h4" : "h5"}
              fontWeight={700}
            >
              Create Vocabulary
            </Typography>
            <IoMdClose size={24} style={{ cursor: "pointer", color: theme.palette.neutral.main }} onClick={handleDialogClose} />
          </Stack>


          <Stack spacing={1.5}>

            {/* ----- Chinese Text Input Field ----- */}
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Typography>Text</Typography>
              <InputBase
                id={uuidv4()}
                placeholder="中文字"
                onChange={(e) => setVocabText(e.target.value)}
                value={vocabText}
                onKeyUp={() => setTimeout(() => {
                  setVocabPinyin(convertToPinyin(vocabText))
                }, 100)}
                onKeyDown={() => setRequireVocabText(false)}
                required={true}
                sx={{
                  fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                  width: "100%",
                  color: theme.palette.neutral.dark,
                  borderRadius: "0.5rem",
                  padding: "0.25rem 0.5rem",
                  margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem",
                  border: requireVocabText ? `solid 2px ${theme.palette.secondary.main}` : `solid 1px ${theme.palette.neutral.light}`,
                }}
              />
            </Stack>

            {/* ----- Pinyin ----- */}
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Typography>Pinyin</Typography>
              <InputBase
                id={uuidv4()}
                placeholder={vocabPinyin}
                onChange={(e) => setVocabPinyin(e.target.value)}
                value={vocabPinyin}
                required={true}
                sx={{
                  width: "100%",
                  color: theme.palette.neutral.dark,
                  border: `solid 1px ${theme.palette.neutral.light}`,
                  borderRadius: "0.5rem",
                  padding: "0.25rem 0.5rem",
                  margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                }}
              />
            </Stack>


            {/* ----- Difficulty Field ----- */}
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Typography>Difficulty</Typography>
              <Stack direction={"row"}>
                <IconButton
                  onMouseOver={() => setVocabLevelHover("1")}
                  onMouseLeave={() => setVocabLevelHover("1")}
                  onClick={() => setVocabLevel("1")}
                >
                  {(vocabLevelHover === "1" ||
                    vocabLevel === "1" ||
                    vocabLevel === "2" ||
                    vocabLevel === "3") ?
                    <FaCircle
                      size={24}
                      style={mode === "dark" ? {
                        color: vocabLevel === "1" ?
                          theme.palette.neutral.darker :
                          vocabLevel === "2" ?
                            theme.palette.tertiary.main :
                            theme.palette.secondary.main
                      } :
                        {
                          color: vocabLevel === "1" ?
                            theme.palette.neutral.main :
                            vocabLevel === "2" ?
                              theme.palette.tertiary.main :
                              theme.palette.secondary.main
                        }
                      }
                    /> :
                    <FaRegCircle
                      size={24}
                      style={mode === "dark" ? {
                        color: vocabLevel === "1" ?
                          theme.palette.neutral.darker :
                          vocabLevel === "2" ?
                            theme.palette.tertiary.main :
                            theme.palette.secondary.main
                      } :
                        {
                          color: vocabLevel === "1" ?
                            theme.palette.neutral.main :
                            vocabLevel === "2" ?
                              theme.palette.tertiary.main :
                              theme.palette.secondary.main
                        }
                      }
                    />
                  }
                </IconButton>
                <IconButton
                  onMouseOver={() => setVocabLevelHover("2")}
                  onMouseLeave={() => setVocabLevelHover("1")}
                  onClick={() => setVocabLevel("2")}
                >
                  {(vocabLevelHover === "2" ||
                    vocabLevel === "2" ||
                    vocabLevel === "3" ||
                    vocabLevelHover === "3") ?
                    <FaCircle
                      size={24}
                      style={mode === "dark" ? {
                        color: vocabLevel === "1" ?
                          theme.palette.neutral.darker :
                          vocabLevel === "2" ?
                            theme.palette.tertiary.main :
                            theme.palette.secondary.main
                      } :
                        {
                          color: vocabLevel === "1" ?
                            theme.palette.neutral.main :
                            vocabLevel === "2" ?
                              theme.palette.tertiary.main :
                              theme.palette.secondary.main
                        }
                      }
                    /> :
                    <FaRegCircle
                      size={24}
                      style={mode === "dark" ? {
                        color: vocabLevel === "1" ?
                          theme.palette.neutral.darker :
                          vocabLevel === "2" ?
                            theme.palette.tertiary.main :
                            theme.palette.secondary.main
                      } :
                        {
                          color: vocabLevel === "1" ?
                            theme.palette.neutral.main :
                            vocabLevel === "2" ?
                              theme.palette.tertiary.main :
                              theme.palette.secondary.main
                        }
                      }
                    />
                  }
                </IconButton>
                <IconButton
                  onMouseOver={() => setVocabLevelHover("3")}
                  onMouseLeave={() => setVocabLevelHover("1")}
                  onClick={() => setVocabLevel("3")}
                >
                  {(vocabLevelHover === "3" || vocabLevel === "3") ?
                    <FaCircle
                      size={24}
                      style={mode === "dark" ? {
                        color: vocabLevel === "1" ?
                          theme.palette.neutral.darker :
                          vocabLevel === "2" ?
                            theme.palette.tertiary.main :
                            theme.palette.secondary.main
                      } :
                        {
                          color: vocabLevel === "1" ?
                            theme.palette.neutral.main :
                            vocabLevel === "2" ?
                              theme.palette.tertiary.main :
                              theme.palette.secondary.main
                        }}
                    /> :
                    <FaRegCircle
                      size={24}
                      style={mode === "dark" ? {
                        color: vocabLevel === "1" ?
                          theme.palette.neutral.darker :
                          vocabLevel === "2" ?
                            theme.palette.tertiary.main :
                            theme.palette.secondary.light
                      } :
                        {
                          color: vocabLevel === "1" ?
                            theme.palette.neutral.main :
                            vocabLevel === "2" ?
                              theme.palette.tertiary.main :
                              theme.palette.secondary.light
                        }
                      }
                    />
                  }
                </IconButton>
              </Stack>
            </Stack>

            {/* ----- Label Field ----- */}
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Typography>Label</Typography>
              {showLabels ?
                <Stack direction={"row"} flexWrap={"wrap"} sx={{ p: 0.25 }}>
                  {labelsData?.[0].label.map((text, index) => (
                    <Stack key={index} direction="row" spacing={0} p={"0.125rem 0.5rem"} alignItems={"center"} sx={{ cursor: "pointer" }}>
                      <Checkbox
                        color="primary"
                        value={text}
                        checked={checkedLabels?.includes(text)} // Control the checked state
                        onChange={() => handleCheckboxChange(text)} // Handle checkbox change
                        sx={{
                          p: 0.5,
                        }}
                      />
                      <Typography
                        onClick={() => handleCheckboxChange(text)}
                        color={checkedLabels?.includes(text) ? theme.palette.primary.main : theme.palette.neutral.darker}
                        fontSize={isWideScreens ? "1.25rem" : isQHDScreens ? "1rem" : "0.8rem"}
                      >
                        {text}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
                :
                <Button
                  startIcon={<MdOutlineRemoveRedEye size={16} color={theme.palette.neutral.darker} />}
                  onClick={() => setShowLabels(true)}
                  className={(mode === "light") ? "gradient-button" : "gradient-button-dark"}
                  size="medium"
                  sx={
                    (mode === "light") ?
                      {
                        color: theme.palette.neutral.dark,
                        margin: "0.5rem 1rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "6rem",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "none",
                        border: `1px solid ${theme.palette.neutral.light}`,
                        ":hover": {
                          backgroundColor: theme.palette.background.alt
                        }
                      }
                      :
                      {
                        color: theme.palette.primary.main,
                        margin: "0.5rem 1rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "6rem",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "none",
                        border: `1px solid ${theme.palette.neutral.light}`,
                        ":hover": {
                          backgroundColor: theme.palette.background.alt
                        }
                      }
                  }
                >
                  Show
                </Button>
              }

            </Stack>

            {/* ----- Definition Field ----- */}
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Typography>Definition</Typography>
              <InputBase
                id={uuidv4()}
                placeholder=""
                onChange={(e) => setVocabDefinition(e.target.value)}
                value={vocabDefinition}
                multiline={true}
                minRows={2}
                required={true}
                sx={{
                  fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                  width: "100%",
                  color: theme.palette.neutral.dark,
                  border: `solid 1px ${theme.palette.neutral.light}`,
                  borderRadius: "0.5rem",
                  padding: "0.25rem 0.5rem",
                  margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                }}
              />
            </Stack>

            {/* ----- Similar Text Input Field ----- */}
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Stack>
                <Typography>Similar</Typography>
                <Typography fontSize={"0.5rem"} color={theme.palette.neutral.mid}>Max 4</Typography>
              </Stack>
              <InputBase
                id={uuidv4()}
                placeholder="中文字"
                onChange={(e) => setVocabSimilarOne(e.target.value)}
                value={vocabSimilarOne}
                required={true}
                sx={{
                  fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                  width: "80%",
                  color: theme.palette.neutral.dark,
                  border: `solid 1px ${theme.palette.neutral.light}`,
                  borderRadius: "0.5rem",
                  padding: "0.25rem 0.5rem",
                  margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                }}
              />
              <IconButton onClick={incrementVocabSimilarCount}>
                <IoMdAdd size={16} />
              </IconButton>
            </Stack>

            {/* ----- 2nd Similar Text Input Field ----- */}
            {vocabSimilarShowCount > 1 && (
              <Stack direction={"row"} alignItems={"center"} spacing={2}>
                <Typography sx={{ opacity: 0 }}>Similar</Typography>
                <InputBase
                  id={uuidv4()}
                  placeholder="中文字"
                  onChange={(e) => setVocabSimilarTwo(e.target.value)}
                  value={vocabSimilarTwo}
                  required={true}
                  sx={{
                    fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                    width: "80%",
                    color: theme.palette.neutral.dark,
                    border: `solid 1px ${theme.palette.neutral.light}`,
                    borderRadius: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                  }}
                />
                <IconButton onClick={() => setVocabSimilarShowCount(vocabSimilarShowCount - 1)}>
                  <IoMdClose size={16} />
                </IconButton>
              </Stack>
            )}

            {/* ----- 3rd Similar Text Input Field ----- */}
            {vocabSimilarShowCount > 2 && (
              <Stack direction={"row"} alignItems={"center"} spacing={2}>
                <Typography sx={{ opacity: 0 }}>Similar</Typography>
                <InputBase
                  id={uuidv4()}
                  placeholder="中文字"
                  onChange={(e) => setVocabSimilarThree(e.target.value)}
                  value={vocabSimilarThree}
                  required={true}
                  sx={{
                    fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                    width: "80%",
                    color: theme.palette.neutral.dark,
                    border: `solid 1px ${theme.palette.neutral.light}`,
                    borderRadius: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                  }}
                />
                <IconButton onClick={() => setVocabSimilarShowCount(vocabSimilarShowCount - 1)}>
                  <IoMdClose size={16} />
                </IconButton>
              </Stack>
            )}

            {/* ----- 4th Similar Text Input Field ----- */}
            {vocabSimilarShowCount > 3 && (
              <Stack direction={"row"} alignItems={"center"} spacing={2}>
                <Typography sx={{ opacity: 0 }}>Similar</Typography>
                <InputBase
                  id={uuidv4()}
                  placeholder="中文字"
                  onChange={(e) => setVocabSimilarFour(e.target.value)}
                  value={vocabSimilarFour}
                  required={true}
                  sx={{
                    fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                    width: "80%",
                    color: theme.palette.neutral.dark,
                    border: `solid 1px ${theme.palette.neutral.light}`,
                    borderRadius: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                  }}
                />
                <IconButton onClick={() => setVocabSimilarShowCount(vocabSimilarShowCount - 1)}>
                  <IoMdClose size={16} />
                </IconButton>
              </Stack>
            )}

            {/* ----- Expression Text Input Field ----- */}
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Stack>
                <Typography>Expression</Typography>
                <Typography fontSize={"0.5rem"} color={theme.palette.neutral.mid}>Max 4</Typography>
              </Stack>
              <InputBase
                id={uuidv4()}
                placeholder="中文字"
                onChange={(e) => setVocabExpressionOne(e.target.value)}
                value={vocabExpressionOne}
                required={true}
                sx={{
                  fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                  width: "80%",
                  color: theme.palette.neutral.dark,
                  border: `solid 1px ${theme.palette.neutral.light}`,
                  borderRadius: "0.5rem",
                  padding: "0.25rem 0.5rem",
                  margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                }}
              />
              <IconButton onClick={incrementVocabExpressionCount}>
                <IoMdAdd size={16} />
              </IconButton>
            </Stack>


            {/* ----- 2nd Expression Text Input Field ----- */}
            {vocabExpressionShowCount > 1 && (
              <Stack direction={"row"} alignItems={"center"} spacing={2}>
                <Typography sx={{ opacity: 0 }}>Expression</Typography>
                <InputBase
                  id={uuidv4()}
                  placeholder="中文字"
                  onChange={(e) => setVocabExpressionTwo(e.target.value)}
                  value={vocabExpressionTwo}
                  required={true}
                  sx={{
                    fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                    width: "80%",
                    color: theme.palette.neutral.dark,
                    border: `solid 1px ${theme.palette.neutral.light}`,
                    borderRadius: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                  }}
                />
                <IconButton onClick={() => setVocabExpressionShowCount(vocabExpressionShowCount - 1)}>
                  <IoMdClose size={16} />
                </IconButton>
              </Stack>
            )}

            {/* ----- 3rd Expression Text Input Field ----- */}
            {vocabExpressionShowCount > 2 && (
              <Stack direction={"row"} alignItems={"center"} spacing={2}>
                <Typography sx={{ opacity: 0 }}>Expression</Typography>
                <InputBase
                  id={uuidv4()}
                  placeholder="中文字"
                  onChange={(e) => setVocabExpressionThree(e.target.value)}
                  value={vocabExpressionThree}
                  required={true}
                  sx={{
                    fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                    width: "80%",
                    color: theme.palette.neutral.dark,
                    border: `solid 1px ${theme.palette.neutral.light}`,
                    borderRadius: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                  }}
                />
                <IconButton onClick={() => setVocabExpressionShowCount(vocabExpressionShowCount - 1)}>
                  <IoMdClose size={16} />
                </IconButton>
              </Stack>
            )}

            {/* ----- 4th Expression Text Input Field ----- */}
            {vocabExpressionShowCount > 3 && (
              <Stack direction={"row"} alignItems={"center"} spacing={2}>
                <Typography sx={{ opacity: 0 }}>Expression</Typography>
                <InputBase
                  id={uuidv4()}
                  placeholder="中文字"
                  onChange={(e) => setVocabExpressionFour(e.target.value)}
                  value={vocabExpressionFour}
                  required={true}
                  sx={{
                    fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                    width: "80%",
                    color: theme.palette.neutral.dark,
                    border: `solid 1px ${theme.palette.neutral.light}`,
                    borderRadius: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                  }}
                />
                <IconButton onClick={() => setVocabExpressionShowCount(vocabExpressionShowCount - 1)}>
                  <IoMdClose size={16} />
                </IconButton>
              </Stack>
            )}

            {/* ----- Sentence Text Input Field ----- */}
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Stack>
                <Typography>Sentence</Typography>
                <Typography fontSize={"0.5rem"} color={theme.palette.neutral.mid} >Max 2</Typography>
              </Stack>
              <InputBase
                id={uuidv4()}
                placeholder="中文句子"
                onChange={(e) => setVocabSentenceOne(e.target.value)}
                value={vocabSentenceOne}
                multiline={true}
                minRows={2}
                required={true}
                sx={{
                  fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                  width: "80%",
                  color: theme.palette.neutral.dark,
                  border: `solid 1px ${theme.palette.neutral.light}`,
                  borderRadius: "0.5rem",
                  padding: "0.25rem 0.5rem",
                  margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                }}
              />
              <IconButton onClick={() => setVocabSentenceShowTwo(true)}>
                <IoMdAdd size={16} />
              </IconButton>
            </Stack>

            {/* ----- 2nd Sentence Text Input Field ----- */}
            {vocabSentenceShowTwo && (
              <Stack direction={"row"} alignItems={"center"} spacing={2}>
                <Typography sx={{ opacity: 0 }}>Sentence</Typography>
                <InputBase
                  id={uuidv4()}
                  placeholder="中文句子"
                  onChange={(e) => setVocabSentenceTwo(e.target.value)}
                  value={vocabSentenceTwo}
                  multiline={true}
                  minRows={2}
                  required={true}
                  sx={{
                    fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                    width: "80%",
                    color: theme.palette.neutral.dark,
                    border: `solid 1px ${theme.palette.neutral.light}`,
                    borderRadius: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                  }}
                />
                <IconButton onClick={() => setVocabSentenceShowTwo(false)}>
                  <IoMdClose size={16} />
                </IconButton>
              </Stack>
            )}

            <Box margin={2} display={"flex"} justifyContent={"center"}>
              <Button
                onClick={handleCreateVocab}
                sx={{
                  padding: "1rem 4rem",
                  borderRadius: "6rem",
                  fontWeight: 600,
                  color: theme.palette.background.alt,
                  borderColor: theme.palette.neutral.dark,
                  backgroundColor: theme.palette.neutral.dark,
                  "&:hover": {
                    color: theme.palette.neutral.lighter,
                    backgroundColor: theme.palette.primary.main
                  }
                }}
              >
                Create
              </Button>
            </Box>
          </Stack>

        </Box>
      </Dialog>

      {/* ----- Snackbar on Guest Styles Limit Reached ----- */}
      <div>
        <Snackbar
          sx={{ height: "auto", zIndex: 10000 }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          message="Vocabulary Created!"
          action={createAction}
        />
      </div>
    </>
  );
}
