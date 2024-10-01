import "../styles/gradient-button.min.css"
import { v4 as uuidv4 } from "uuid"
import { useState, forwardRef } from "react"
import { useSelector } from "react-redux"
import { IoClose } from "react-icons/io5"
import { FaCircle, FaRegCircle } from "react-icons/fa";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { IoLanguageSharp, IoRefresh } from "react-icons/io5";
import { PiSparkleFill, PiSparkle } from "react-icons/pi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import HashLoader from "react-spinners/HashLoader"
import {
  Box,
  Stack,
  Button,
  Checkbox,
  Tooltip,
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
  const [vocabSimilar, setVocabSimilar] = useState([]) //max 4
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

  const [generatingSim, setGeneratingSim] = useState(false)
  const [showRegenSimOne, setShowRegenSimOne] = useState(false)
  const [showRegenSimTwo, setShowRegenSimTwo] = useState(false)
  const [showRegenSimThree, setShowRegenSimThree] = useState(false)
  const [showRegenSimFour, setShowRegenSimFour] = useState(false)
  const [generatedAiSim, setGeneratedAiSim] = useState(false)

  const genSimTwo = () => {
    if (genSimData) {
      const randomIndex = Math.floor(Math.random() * genSimData.similar.length);
      setVocabSimilarTwo(genSimData.similar[randomIndex])
    }
  }
  const clearSimilarTwo = () => {
    setVocabSimilarTwo("")
    setVocabSimilarShowCount(vocabSimilarShowCount - 1)
  }
  const genSimThree = () => {
    if (genSimData) {
      const randomIndex = Math.floor(Math.random() * genSimData.similar.length);
      setVocabSimilarThree(genSimData.similar[randomIndex])
    }
  }
  const clearSimilarThree = () => {
    setVocabSimilarThree("")
    setVocabSimilarShowCount(vocabSimilarShowCount - 1)
  }
  const genSimFour = () => {
    if (genSimData) {
      const randomIndex = Math.floor(Math.random() * genSimData.similar.length);
      setVocabSimilarFour(genSimData.similar[randomIndex])
    }
  }
  const clearSimilarFour = () => {
    setVocabSimilarFour("")
    setVocabSimilarShowCount(vocabSimilarShowCount - 1)
  }
  /* Generate Ai Similars Data */
  const getGenSim = () => {
    return fetch(`${apiUrl}/openai/similar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Ensure Content-Type is set to JSON
      },
      body: JSON.stringify({ simVocab: vocabText, simLabel: checkedLabels }), // Send the correct data in the body
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json(); // Parse the response as JSON
      });
  };

  const { data: genSimData } = useQuery(["aiSimData", vocabText], getGenSim,
    {
      enabled: !!vocabText && generatingSim, // Ensure that vocabText is not empty
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  const generateAiSimilars = useMutation({
    mutationFn: async () => {
      return await fetch(`${apiUrl}/openai/similar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          simVocab: vocabText,
          simLabel: checkedLabels
        }),
      }).then((res) => res.json()); // Ensure the response is parsed as JSON
    },
    onError: (error, _styleName, context) => {
      console.log("Error fetching:" + context?.id + error);
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: ["aiSimData"] });

      setGeneratedAiSim(true);

      if (data?.similar) {
        setVocabSimilarOne(data.similar[0]);
        if (vocabSimilarShowCount === 4) {
          setVocabSimilarFour(data.similar[3]);
          setVocabSimilarThree(data.similar[2]);
          setVocabSimilarTwo(data.similar[1]);
          setVocabSimilarOne(data.similar[0]);
        }
        if (vocabSimilarShowCount === 3) {
          setVocabSimilarThree(data.similar[2]);
          setVocabSimilarTwo(data.similar[1]);
          setVocabSimilarOne(data.similar[0]);
        }
        if (vocabSimilarShowCount === 2) {
          setVocabSimilarTwo(data.similar[1]);
          setVocabSimilarOne(data.similar[0]);
        }
      }

      setGeneratingSim(false)
    },
  });

  const handleGenAiSim = () => {
    setGeneratingSim(true)
    if (vocabText.length < 1) {
      setRequireVocabText(true)
      return
    }
    generateAiSimilars.mutate()
  }

  const [vocabExpressionOne, setVocabExpressionOne] = useState("")
  const [vocabExpressionTwo, setVocabExpressionTwo] = useState("")
  const [vocabExpressionThree, setVocabExpressionThree] = useState("")
  const [vocabExpressionFour, setVocabExpressionFour] = useState("")
  const [vocabExpressionFive, setVocabExpressionFive] = useState("")
  const [vocabExpressionSix, setVocabExpressionSix] = useState("")
  const [vocabExpressionSeven, setVocabExpressionSeven] = useState("")
  const [vocabExpressionEight, setVocabExpressionEight] = useState("")
  const [vocabExpression, setVocabExpression] = useState([]) // max 8
  const [vocabExpressionShowCount, setVocabExpressionShowCount] = useState(1)
  const incrementVocabExpressionCount = () => {
    if (vocabExpressionShowCount >= 8) return
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
    if (vocabExpressionFive.length > 0) {
      newVocabExpression.push(vocabExpressionFive);
    }
    if (vocabExpressionSix.length > 0) {
      newVocabExpression.push(vocabExpressionSix);
    }
    if (vocabExpressionSeven.length > 0) {
      newVocabExpression.push(vocabExpressionSeven);
    }
    if (vocabExpressionEight.length > 0) {
      newVocabExpression.push(vocabExpressionEight);
    }

    // Update the vocabExpression state
    setVocabExpression(newVocabExpression);
  };

  const [generatingExp, setGeneratingExp] = useState(false)
  const [showRegenExpOne, setShowRegenExpOne] = useState(false)
  const [showRegenExpTwo, setShowRegenExpTwo] = useState(false)
  const [showRegenExpThree, setShowRegenExpThree] = useState(false)
  const [showRegenExpFour, setShowRegenExpFour] = useState(false)
  const [showRegenExpFive, setShowRegenExpFive] = useState(false)
  const [showRegenExpSix, setShowRegenExpSix] = useState(false)
  const [showRegenExpSeven, setShowRegenExpSeven] = useState(false)
  const [showRegenExpEight, setShowRegenExpEight] = useState(false)
  const [generatedAiExp, setGeneratedAiExp] = useState(false)

  const genExpTwo = () => {
    if (genExpData) {
      const randomIndex = Math.floor(Math.random() * genExpData.expressions.length);
      setVocabExpressionTwo(genExpData.expressions[randomIndex])
    }
  }
  const clearExpressionTwo = () => {
    setVocabExpressionTwo("")
    setVocabExpressionShowCount(vocabExpressionShowCount - 1)
  }
  const genExpThree = () => {
    if (genExpData) {
      const randomIndex = Math.floor(Math.random() * genExpData.expressions.length);
      setVocabExpressionThree(genExpData.expressions[randomIndex])
    }
  }
  const clearExpressionThree = () => {
    setVocabExpressionThree("")
    setVocabExpressionShowCount(vocabExpressionShowCount - 1)
  }
  const genExpFour = () => {
    if (genExpData) {
      const randomIndex = Math.floor(Math.random() * genExpData.expressions.length);
      setVocabExpressionFour(genExpData.expressions[randomIndex])
    }
  }
  const clearExpressionFour = () => {
    setVocabExpressionFour("")
    setVocabExpressionShowCount(vocabExpressionShowCount - 1)
  }
  const genExpFive = () => {
    if (genExpData) {
      const randomIndex = Math.floor(Math.random() * genExpData.expressions.length);
      setVocabExpressionFive(genExpData.expressions[randomIndex])
    }
  }
  const clearExpressionFive = () => {
    setVocabExpressionFive("")
    setVocabExpressionShowCount(vocabExpressionShowCount - 1)
  }
  const genExpSix = () => {
    if (genExpData) {
      const randomIndex = Math.floor(Math.random() * genExpData.expressions.length);
      setVocabExpressionSix(genExpData.expressions[randomIndex])
    }
  }
  const clearExpressionSix = () => {
    setVocabExpressionSix("")
    setVocabExpressionShowCount(vocabExpressionShowCount - 1)
  }
  const genExpSeven = () => {
    if (genExpData) {
      const randomIndex = Math.floor(Math.random() * genExpData.expressions.length);
      setVocabExpressionSeven(genExpData.expressions[randomIndex])
    }
  }
  const clearExpressionSeven = () => {
    setVocabExpressionSeven("")
    setVocabExpressionShowCount(vocabExpressionShowCount - 1)
  }
  const genExpEight = () => {
    if (genExpData) {
      const randomIndex = Math.floor(Math.random() * genExpData.expressions.length);
      setVocabExpressionEight(genExpData.expressions[randomIndex])
    }
  }
  const clearExpressionEight = () => {
    setVocabExpressionEight("")
    setVocabExpressionShowCount(vocabExpressionShowCount - 1)
  }

  /* Generate Ai Expressions Data */
  const getGenExp = () => {
    return fetch(`${apiUrl}/openai/expressions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Ensure Content-Type is set to JSON
      },
      body: JSON.stringify({ expVocab: vocabText }), // Send the correct data in the body
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json(); // Parse the response as JSON
      });
  };

  const { data: genExpData } = useQuery(["aiExpData", vocabText], getGenExp,
    {
      enabled: !!vocabText && generatingExp, // Ensure that vocabText is not empty
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  const generateAiExpressions = useMutation({
    mutationFn: async () => {
      return await fetch(`${apiUrl}/openai/expressions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expVocab: vocabText,
        }),
      }).then((res) => res.json()); // Ensure the response is parsed as JSON
    },
    onError: (error, _styleName, context) => {
      console.log("Error fetching:" + context?.id + error);
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: ["aiExpData"] });

      setGeneratedAiExp(true);

      if (data?.expressions) {
        setVocabExpressionOne(data.expressions[0]);
        if (vocabExpressionShowCount === 8) {
          setVocabExpressionEight(data.expressions[7]);
          setVocabExpressionSeven(data.expressions[6]);
          setVocabExpressionSix(data.expressions[5]);
          setVocabExpressionFive(data.expressions[4]);
          setVocabExpressionFour(data.expressions[3]);
          setVocabExpressionThree(data.expressions[2]);
          setVocabExpressionTwo(data.expressions[1]);
          setVocabExpressionOne(data.expressions[0]);
        }
        if (vocabExpressionShowCount === 7) {
          setVocabExpressionSeven(data.expressions[6]);
          setVocabExpressionSix(data.expressions[5]);
          setVocabExpressionFive(data.expressions[4]);
          setVocabExpressionFour(data.expressions[3]);
          setVocabExpressionThree(data.expressions[2]);
          setVocabExpressionTwo(data.expressions[1]);
          setVocabExpressionOne(data.expressions[0]);
        }
        if (vocabExpressionShowCount === 6) {
          setVocabExpressionSix(data.expressions[5]);
          setVocabExpressionFive(data.expressions[4]);
          setVocabExpressionFour(data.expressions[3]);
          setVocabExpressionThree(data.expressions[2]);
          setVocabExpressionTwo(data.expressions[1]);
          setVocabExpressionOne(data.expressions[0]);
        }
        if (vocabExpressionShowCount === 5) {
          setVocabExpressionFive(data.expressions[4]);
          setVocabExpressionFour(data.expressions[3]);
          setVocabExpressionThree(data.expressions[2]);
          setVocabExpressionTwo(data.expressions[1]);
          setVocabExpressionOne(data.expressions[0]);
        }
        if (vocabExpressionShowCount === 4) {
          setVocabExpressionFour(data.expressions[3]);
          setVocabExpressionThree(data.expressions[2]);
          setVocabExpressionTwo(data.expressions[1]);
          setVocabExpressionOne(data.expressions[0]);
        }
        if (vocabExpressionShowCount === 3) {
          setVocabExpressionThree(data.expressions[2]);
          setVocabExpressionTwo(data.expressions[1]);
          setVocabExpressionOne(data.expressions[0]);
        }
        if (vocabExpressionShowCount === 2) {
          setVocabExpressionTwo(data.expressions[1]);
          setVocabExpressionOne(data.expressions[0]);
        }
      }

      setGeneratingExp(false)
    },
  });

  const handleGenAiExp = () => {
    setGeneratingExp(true)
    if (vocabText.length < 1) {
      setRequireVocabText(true)
      return
    }
    generateAiExpressions.mutate()
  }

  const [vocabSentenceOne, setVocabSentenceOne] = useState("")
  const [vocabSentenceTwo, setVocabSentenceTwo] = useState("")
  const [vocabSentenceThree, setVocabSentenceThree] = useState("")
  const [vocabSentenceFour, setVocabSentenceFour] = useState("")
  const [vocabSentence, setVocabSentence] = useState([]) // max 4
  const [vocabSentenceShowCount, setVocabSentenceShowCount] = useState(1)
  const incrementVocabSentenceCount = () => {
    if (vocabSentenceShowCount >= 4) return
    setVocabSentenceShowCount(vocabSentenceShowCount + 1)
  }
  const updateVocabSentence = () => {
    let newVocabSentence = [];

    // Check each expression and add to the newVocabSentence array if its length is greater than 0
    if (vocabSentenceOne.length > 0) {
      newVocabSentence.push(vocabSentenceOne);
    }
    if (vocabSentenceTwo.length > 0) {
      newVocabSentence.push(vocabSentenceTwo);
    }
    if (vocabSentenceThree.length > 0) {
      newVocabSentence.push(vocabSentenceThree);
    }
    if (vocabSentenceFour.length > 0) {
      newVocabSentence.push(vocabSentenceFour);
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
      queryClient.invalidateQueries({ queryKey: ["intVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["advVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["searchVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["labeledVocabsData"] })
      setVocabPinyin("")
      setVocabDefinition("")
      setVocabSimilarOne("")
      setVocabSimilarTwo("")
      setVocabSimilarThree("")
      setVocabSimilarFour("")
      setVocabExpressionOne("")
      setVocabExpressionTwo("")
      setVocabExpressionThree("")
      setVocabExpressionFour("")
      setVocabExpressionFive("")
      setVocabExpressionSix("")
      setVocabExpressionSeven("")
      setVocabExpressionEight("")
      setVocabSentenceOne("")
      setVocabSentenceTwo("")
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
            <Stack direction={"row"} alignItems={"center"} spacing={showLabels ? 1 : 2}>
              {showLabels ?
                <IconButton onClick={() => setShowLabels(false)}>
                  <AiOutlineEyeInvisible size={16} color={theme.palette.neutral.darker} />
                </IconButton>
                :
                <Typography>Label</Typography>
              }
              {showLabels ?
                <Stack direction={"row"} flexWrap={"wrap"} sx={{ p: 0.25 }}>
                  {labelsData?.[0].label.map((text, index) => (
                    <Stack key={index} direction="row" spacing={0} p={"0.125rem 0.25rem"} alignItems={"center"} sx={{ cursor: "pointer" }}>
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
                  startIcon={<AiOutlineEye size={16} color={theme.palette.neutral.darker} />}
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
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <Stack>
                <Typography>Similar</Typography>
                <Typography fontSize={"0.5rem"} color={theme.palette.neutral.mid}>Max 4</Typography>
              </Stack>
              <InputBase
                id={uuidv4()}
                placeholder="相似意思"
                onChange={(e) => setVocabSimilarOne(e.target.value)}
                value={vocabSimilarOne}
                required={true}
                sx={{
                  fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                  width: isLandscape ? "75%" : "70%",
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
              {(vocabSimilarOne?.length < 1 && generatingSim) ?
                (
                  <HashLoader
                    color={theme.palette.primary.main}
                    loading={true}
                    size={16}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                )
                :
                (
                  <Stack
                    onMouseOver={() => setShowRegenSimOne(true)}
                    onMouseLeave={() => setShowRegenSimOne(false)}
                  >
                    {(showRegenSimOne && vocabSimilarOne?.length > 1) ?
                      <Tooltip title="Regenerate All" placement="right">
                        <IconButton onClick={handleGenAiSim}>
                          <IoRefresh size={16} />
                        </IconButton>
                      </Tooltip>
                      :
                      <Tooltip title="Generate with Ai" placement="right">
                        <IconButton onClick={handleGenAiSim}>
                          {vocabSimilarOne?.length < 1 ?
                            <PiSparkle size={16} />
                            :
                            <PiSparkleFill size={16} />
                          }
                        </IconButton>
                      </Tooltip>
                    }
                  </Stack>
                )
              }
            </Stack>

            {/* ----- 2nd Similar Text Input Field ----- */}
            {vocabSimilarShowCount > 1 && (
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <Typography sx={{ opacity: 0 }}>Similar</Typography>
                <InputBase
                  id={uuidv4()}
                  placeholder="相似意思"
                  onChange={(e) => setVocabSimilarTwo(e.target.value)}
                  value={vocabSimilarTwo}
                  required={true}
                  sx={{
                    fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                    width: isLandscape ? "75%" : "70%",
                    color: theme.palette.neutral.dark,
                    border: `solid 1px ${theme.palette.neutral.light}`,
                    borderRadius: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                  }}
                />
                <IconButton onClick={clearSimilarTwo}>
                  <IoMdClose size={16} />
                </IconButton>
                {generatedAiSim && (
                  <>
                    {(vocabSimilarTwo?.length < 1 && generatingSim) ?
                      (
                        <HashLoader
                          color={theme.palette.primary.main}
                          loading={true}
                          size={16}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                      )
                      :
                      (
                        <Stack
                          onMouseOver={() => setShowRegenSimTwo(true)}
                          onMouseLeave={() => setShowRegenSimTwo(false)}
                        >
                          {(showRegenSimTwo && vocabSimilarTwo?.length > 1) ?
                            <Tooltip title="Regenerate" placement="right">
                              <IconButton onClick={genSimTwo}>
                                <IoRefresh size={16} />
                              </IconButton>
                            </Tooltip>
                            :
                            <Tooltip title="Generate" placement="right">
                              <IconButton onClick={genSimTwo}>
                                {vocabSimilarTwo?.length < 1 ?
                                  <PiSparkle size={16} />
                                  :
                                  <PiSparkleFill size={16} />
                                }
                              </IconButton>
                            </Tooltip>
                          }
                        </Stack>
                      )
                    }
                  </>
                )}
              </Stack>
            )}

            {/* ----- 3rd Similar Text Input Field ----- */}
            {vocabSimilarShowCount > 2 && (
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <Typography sx={{ opacity: 0 }}>Similar</Typography>
                <InputBase
                  id={uuidv4()}
                  placeholder="相似意思"
                  onChange={(e) => setVocabSimilarThree(e.target.value)}
                  value={vocabSimilarThree}
                  required={true}
                  sx={{
                    fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                    width: isLandscape ? "75%" : "70%",
                    color: theme.palette.neutral.dark,
                    border: `solid 1px ${theme.palette.neutral.light}`,
                    borderRadius: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                  }}
                />
                <IconButton onClick={clearSimilarThree}>
                  <IoMdClose size={16} />
                </IconButton>
                {generatedAiSim && (
                  <>
                    {(vocabSimilarThree?.length < 1 && generatingSim) ?
                      (
                        <HashLoader
                          color={theme.palette.primary.main}
                          loading={true}
                          size={16}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                      )
                      :
                      (
                        <Stack
                          onMouseOver={() => setShowRegenSimThree(true)}
                          onMouseLeave={() => setShowRegenSimThree(false)}
                        >
                          {(showRegenSimThree && vocabSimilarThree?.length > 1) ?
                            <Tooltip title="Regenerate" placement="right">
                              <IconButton onClick={genSimThree}>
                                <IoRefresh size={16} />
                              </IconButton>
                            </Tooltip>
                            :
                            <Tooltip title="Generate" placement="right">
                              <IconButton onClick={genSimThree}>
                                {vocabSimilarThree?.length < 1 ?
                                  <PiSparkle size={16} />
                                  :
                                  <PiSparkleFill size={16} />
                                }
                              </IconButton>
                            </Tooltip>
                          }
                        </Stack>
                      )
                    }
                  </>
                )}
              </Stack>
            )}

            {/* ----- 4th Similar Text Input Field ----- */}
            {vocabSimilarShowCount > 3 && (
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <Typography sx={{ opacity: 0 }}>Similar</Typography>
                <InputBase
                  id={uuidv4()}
                  placeholder="相似意思"
                  onChange={(e) => setVocabSimilarFour(e.target.value)}
                  value={vocabSimilarFour}
                  required={true}
                  sx={{
                    fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                    width: isLandscape ? "75%" : "70%",
                    color: theme.palette.neutral.dark,
                    border: `solid 1px ${theme.palette.neutral.light}`,
                    borderRadius: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                  }}
                />
                <IconButton onClick={clearSimilarFour}>
                  <IoMdClose size={16} />
                </IconButton>
                {generatedAiSim && (
                  <>
                    {(vocabSimilarFour?.length < 1 && generatingSim) ?
                      (
                        <HashLoader
                          color={theme.palette.primary.main}
                          loading={true}
                          size={16}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                      )
                      :
                      (
                        <Stack
                          onMouseOver={() => setShowRegenSimFour(true)}
                          onMouseLeave={() => setShowRegenSimFour(false)}
                        >
                          {(showRegenSimFour && vocabSimilarFour?.length > 1) ?
                            <Tooltip title="Regenerate" placement="right">
                              <IconButton onClick={genSimFour}>
                                <IoRefresh size={16} />
                              </IconButton>
                            </Tooltip>
                            :
                            <Tooltip title="Generate" placement="right">
                              <IconButton onClick={genSimFour}>
                                {vocabSimilarFour?.length < 1 ?
                                  <PiSparkle size={16} />
                                  :
                                  <PiSparkleFill size={16} />
                                }
                              </IconButton>
                            </Tooltip>
                          }
                        </Stack>
                      )
                    }
                  </>
                )}
              </Stack>
            )}

            {/* ----- Expression Text Input Field ----- */}
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <Stack>
                <Typography>Usage</Typography>
                <Typography fontSize={"0.5rem"} color={theme.palette.neutral.mid}>Max 8</Typography>
              </Stack>
              <InputBase
                id={uuidv4()}
                placeholder="用法"
                onChange={(e) => setVocabExpressionOne(e.target.value)}
                value={vocabExpressionOne}
                required={true}
                sx={{
                  fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                  width: isLandscape ? "75%" : "70%",
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
              {(vocabExpressionOne?.length < 1 && generatingExp) ?
                (
                  <HashLoader
                    color={theme.palette.primary.main}
                    loading={true}
                    size={16}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                )
                :
                (
                  <Stack
                    onMouseOver={() => setShowRegenExpOne(true)}
                    onMouseLeave={() => setShowRegenExpOne(false)}
                  >
                    {(showRegenExpOne && vocabExpressionOne?.length > 1) ?
                      <Tooltip title="Regenerate All" placement="right">
                        <IconButton onClick={handleGenAiExp}>
                          <IoRefresh size={16} />
                        </IconButton>
                      </Tooltip>
                      :
                      <Tooltip title="Generate with Ai" placement="right">
                        <IconButton onClick={handleGenAiExp}>
                          {vocabExpressionOne?.length < 1 ?
                            <PiSparkle size={16} />
                            :
                            <PiSparkleFill size={16} />
                          }
                        </IconButton>
                      </Tooltip>
                    }
                  </Stack>
                )
              }
            </Stack>


            {/* ----- 2nd Expression Text Input Field ----- */}
            {vocabExpressionShowCount > 1 && (
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <Typography sx={{ opacity: 0 }}>Usage</Typography>
                <InputBase
                  id={uuidv4()}
                  placeholder="用法"
                  onChange={(e) => setVocabExpressionTwo(e.target.value)}
                  value={vocabExpressionTwo}
                  required={true}
                  sx={{
                    fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                    width: isLandscape ? "75%" : "70%",
                    color: theme.palette.neutral.dark,
                    border: `solid 1px ${theme.palette.neutral.light}`,
                    borderRadius: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                  }}
                />
                <IconButton onClick={clearExpressionTwo}>
                  <IoMdClose size={16} />
                </IconButton>
                {generatedAiExp && (
                  <>
                    {(vocabExpressionTwo?.length < 1 && generatingExp) ?
                      (
                        <HashLoader
                          color={theme.palette.primary.main}
                          loading={true}
                          size={16}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                      )
                      :
                      (
                        <Stack
                          onMouseOver={() => setShowRegenExpTwo(true)}
                          onMouseLeave={() => setShowRegenExpTwo(false)}
                        >
                          {(showRegenExpTwo && vocabExpressionTwo?.length > 1) ?
                            <Tooltip title="Regenerate" placement="right">
                              <IconButton onClick={genExpTwo}>
                                <IoRefresh size={16} />
                              </IconButton>
                            </Tooltip>
                            :
                            <Tooltip title="Generate" placement="right">
                              <IconButton onClick={genExpTwo}>
                                {vocabExpressionTwo?.length < 1 ?
                                  <PiSparkle size={16} />
                                  :
                                  <PiSparkleFill size={16} />
                                }
                              </IconButton>
                            </Tooltip>
                          }
                        </Stack>
                      )
                    }
                  </>
                )}
              </Stack>
            )}

            {/* ----- 3rd Expression Text Input Field ----- */}
            {vocabExpressionShowCount > 2 && (
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <Typography sx={{ opacity: 0 }}>Usage</Typography>
                <InputBase
                  id={uuidv4()}
                  placeholder="用法"
                  onChange={(e) => setVocabExpressionThree(e.target.value)}
                  value={vocabExpressionThree}
                  required={true}
                  sx={{
                    fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                    width: isLandscape ? "75%" : "70%",
                    color: theme.palette.neutral.dark,
                    border: `solid 1px ${theme.palette.neutral.light}`,
                    borderRadius: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                  }}
                />
                <IconButton onClick={clearExpressionThree}>
                  <IoMdClose size={16} />
                </IconButton>
                {generatedAiExp && (
                  <>
                    {(vocabExpressionThree?.length < 1 && generatingExp) ?
                      (
                        <HashLoader
                          color={theme.palette.primary.main}
                          loading={true}
                          size={16}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                      )
                      :
                      (
                        <Stack
                          onMouseOver={() => setShowRegenExpThree(true)}
                          onMouseLeave={() => setShowRegenExpThree(false)}
                        >
                          {(showRegenExpThree && vocabExpressionThree?.length > 1) ?
                            <Tooltip title="Regenerate" placement="right">
                              <IconButton onClick={genExpThree}>
                                <IoRefresh size={16} />
                              </IconButton>
                            </Tooltip>
                            :
                            <Tooltip title="Generate" placement="right">
                              <IconButton onClick={genExpThree}>
                                {vocabExpressionThree?.length < 1 ?
                                  <PiSparkle size={16} />
                                  :
                                  <PiSparkleFill size={16} />
                                }
                              </IconButton>
                            </Tooltip>
                          }
                        </Stack>
                      )
                    }
                  </>
                )}
              </Stack>
            )}

            {/* ----- 4th Expression Text Input Field ----- */}
            {vocabExpressionShowCount > 3 && (
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <Typography sx={{ opacity: 0 }}>Usage</Typography>
                <InputBase
                  id={uuidv4()}
                  placeholder="用法"
                  onChange={(e) => setVocabExpressionFour(e.target.value)}
                  value={vocabExpressionFour}
                  required={true}
                  sx={{
                    fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                    width: isLandscape ? "75%" : "70%",
                    color: theme.palette.neutral.dark,
                    border: `solid 1px ${theme.palette.neutral.light}`,
                    borderRadius: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                  }}
                />
                <IconButton onClick={clearExpressionFour}>
                  <IoMdClose size={16} />
                </IconButton>
                {generatedAiExp && (
                  <>
                    {(vocabExpressionFour?.length < 1 && generatingExp) ?
                      (
                        <HashLoader
                          color={theme.palette.primary.main}
                          loading={true}
                          size={16}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                      )
                      :
                      (
                        <Stack
                          onMouseOver={() => setShowRegenExpFour(true)}
                          onMouseLeave={() => setShowRegenExpFour(false)}
                        >
                          {(showRegenExpFour && vocabExpressionFour?.length > 1) ?
                            <Tooltip title="Regenerate" placement="right">
                              <IconButton onClick={genExpFour}>
                                <IoRefresh size={16} />
                              </IconButton>
                            </Tooltip>
                            :
                            <Tooltip title="Generate" placement="right">
                              <IconButton onClick={genExpFour}>
                                {vocabExpressionFour?.length < 1 ?
                                  <PiSparkle size={16} />
                                  :
                                  <PiSparkleFill size={16} />
                                }
                              </IconButton>
                            </Tooltip>
                          }
                        </Stack>
                      )
                    }
                  </>
                )}
              </Stack>
            )}

            {/* ----- 5th Expression Text Input Field ----- */}
            {vocabExpressionShowCount > 4 && (
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <Typography sx={{ opacity: 0 }}>Usage</Typography>
                <InputBase
                  id={uuidv4()}
                  placeholder="用法"
                  onChange={(e) => setVocabExpressionFive(e.target.value)}
                  value={vocabExpressionFive}
                  required={true}
                  sx={{
                    fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                    width: isLandscape ? "75%" : "70%",
                    color: theme.palette.neutral.dark,
                    border: `solid 1px ${theme.palette.neutral.light}`,
                    borderRadius: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                  }}
                />
                <IconButton onClick={clearExpressionFive}>
                  <IoMdClose size={16} />
                </IconButton>
                {generatedAiExp && (
                  <>
                    {(vocabExpressionFive?.length < 1 && generatingExp) ?
                      (
                        <HashLoader
                          color={theme.palette.primary.main}
                          loading={true}
                          size={16}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                      )
                      :
                      (
                        <Stack
                          onMouseOver={() => setShowRegenExpFive(true)}
                          onMouseLeave={() => setShowRegenExpFive(false)}
                        >
                          {(showRegenExpFive && vocabExpressionFive?.length > 1) ?
                            <Tooltip title="Regenerate" placement="right">
                              <IconButton onClick={genExpFive}>
                                <IoRefresh size={16} />
                              </IconButton>
                            </Tooltip>
                            :
                            <Tooltip title="Generate" placement="right">
                              <IconButton onClick={genExpFive}>
                                {vocabExpressionFive?.length < 1 ?
                                  <PiSparkle size={16} />
                                  :
                                  <PiSparkleFill size={16} />
                                }
                              </IconButton>
                            </Tooltip>
                          }
                        </Stack>
                      )
                    }
                  </>
                )}
              </Stack>
            )}

            {/* ----- 6th Expression Text Input Field ----- */}
            {vocabExpressionShowCount > 5 && (
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <Typography sx={{ opacity: 0 }}>Usage</Typography>
                <InputBase
                  id={uuidv4()}
                  placeholder="用法"
                  onChange={(e) => setVocabExpressionSix(e.target.value)}
                  value={vocabExpressionSix}
                  required={true}
                  sx={{
                    fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                    width: isLandscape ? "75%" : "70%",
                    color: theme.palette.neutral.dark,
                    border: `solid 1px ${theme.palette.neutral.light}`,
                    borderRadius: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                  }}
                />
                <IconButton onClick={clearExpressionSix}>
                  <IoMdClose size={16} />
                </IconButton>
                {generatedAiExp && (
                  <>
                    {(vocabExpressionSix?.length < 1 && generatingExp) ?
                      (
                        <HashLoader
                          color={theme.palette.primary.main}
                          loading={true}
                          size={16}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                      )
                      :
                      (
                        <Stack
                          onMouseOver={() => setShowRegenExpSix(true)}
                          onMouseLeave={() => setShowRegenExpSix(false)}
                        >
                          {(showRegenExpSix && vocabExpressionSix?.length > 1) ?
                            <Tooltip title="Regenerate" placement="right">
                              <IconButton onClick={genExpSix}>
                                <IoRefresh size={16} />
                              </IconButton>
                            </Tooltip>
                            :
                            <Tooltip title="Generate" placement="right">
                              <IconButton onClick={genExpSix}>
                                {vocabExpressionSix?.length < 1 ?
                                  <PiSparkle size={16} />
                                  :
                                  <PiSparkleFill size={16} />
                                }
                              </IconButton>
                            </Tooltip>
                          }
                        </Stack>
                      )
                    }
                  </>
                )}
              </Stack>
            )}

            {/* ----- 7th Expression Text Input Field ----- */}
            {vocabExpressionShowCount > 6 && (
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <Typography sx={{ opacity: 0 }}>Usage</Typography>
                <InputBase
                  id={uuidv4()}
                  placeholder="用法"
                  onChange={(e) => setVocabExpressionSeven(e.target.value)}
                  value={vocabExpressionSeven}
                  required={true}
                  sx={{
                    fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                    width: isLandscape ? "75%" : "70%",
                    color: theme.palette.neutral.dark,
                    border: `solid 1px ${theme.palette.neutral.light}`,
                    borderRadius: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                  }}
                />
                <IconButton onClick={clearExpressionSeven}>
                  <IoMdClose size={16} />
                </IconButton>
                {generatedAiExp && (
                  <>
                    {(vocabExpressionSeven?.length < 1 && generatingExp) ?
                      (
                        <HashLoader
                          color={theme.palette.primary.main}
                          loading={true}
                          size={16}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                      )
                      :
                      (
                        <Stack
                          onMouseOver={() => setShowRegenExpSeven(true)}
                          onMouseLeave={() => setShowRegenExpSeven(false)}
                        >
                          {(showRegenExpSeven && vocabExpressionSeven?.length > 1) ?
                            <Tooltip title="Regenerate" placement="right">
                              <IconButton onClick={genExpSeven}>
                                <IoRefresh size={16} />
                              </IconButton>
                            </Tooltip>
                            :
                            <Tooltip title="Generate" placement="right">
                              <IconButton onClick={genExpSeven}>
                                {vocabExpressionSeven?.length < 1 ?
                                  <PiSparkle size={16} />
                                  :
                                  <PiSparkleFill size={16} />
                                }
                              </IconButton>
                            </Tooltip>
                          }
                        </Stack>
                      )
                    }
                  </>
                )}
              </Stack>
            )}

            {/* ----- 8th Expression Text Input Field ----- */}
            {vocabExpressionShowCount > 7 && (
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <Typography sx={{ opacity: 0 }}>Usage</Typography>
                <InputBase
                  id={uuidv4()}
                  placeholder="用法"
                  onChange={(e) => setVocabExpressionEight(e.target.value)}
                  value={vocabExpressionEight}
                  required={true}
                  sx={{
                    fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                    width: isLandscape ? "75%" : "70%",
                    color: theme.palette.neutral.dark,
                    border: `solid 1px ${theme.palette.neutral.light}`,
                    borderRadius: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                  }}
                />
                <IconButton onClick={clearExpressionEight}>
                  <IoMdClose size={16} />
                </IconButton>
                {generatedAiExp && (
                  <>
                    {(vocabExpressionEight?.length < 1 && generatingExp) ?
                      (
                        <HashLoader
                          color={theme.palette.primary.main}
                          loading={true}
                          size={16}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                      )
                      :
                      (
                        <Stack
                          onMouseOver={() => setShowRegenExpEight(true)}
                          onMouseLeave={() => setShowRegenExpEight(false)}
                        >
                          {(showRegenExpEight && vocabExpressionEight?.length > 1) ?
                            <Tooltip title="Regenerate" placement="right">
                              <IconButton onClick={genExpEight}>
                                <IoRefresh size={16} />
                              </IconButton>
                            </Tooltip>
                            :
                            <Tooltip title="Generate" placement="right">
                              <IconButton onClick={genExpEight}>
                                {vocabExpressionEight?.length < 1 ?
                                  <PiSparkle size={16} />
                                  :
                                  <PiSparkleFill size={16} />
                                }
                              </IconButton>
                            </Tooltip>
                          }
                        </Stack>
                      )
                    }
                  </>
                )}
              </Stack>
            )}


            {/* ----- Sentence Text Input Field ----- */}
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Stack>
                <Typography>Sentence</Typography>
                <Typography fontSize={"0.5rem"} color={theme.palette.neutral.mid}>Max 4</Typography>
              </Stack>
              <InputBase
                id={uuidv4()}
                placeholder="句子"
                multiline
                rows={2}
                onChange={(e) => setVocabSentenceOne(e.target.value)}
                value={vocabSentenceOne}
                required={true}
                sx={{
                  fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                  width: isLandscape ? "75%" : "70%",
                  color: theme.palette.neutral.dark,
                  border: `solid 1px ${theme.palette.neutral.light}`,
                  borderRadius: "0.5rem",
                  padding: "0.25rem 0.5rem",
                  margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                }}
              />
              <IconButton onClick={incrementVocabSentenceCount}>
                <IoMdAdd size={16} />
              </IconButton>
            </Stack>


            {/* ----- 2nd Sentence Text Input Field ----- */}
            {vocabSentenceShowCount > 1 && (
              <Stack direction={"row"} alignItems={"center"} spacing={2}>
                <Typography sx={{ opacity: 0 }}>Sentence</Typography>
                <InputBase
                  id={uuidv4()}
                  placeholder="句子"
                  multiline
                  rows={2}
                  onChange={(e) => setVocabSentenceTwo(e.target.value)}
                  value={vocabSentenceTwo}
                  required={true}
                  sx={{
                    fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                    width: isLandscape ? "75%" : "70%",
                    color: theme.palette.neutral.dark,
                    border: `solid 1px ${theme.palette.neutral.light}`,
                    borderRadius: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                  }}
                />
                <IconButton onClick={() => setVocabSentenceShowCount(vocabSentenceShowCount - 1)}>
                  <IoMdClose size={16} />
                </IconButton>
              </Stack>
            )}

            {/* ----- 3rd Sentence Text Input Field ----- */}
            {vocabSentenceShowCount > 2 && (
              <Stack direction={"row"} alignItems={"center"} spacing={2}>
                <Typography sx={{ opacity: 0 }}>Sentence</Typography>
                <InputBase
                  id={uuidv4()}
                  placeholder="句子"
                  multiline
                  rows={2}
                  onChange={(e) => setVocabSentenceThree(e.target.value)}
                  value={vocabSentenceThree}
                  required={true}
                  sx={{
                    fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                    width: isLandscape ? "75%" : "70%",
                    color: theme.palette.neutral.dark,
                    border: `solid 1px ${theme.palette.neutral.light}`,
                    borderRadius: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                  }}
                />
                <IconButton onClick={() => setVocabSentenceShowCount(vocabSentenceShowCount - 1)}>
                  <IoMdClose size={16} />
                </IconButton>
              </Stack>
            )}

            {/* ----- 4th Sentence Text Input Field ----- */}
            {vocabSentenceShowCount > 3 && (
              <Stack direction={"row"} alignItems={"center"} spacing={2}>
                <Typography sx={{ opacity: 0 }}>Sentence</Typography>
                <InputBase
                  id={uuidv4()}
                  placeholder="句子"
                  multiline
                  rows={2}
                  onChange={(e) => setVocabSentenceFour(e.target.value)}
                  value={vocabSentenceFour}
                  required={true}
                  sx={{
                    fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                    width: isLandscape ? "75%" : "70%",
                    color: theme.palette.neutral.dark,
                    border: `solid 1px ${theme.palette.neutral.light}`,
                    borderRadius: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    margin: !isNonMobileScreens ? "0 0.5rem" : isFullHDScreens ? "1rem 2rem" : "1rem 4rem"
                  }}
                />
                <IconButton onClick={() => setVocabSentenceShowCount(vocabSentenceShowCount - 1)}>
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
