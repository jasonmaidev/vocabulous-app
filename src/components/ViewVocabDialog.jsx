import "../styles/gradient-button.min.css"
import { v4 as uuidv4 } from "uuid"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { TbPin, TbPinFilled, TbTrashX } from "react-icons/tb";
import { CgUndo } from "react-icons/cg";
import { FiEdit2, FiBookOpen } from "react-icons/fi";
import { IoSearch, IoAddCircleOutline } from "react-icons/io5";
import { IoMdAdd, IoMdClose, IoMdMore, IoMdCheckmark } from "react-icons/io";
import { PiCircleBold, PiDiamondBold, PiStarBold } from "react-icons/pi";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { Box, Popover, Stack, Typography, Checkbox, InputBase, Menu, MenuItem, ListItemIcon, ListItemText, useTheme, Button, IconButton, useMediaQuery, Tooltip, } from "@mui/material"
import { pinyin } from "pinyin-pro"
import { setViewVocab, setViewUsage, setViewBySearchTerm } from "state"
import apiUrl from "config/api"

// Fetch function for similar vocab
const fetchSimilarVocab = async (similarSearchText, _id, token) => {
  const response = await fetch(`${apiUrl}/vocabs/search/${_id}?searchText=${similarSearchText}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

const SimilarText = ({ item, searchSimilar }) => {
  const isQHDScreens = useMediaQuery("(min-width:2500px) and (max-height:1600px)") // 2K Laptops
  const isWideScreens = useMediaQuery("(min-width:3400px) and (max-height:1500px)") // Wide and Ultrawide Desktops
  const theme = useTheme()
  const mode = useSelector((state) => state.mode)

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    searchSimilar(item)
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
      <Typography fontSize={isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.75rem"}
        onClick={handleClick}
        sx={{ cursor: "pointer" }}
      >
        {item}
      </Typography>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              margin: "0.25rem 0.25rem 1rem 0.25rem",
              borderRadius: "6rem",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
              backgroundColor: mode === "light" ? "rgba(255, 255, 255, 1)" : "rgba(0, 11, 13, 0.3)", // Semi-transparent background
              backgroundImage: `linear-gradient(
                to top left, 
                rgba(255, 255, 255, 0.15), 
                rgba(255, 255, 255, 0.05)
              )`, // Gradient overlay
              backdropFilter: "blur(5px)", // Apply the glass effect
              WebkitBackdropFilter: "blur(5px)", // For Safari support
              border: "1px solid rgba(255, 255, 255, 0.2)"
            },
          },
        }}
      >
        <IconButton onMouseDown={() => searchSimilar(item)} onClick={() => searchSimilar(item)}>
          <IoSearch size={24} color={theme.palette.neutral.darker} />
        </IconButton>
      </Popover>
    </Stack>
  )
}

function HighlightCaps({ text }) {
  const theme = useTheme();
  const mode = useSelector((state) => state.mode);

  // Function to process the string
  const processText = (text) => {
    // Regular expression to match consecutive 2 or more uppercase letters or characters inside parentheses (including the parentheses)
    const regex = /[A-Z]{2,}|\(.*?\)/g;

    // Split the text based on the match
    const parts = text.split(regex);

    // Find the matches (consecutive capital letters and text inside parentheses)
    const matches = text.match(regex);

    // If no matches found, return the original text
    if (!matches) {
      return text;
    }

    return parts.reduce((acc, part, index) => {
      acc.push(<span key={`part-${index}`}>{part}</span>); // Add normal text
      if (matches[index]) {
        // If there's a match at this index, add it with the highlighted color
        acc.push(
          <span key={`match-${index}`} style={{ color: mode === "light" ? theme.palette.tertiary.dark : theme.palette.primary.main }}>
            {matches[index]}
          </span>
        );
      }
      return acc;
    }, []);
  };

  return <div>{processText(text)}</div>;
}


const ViewVocabDialog = ({ handleViewClose, id, text, pinyinText, label, difficulty, definition, similar, expression, sentence, pinned }) => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px) and (max-height:2160px)") // All Desktops
  const isQHDScreens = useMediaQuery("(min-width:2500px) and (max-height:1600px)") // 2K Laptops
  const isWideScreens = useMediaQuery("(min-width:3400px) and (max-height:1500px)") // Wide and Ultrawide Desktops
  const theme = useTheme()

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { _id } = useSelector((state) => state.user)
  const token = useSelector((state) => state.token)
  const viewVocab = useSelector((state) => state.viewVocab)
  const viewUsage = useSelector((state) => state.viewUsage)
  const queryClient = useQueryClient()
  const mode = useSelector((state) => state.mode)

  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;

  const [newText, setNewText] = useState("")
  const [editingText, setEditingText] = useState(false)

  const [newPinyin, setNewPinyin] = useState("")
  const [editingPinyin, setEditingPinyin] = useState(false)

  const [newDef, setNewDef] = useState("")
  const [editingDef, setEditingDef] = useState(false)

  /* Handles Updating Text, Pinyin, Definition, and Pinned */
  const handleUpdateVocab = (updatedData) => {
    updateVocabMutation.mutate(updatedData)
  }

  const updateVocabMutation = useMutation({
    mutationFn: async () => {
      const updatedData = {}
      if (newText.length > 0) updatedData.text = newText
      if (newPinyin.length > 0) updatedData.pinyin = newPinyin
      if (newDef.length > 0) updatedData.definition = newDef
      return await fetch(`${apiUrl}/vocabs/${id}/update`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
    },
    onError: (error, context) => {
      console.log("Error fetching:" + context.id + error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["pinnedVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["intVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["advVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["searchVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["labeledVocabsData"] })
      setEditingText(false)
      setEditingPinyin(false)
      setEditingDef(false)
    }
  })

  const handleSetBeg = (updatedData) => {
    setBegMutation.mutate(updatedData)
  }

  const setBegMutation = useMutation({
    mutationFn: async () => {
      const updatedData = {
        difficulty: "2"
      }
      return await fetch(`${apiUrl}/vocabs/${id}/update`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
    },
    onError: (error, context) => {
      console.log("Error fetching:" + context.id + error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["pinnedVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["intVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["advVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["searchVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["labeledVocabsData"] })
    }
  })

  const handleSetInt = (updatedData) => {
    setIntMutation.mutate(updatedData)
  }

  const setIntMutation = useMutation({
    mutationFn: async () => {
      const updatedData = {
        difficulty: "2"
      }
      return await fetch(`${apiUrl}/vocabs/${id}/update`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
    },
    onError: (error, context) => {
      console.log("Error fetching:" + context.id + error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["pinnedVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["intVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["advVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["searchVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["labeledVocabsData"] })
    }
  })

  const handleSetAdv = (updatedData) => {
    setAdvMutation.mutate(updatedData)
  }

  const setAdvMutation = useMutation({
    mutationFn: async () => {
      const updatedData = {
        difficulty: "3"
      }
      return await fetch(`${apiUrl}/vocabs/${id}/update`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
    },
    onError: (error, context) => {
      console.log("Error fetching:" + context.id + error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["pinnedVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["intVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["advVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["searchVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["labeledVocabsData"] })
    }
  })

  const handleUpdatePinned = (updatedData) => {
    updatePinnedMutation.mutate(updatedData)
  }

  const updatePinnedMutation = useMutation({
    mutationFn: async () => {
      const updatedData = {
        pinned: !pinned
      }
      return await fetch(`${apiUrl}/vocabs/${id}/update`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
    },
    onError: (error, context) => {
      console.log("Error fetching:" + context.id + error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["pinnedVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["intVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["advVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["searchVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["labeledVocabsData"] })
    }
  })

  const handleDeleteVocab = (id) => {
    deleteMutation.mutate(id)
  }

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await fetch(`${apiUrl}/vocabs/${id}/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
    },
    onError: (error, context) => {
      console.log("Error fetching:" + context.id + error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["pinnedVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["intVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["advVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["searchVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["labeledVocabsData"] })
      handleViewClose()
    }
  })

  /* Similar Input States */
  const [editingSimilar, setEditingSimilar] = useState(false)
  const [newSimilar, setNewSimilar] = useState([])
  const [newSimilarOne, setNewSimilarOne] = useState("")
  const [newSimilarTwo, setNewSimilarTwo] = useState("")
  const [newSimilarThree, setNewSimilarThree] = useState("")
  const [newSimilarFour, setNewSimilarFour] = useState("")
  const [newSimilarEntry, setNewSimilarEntry] = useState(similar?.length) // Increments a new InputBase onClick for new entry
  const addSimilarEntry = () => {
    setEditingSimilar(true);
    if (newSimilarEntry === 4) {
      return
    }
    setNewSimilarEntry(newSimilarEntry + 1);
  }
  const subtractSimilarEntry = () => {
    if (newSimilarEntry === 1) {
      return
    }
    setNewSimilarEntry(newSimilarEntry - 1);
  }
  const [removeSimilarOne, setRemoveSimilarOne] = useState(false)
  const [removeSimilarTwo, setRemoveSimilarTwo] = useState(false)
  const [removeSimilarThree, setRemoveSimilarThree] = useState(false)
  const [removeSimilarFour, setRemoveSimilarFour] = useState(false)
  const removeSimOne = () => {
    setRemoveSimilarOne(true);
    subtractSimilarEntry();
  }
  const removeSimTwo = () => {
    setRemoveSimilarTwo(true);
    subtractSimilarEntry();
  }
  const removeSimThree = () => {
    setRemoveSimilarThree(true);
    subtractSimilarEntry();
  }
  const removeSimFour = () => {
    setRemoveSimilarFour(true);
    subtractSimilarEntry();
  }

  const updateNewSimilar = () => {
    setNewSimilar((prevState) => {
      const newSimilarArray = [];
      if (removeSimilarOne || newSimilarOne.length > 0) {
        newSimilarArray.push(newSimilarOne);
      } else {
        if (similar[0]?.length > 0) {
          newSimilarArray.push(similar[0])
        }
      }
      if (removeSimilarTwo || newSimilarTwo.length > 0) {
        if (newSimilarTwo.length > 0) {
          newSimilarArray.push(newSimilarTwo);
        }
      } else {
        if (similar[1]?.length > 0) {
          newSimilarArray.push(similar[1])
        }
      }
      if (removeSimilarThree || newSimilarThree.length > 0) {
        if (newSimilarThree.length > 0) {
          newSimilarArray.push(newSimilarThree);
        }
      } else {
        if (similar[2]?.length > 0) {
          newSimilarArray.push(similar[2])
        }
      }
      if (removeSimilarFour || newSimilarFour.length > 0) {
        if (newSimilarFour.length > 0) {
          newSimilarArray.push(newSimilarFour);
        }
      } else {
        if (similar[3]?.length > 0) {
          newSimilarArray.push(similar[3])
        }
      }

      return newSimilarArray;
    });
  };

  const openEditSimilar = () => {
    if (newSimilarEntry === 0) {
      setNewSimilarEntry(similar?.length + 1);
    }
    setEditingSimilar(true);
  }

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
  const [checkedLabels, setCheckedLabels] = useState(label);
  const [editingLabels, setEditingLabels] = useState(false)

  // Handle check/uncheck actions
  const handleCheckboxChange = (text) => {
    setCheckedLabels((prevCheckedLabels) =>
      prevCheckedLabels.includes(text)
        ? prevCheckedLabels.filter((label) => label !== text) // Uncheck (remove from array)
        : [...prevCheckedLabels, text] // Check (add to array)
    );
  }

  const handleUpdateLabels = (updatedData) => {
    updateLabelsMutation.mutate(updatedData)
    setEditingLabels(false)
  }

  const updateLabelsMutation = useMutation({
    mutationFn: async () => {
      const updatedData = {
        label: checkedLabels ? checkedLabels : label,
      }
      return await fetch(`${apiUrl}/vocabs/${id}/update`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
    },
    onError: (error, context) => {
      console.log("Error fetching:" + context.id + error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["pinnedVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["intVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["advVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["searchVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["labeledVocabsData"] })
      setEditingLabels(false)
    }
  })

  /* Expressions Input States */
  const [editingExpressions, setEditingExpressions] = useState(false)
  const [newExpressions, setNewExpressions] = useState([])
  const [newExpressionsOne, setNewExpressionsOne] = useState("")
  const [newExpressionsTwo, setNewExpressionsTwo] = useState("")
  const [newExpressionsThree, setNewExpressionsThree] = useState("")
  const [newExpressionsFour, setNewExpressionsFour] = useState("")
  const [newExpressionsFive, setNewExpressionsFive] = useState("")
  const [newExpressionsSix, setNewExpressionsSix] = useState("")
  const [newExpressionsSeven, setNewExpressionsSeven] = useState("")
  const [newExpressionsEight, setNewExpressionsEight] = useState("")
  const [newExpressionsEntry, setNewExpressionsEntry] = useState(expression?.length) // Increments a new InputBase onClick for new entry
  const addExpressionsEntry = () => {
    setEditingExpressions(true);
    if (newExpressionsEntry === 8) {
      return
    }
    setNewExpressionsEntry(newExpressionsEntry + 1);
  }
  const subtractExpressionsEntry = () => {
    if (newExpressionsEntry === 1) {
      return
    }
    setNewExpressionsEntry(newExpressionsEntry - 1);
  }
  const [removeExpressionsOne, setRemoveExpressionsOne] = useState(false)
  const [removeExpressionsTwo, setRemoveExpressionsTwo] = useState(false)
  const [removeExpressionsThree, setRemoveExpressionsThree] = useState(false)
  const [removeExpressionsFour, setRemoveExpressionsFour] = useState(false)
  const [removeExpressionsFive, setRemoveExpressionsFive] = useState(false)
  const [removeExpressionsSix, setRemoveExpressionsSix] = useState(false)
  const [removeExpressionsSeven, setRemoveExpressionsSeven] = useState(false)
  const [removeExpressionsEight, setRemoveExpressionsEight] = useState(false)
  const removeExpOne = () => {
    setRemoveExpressionsOne(true);
    subtractExpressionsEntry();
  }
  const removeExpTwo = () => {
    setRemoveExpressionsTwo(true);
    subtractExpressionsEntry();
  }
  const removeExpThree = () => {
    setRemoveExpressionsThree(true);
    subtractExpressionsEntry();
  }
  const removeExpFour = () => {
    setRemoveExpressionsFour(true);
    subtractExpressionsEntry();
  }
  const removeExpFive = () => {
    setRemoveExpressionsFive(true);
    subtractExpressionsEntry();
  }
  const removeExpSix = () => {
    setRemoveExpressionsSix(true);
    subtractExpressionsEntry();
  }
  const removeExpSeven = () => {
    setRemoveExpressionsSeven(true);
    subtractExpressionsEntry();
  }
  const removeExpEight = () => {
    setRemoveExpressionsEight(true);
    subtractExpressionsEntry();
  }

  const updateNewExpressions = () => {
    setNewExpressions((prevState) => {
      const newExpressionsArray = [];
      if (removeExpressionsOne || newExpressionsOne.length > 0) {
        newExpressionsArray.push(newExpressionsOne);
      } else {
        if (expression[0]?.length > 0) {
          newExpressionsArray.push(expression[0])
        }
      }
      if (removeExpressionsTwo || newExpressionsTwo.length > 0) {
        if (newExpressionsTwo.length > 0) {
          newExpressionsArray.push(newExpressionsTwo);
        }
      } else {
        if (expression[1]?.length > 0) {
          newExpressionsArray.push(expression[1])
        }
      }
      if (removeExpressionsThree || newExpressionsThree.length > 0) {
        if (newExpressionsThree.length > 0) {
          newExpressionsArray.push(newExpressionsThree);
        }
      } else {
        if (expression[2]?.length > 0) {
          newExpressionsArray.push(expression[2])
        }
      }
      if (removeExpressionsFour || newExpressionsFour.length > 0) {
        if (newExpressionsFour.length > 0) {
          newExpressionsArray.push(newExpressionsFour);
        }
      } else {
        if (expression[3]?.length > 0) {
          newExpressionsArray.push(expression[3])
        }
      }
      if (removeExpressionsFive || newExpressionsFive.length > 0) {
        if (newExpressionsFive.length > 0) {
          newExpressionsArray.push(newExpressionsFive);
        }
      } else {
        if (expression[4]?.length > 0) {
          newExpressionsArray.push(expression[4])
        }
      }
      if (removeExpressionsSix || newExpressionsSix.length > 0) {
        if (newExpressionsSix.length > 0) {
          newExpressionsArray.push(newExpressionsSix);
        }
      } else {
        if (expression[5]?.length > 0) {
          newExpressionsArray.push(expression[5])
        }
      }
      if (removeExpressionsSeven || newExpressionsSeven.length > 0) {
        if (newExpressionsSeven.length > 0) {
          newExpressionsArray.push(newExpressionsSeven);
        }
      } else {
        if (expression[6]?.length > 0) {
          newExpressionsArray.push(expression[6])
        }
      }
      if (removeExpressionsEight || newExpressionsEight.length > 0) {
        if (newExpressionsEight.length > 0) {
          newExpressionsArray.push(newExpressionsEight);
        }
      } else {
        if (expression[7]?.length > 0) {
          newExpressionsArray.push(expression[7])
        }
      }
      return newExpressionsArray;
    });
  };

  const openEditExpressions = () => {
    if (newExpressionsEntry === 0) {
      setNewExpressionsEntry(expression?.length + 1);
    }
    setEditingExpressions(true);
  }

  /* Sentences Input States */
  const [editingSentences, setEditingSentences] = useState(false)
  const [newSentences, setNewSentences] = useState([])
  const [newSentencesOne, setNewSentencesOne] = useState("")
  const [newSentencesTwo, setNewSentencesTwo] = useState("")
  const [newSentencesThree, setNewSentencesThree] = useState("")
  const [newSentencesFour, setNewSentencesFour] = useState("")
  const [newSentencesEntry, setNewSentencesEntry] = useState(sentence?.length) // Increments a new InputBase onClick for new entry
  const addSentencesEntry = () => {
    setEditingSentences(true);
    if (newSentencesEntry === 4) {
      return
    }
    setNewSentencesEntry(newSentencesEntry + 1);
  }
  const subtractSentencesEntry = () => {
    if (newSentencesEntry === 1) {
      return
    }
    setNewSentencesEntry(newSentencesEntry - 1);
  }
  const [removeSentencesOne, setRemoveSentencesOne] = useState(false)
  const [removeSentencesTwo, setRemoveSentencesTwo] = useState(false)
  const [removeSentencesThree, setRemoveSentencesThree] = useState(false)
  const [removeSentencesFour, setRemoveSentencesFour] = useState(false)
  const removeSenOne = () => {
    setRemoveSentencesOne(true);
    subtractSentencesEntry();
  }
  const removeSenTwo = () => {
    setRemoveSentencesTwo(true);
    subtractSentencesEntry();
  }
  const removeSenThree = () => {
    setRemoveSentencesThree(true);
    subtractSentencesEntry();
  }
  const removeSenFour = () => {
    setRemoveSentencesFour(true);
    subtractSentencesEntry();
  }

  const updateNewSentences = () => {
    setNewSentences((prevState) => {
      const newSentencesArray = [];
      if (removeSentencesOne || newSentencesOne.length > 0) {
        newSentencesArray.push(newSentencesOne);
      } else {
        if (sentence[0]?.length > 0) {
          newSentencesArray.push(sentence[0])
        }
      }
      if (removeSentencesTwo || newSentencesTwo.length > 0) {
        if (newSentencesTwo.length > 0) {
          newSentencesArray.push(newSentencesTwo);
        }
      } else {
        if (sentence[1]?.length > 0) {
          newSentencesArray.push(sentence[1])
        }
      }
      if (removeSentencesThree || newSentencesThree.length > 0) {
        if (newSentencesThree.length > 0) {
          newSentencesArray.push(newSentencesThree);
        }
      } else {
        if (sentence[2]?.length > 0) {
          newSentencesArray.push(sentence[2])
        }
      }
      if (removeSentencesFour || newSentencesFour.length > 0) {
        if (newSentencesFour.length > 0) {
          newSentencesArray.push(newSentencesFour);
        }
      } else {
        if (sentence[3]?.length > 0) {
          newSentencesArray.push(sentence[3])
        }
      }
      return newSentencesArray;
    });
  };

  const openEditSentences = () => {
    if (newSentencesEntry === 0) {
      setNewSentencesEntry(sentence?.length + 1);
    }
    setEditingSentences(true);
  }

  const handleUpdateSimilar = (updatedData) => {
    updateNewSimilar()
    updateSimilarMutation.mutate(updatedData)
    setEditingSimilar(false)
  }

  const updateSimilarMutation = useMutation({
    mutationFn: async () => {
      const updatedData = {
        similar: newSimilar ? newSimilar : similar,
      }
      return await fetch(`${apiUrl}/vocabs/${id}/update`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
    },
    onError: (error, context) => {
      console.log("Error fetching:" + context.id + error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["pinnedVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["intVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["advVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["searchVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["labeledVocabsData"] })
      setEditingSimilar(false)
      setNewSimilar([])
      setNewSimilarOne("")
      setNewSimilarTwo("")
      setNewSimilarThree("")
      setNewSimilarFour("")
      setRemoveSimilarOne(false)
      setRemoveSimilarTwo(false)
      setRemoveSimilarThree(false)
      setRemoveSimilarFour(false)
    }
  })

  const handleUpdateExpressions = (updatedData) => {
    updateNewExpressions()
    updateExpressionsMutation.mutate(updatedData)
    setEditingExpressions(false)
  }

  const updateExpressionsMutation = useMutation({
    mutationFn: async () => {
      const updatedData = {
        expression: newExpressions ? newExpressions : expression,
      }
      return await fetch(`${apiUrl}/vocabs/${id}/update`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
    },
    onError: (error, context) => {
      console.log("Error fetching:" + context.id + error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["pinnedVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["intVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["advVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["searchVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["labeledVocabsData"] })
      setEditingExpressions(false)
      setNewExpressions([])
      setNewExpressionsOne("")
      setNewExpressionsTwo("")
      setNewExpressionsThree("")
      setNewExpressionsFour("")
      setNewExpressionsFive("")
      setNewExpressionsSix("")
      setNewExpressionsSeven("")
      setNewExpressionsEight("")
      setRemoveExpressionsOne(false)
      setRemoveExpressionsTwo(false)
      setRemoveExpressionsThree(false)
      setRemoveExpressionsFour(false)
      setRemoveExpressionsFive(false)
      setRemoveExpressionsSix(false)
      setRemoveExpressionsSeven(false)
      setRemoveExpressionsEight(false)
    }
  })

  const handleUpdateSentences = (updatedData) => {
    updateNewSentences()
    updateSentencesMutation.mutate(updatedData)
    setEditingSentences(false)
  }

  const updateSentencesMutation = useMutation({
    mutationFn: async () => {
      const updatedData = {
        sentence: newSentences ? newSentences : sentence,
      }
      return await fetch(`${apiUrl}/vocabs/${id}/update`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
    },
    onError: (error, context) => {
      console.log("Error fetching:" + context.id + error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["pinnedVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["intVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["advVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["searchVocabsData"] })
      queryClient.invalidateQueries({ queryKey: ["labeledVocabsData"] })
      setEditingSentences(false)
      setNewSentences([])
      setNewSentencesOne("")
      setNewSentencesTwo("")
      setNewSentencesThree("")
      setNewSentencesFour("")
      setRemoveSentencesOne(false)
      setRemoveSentencesTwo(false)
      setRemoveSentencesThree(false)
      setRemoveSentencesFour(false)
    }
  })

  const [similarSearchText, setSimilarSearchText] = useState("")
  // Query for fetching similar vocab data
  const { data: similarSearchData, refetch } = useQuery(
    ["searchSimilarVocabData", similarSearchText],
    () => fetchSimilarVocab(similarSearchText, _id, token),
    {
      // keepPreviousData: true,
      staleTime: 200,
      enabled: !!similarSearchText, // Disable query if similarSearchText is empty
    }
  );

  // Effect to trigger refetch whenever similarSearchText changes
  useEffect(() => {
    if (similarSearchText) {
      refetch();
    }
  }, [similarSearchText, refetch]);

  const searchSimilar = (item) => {
    // handleSimilarMenuClick()
    setSimilarSearchText(item);

    if (similarSearchData?.length > 0) {
      dispatch(setViewBySearchTerm({ viewBySearchTerm: item }))
      navigate(`/search/${_id}`)
    }
  };

  const handleViewVocab = () => {
    dispatch(setViewVocab({ viewVocab: true }))
    dispatch(setViewUsage({ viewUsage: false }))
  }

  const handleViewUsage = () => {
    dispatch(setViewUsage({ viewUsage: true }))
    dispatch(setViewVocab({ viewVocab: false }))
  }

  /* Options Drowndown Menu */
  const [menuAnchor, setMenuAnchor] = useState(null)
  const openMenu = Boolean(menuAnchor)
  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget)
  }
  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  return (
    <Box
      margin={!isNonMobileScreens ? "0.5rem" : "1rem"}
      padding={isPortrait ? 1 : 0}
    >
      {viewVocab ? (
        <Stack
          height={isPortrait ? "66vh" : isWideScreens ? "67vh" : isQHDScreens ? "60vh" : "68vh"}
          justifyContent={"space-between"}
        >
          <Stack>
            {isLandscape && (
              <Stack direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"} pb={1.5}
                borderBottom={mode === "dark" ? `solid 1px rgba(255,255,255, 0.15)` : `solid 1px ${theme.palette.neutral.lighter}`}
              >
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <Button
                    onClick={handleViewVocab}
                    sx={
                      viewVocab ?
                        {
                          color: mode === "dark" ? theme.palette.neutral.darker : theme.palette.neutral.lighter,
                          margin: 0,
                          padding: isWideScreens ? "0.5rem 1.25rem" : isQHDScreens ? "0.5rem 1rem" : "0.25rem 0.5rem",
                          borderRadius: "3.5rem",
                          fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.75rem",
                          textTransform: "none",
                          backgroundColor: mode === "dark" ? "rgba(255,255,255, 0.1)" : theme.palette.neutral.dark,
                          ":hover": {
                            color: mode === "dark" ? theme.palette.neutral.darker : theme.palette.neutral.lighter,
                            cursor: "default",
                            backgroundColor: mode === "dark" ? "rgba(255,255,255, 0.1)" : theme.palette.neutral.dark,
                          }
                        }
                        :
                        {
                          color: theme.palette.neutral.mid,
                          margin: 0,
                          padding: isWideScreens ? "0.5rem 1.25rem" : isQHDScreens ? "0.5rem 1rem" : "0.25rem 0.5rem",
                          borderRadius: "3.5rem",
                          fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.75rem",
                          textTransform: "none",
                          backgroundColor: "none",
                          ":hover": {
                            color: theme.palette.primary.main,
                            backgroundColor: "none"
                          }
                        }
                    }
                  >
                    Vocab
                  </Button>
                  <Button
                    onClick={handleViewUsage}
                    sx={
                      viewUsage ?
                        {
                          color: mode === "dark" ? theme.palette.neutral.darker : theme.palette.neutral.lighter,
                          margin: 0,
                          padding: isWideScreens ? "0.5rem 1.25rem" : isQHDScreens ? "0.5rem 1rem" : "0.25rem 0.5rem",
                          borderRadius: "3.5rem",
                          fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.75rem",
                          textTransform: "none",
                          backgroundColor: mode === "dark" ? "rgba(255,255,255, 0.1)" : theme.palette.neutral.dark,
                          ":hover": {
                            color: mode === "dark" ? theme.palette.neutral.darker : theme.palette.neutral.lighter,
                            cursor: "default",
                            backgroundColor: mode === "dark" ? "rgba(255,255,255, 0.1)" : theme.palette.neutral.dark,

                          }
                        }
                        :
                        {
                          color: theme.palette.neutral.mid,
                          margin: 0,
                          padding: isWideScreens ? "0.5rem 1.25rem" : isQHDScreens ? "0.5rem 1rem" : "0.25rem 0.5rem",
                          borderRadius: "3.5rem",
                          fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.75rem",
                          textTransform: "none",
                          backgroundColor: "none",
                          ":hover": {
                            color: theme.palette.primary.main,
                            backgroundColor: "none"
                          }
                        }
                    }
                  >
                    Usage
                  </Button>
                </Stack>
                {pinned ?
                  <Tooltip title="Unpin" placement="top">
                    <Stack>
                      <TbPinFilled size={24} style={{ cursor: "pointer", color: theme.palette.primary.main }} onClick={handleUpdatePinned} />
                    </Stack>
                  </Tooltip>
                  :
                  <Tooltip title="Pin" placement="top">
                    <Stack>
                      <TbPin size={24} style={{ cursor: "pointer", color: theme.palette.neutral.main }} onClick={handleUpdatePinned} />
                    </Stack>
                  </Tooltip>
                }
              </Stack>
            )}

            <Stack spacing={2} pt={isLandscape ? 1 : 0}>
              <Stack direction={"column"} justifyItems={"space-between"}>
                <Stack spacing={2}>
                  {/* ----- Chinese Text ----- */}
                  <Stack direction={"row"} justifyContent={"space-between"} alignItems={"flex-start"} spacing={isLandscape ? 0 : 1}>
                    <Stack direction={"column"} alignItems={"flex-start"} spacing={0}>
                      {editingText ?
                        <Stack direction={"row"}>
                          <InputBase
                            id={uuidv4()}
                            placeholder={text}
                            onChange={(e) => setNewText(e.target.value)}
                            value={newText}
                            required={true}
                            sx={{
                              color: (difficulty === "1" && mode === "light") ? "#00dac3" :
                                (difficulty === "2" && mode === "light") ? "#d97706" :
                                  difficulty === "1" ? "#03f1c7" :
                                    difficulty === "2" ? "#fbbf24" :
                                      "#ff589e",
                              p: 0,
                              m: 0,
                              fontSize: "2.5rem",
                              lineHeight: 1,
                              borderBottom: `1px solid ${theme.palette.neutral.light}`,
                            }}
                          />
                          <IconButton onClick={handleUpdateVocab}>
                            <IoMdCheckmark color={theme.palette.neutral.dark} style={{ margin: "1rem" }} />
                          </IconButton>
                        </Stack>
                        :
                        <Stack direction={"row"} alignItems={"flex-start"}>
                          <Typography
                            fontSize={isWideScreens ? "3.5rem" : isQHDScreens ? "3rem" : "2.25rem"}
                            lineHeight={1.1}
                            color={(difficulty === "1" && mode === "light") ? "#00dac3" :
                              (difficulty === "2" && mode === "light") ? "#d97706" :
                                difficulty === "1" ? "#03f1c7" :
                                  difficulty === "2" ? "#fbbf24" :
                                    "#ff589e"}
                          >
                            {text}
                          </Typography>
                          <IconButton onClick={() => setEditingText(true)}>
                            <FiEdit2 style={{ color: mode === "light" ? theme.palette.neutral.light : "rgba(41, 54, 56, 0.8)", margin: "0.125rem" }} />
                          </IconButton>
                        </Stack>
                      }

                      {editingPinyin ?
                        <Stack direction={"row"}>
                          <InputBase
                            id={uuidv4()}
                            placeholder={pinyinText}
                            onChange={(e) => setNewPinyin(e.target.value)}
                            value={newPinyin}
                            required={true}
                            sx={{
                              p: 0,
                              m: 0,
                              borderBottom: `1px solid ${theme.palette.neutral.dark}`,
                            }}
                          />
                          <IconButton onClick={handleUpdateVocab}>
                            <IoMdCheckmark color={theme.palette.neutral.dark} />
                          </IconButton>
                        </Stack>
                        :
                        <Typography
                          fontSize={isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem"}
                          color={theme.palette.neutral.dark}
                          fontStyle={"italic"}
                          onClick={() => setEditingPinyin(true)}
                        >
                          {pinyinText}
                        </Typography>
                      }

                    </Stack>
                    <Tooltip title="Menu" placement="right">
                      <Stack sx={{ cursor: "pointer", borderRadius: "6rem", border: `solid 1px rgba(255, 255, 255, 0.15)` }}>
                        <IoMdMore size={24} style={{ cursor: "pointer", color: theme.palette.neutral.mid, margin: "0.5rem" }}
                          onClick={handleMenuClick} />
                      </Stack>
                    </Tooltip>
                  </Stack>

                  <Stack direction={"row"} spacing={1}>
                    <Typography fontSize={isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.8rem"} color={theme.palette.neutral.mid} fontWeight={400}>
                      Definition
                    </Typography>
                    <FiBookOpen size={16} style={{ color: theme.palette.neutral.mid }} />
                  </Stack>
                  {/* ----- Definition ----- */}
                  {editingDef ?
                    <>
                      <Stack direction={"row"}>
                        <InputBase
                          id={uuidv4()}
                          placeholder={definition}
                          onChange={(e) => setNewDef(e.target.value)}
                          value={newDef}
                          multiline={true}
                          required={true}
                          sx={{
                            fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "1rem",
                            width: "100%",
                            lineHeight: 1,
                            p: 0,
                            pb: 1,
                            m: 0,
                            borderBottom: `1px solid ${theme.palette.neutral.light}`,
                          }}
                        />
                        <IconButton onClick={handleUpdateVocab}>
                          <IoMdCheckmark color={theme.palette.neutral.dark} />
                        </IconButton>
                      </Stack>
                    </>
                    :
                    <Stack direction={"column"} spacing={0.25}>
                      <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} spacing={0.25}
                        sx={{
                          border: "none",
                          borderRadius: "0.5rem",
                          padding: "0.5rem 0.75rem",
                          backgroundColor: mode === "light" ? "rgba(180, 180, 180, 0.2)" : "rgba(0, 11, 13, 0.45)", // Semi-transparent background
                          backdropFilter: "blur(10px)", // Apply the glass effect
                          WebkitBackdropFilter: "blur(10px)",
                        }}
                      >
                        <Typography
                          fontSize={isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.9rem"}
                          lineHeight={1.2}
                          color={theme.palette.neutral.darker}>
                          <HighlightCaps text={definition} />
                        </Typography>
                        <IconButton onClick={() => setEditingDef(true)}>
                          <FiEdit2 size={16} style={{ color: mode === "light" ? theme.palette.neutral.light : "rgba(41, 54, 56, 0.8)" }} />
                        </IconButton>
                      </Stack>
                    </Stack>
                  }

                  <Stack spacing={1}>
                    {text.length < 9 && (
                      <>
                        <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                          <Typography fontSize={isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.8rem"} color={theme.palette.neutral.mid} fontWeight={400}>
                            Similar
                          </Typography>
                          <IconButton onClick={openEditSimilar}>
                            <FiEdit2 style={{ color: mode === "light" ? theme.palette.neutral.light : "rgba(41, 54, 56, 0.8)" }} />
                          </IconButton>
                        </Stack>

                        {(!editingSimilar && similar?.length === 0) && (
                          <Button sx={{ border: `solid 1px rgba(41, 54, 56, 0.8)`, borderRadius: "0.5rem" }} onClick={openEditSimilar}>
                            <Typography fontSize={"1.5rem"}>+</Typography>
                          </Button>
                        )}

                        {/* 1st Similar */}
                        {editingSimilar ?
                          <>
                            <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                              <InputBase
                                id={uuidv4()}
                                // placeholder={similar[0]}
                                onChange={(e) => setNewSimilarOne(e.target.value)}
                                value={newSimilarEntry < 1 || newSimilarOne?.length > 0 || removeSimilarOne ? newSimilarOne : similar[0]}
                                required={true}
                                sx={{
                                  width: isLandscape ? "75%" : "70%",
                                  fontSize: isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.5rem",
                                  color: theme.palette.neutral.dark,
                                  border: `solid 1px ${theme.palette.neutral.light}`,
                                  borderRadius: "0.5rem",
                                  padding: "0.25rem 0.5rem",
                                }}
                              />
                              {similar?.length > 0 ? (
                                <Stack>
                                  {removeSimilarOne ?
                                    <Tooltip title="Undo" placement="right">
                                      <IconButton onClick={() => setRemoveSimilarOne(false)}>
                                        <CgUndo color={theme.palette.neutral.dark} />
                                      </IconButton>
                                    </Tooltip>
                                    :
                                    <Tooltip title="Delete" placement="left">
                                      <IconButton onClick={removeSimOne}>
                                        <TbTrashX color={theme.palette.neutral.dark} />
                                      </IconButton>
                                    </Tooltip>
                                  }
                                </Stack>
                              )
                                :
                                <IconButton onClick={subtractSimilarEntry} disabled={newSimilarOne.length > 0}>
                                  <IoMdClose size={16} />
                                </IconButton>
                              }
                              {(similar?.length < 4 && newSimilarEntry < 4) &&
                                <IconButton onClick={addSimilarEntry}>
                                  <IoMdAdd size={16} />
                                </IconButton>
                              }
                            </Stack>

                            {/* 2nd Similar */}
                            {(similar?.length > 1 || newSimilarEntry > 1) && (
                              <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                                <InputBase
                                  id={uuidv4()}
                                  // placeholder={similar[1]}
                                  onChange={(e) => setNewSimilarTwo(e.target.value)}
                                  value={!removeSimilarTwo ? similar[1] : newSimilarTwo}
                                  required={true}
                                  sx={{
                                    width: isLandscape ? "75%" : "70%",
                                    fontSize: isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.5rem",
                                    color: theme.palette.neutral.dark,
                                    border: `solid 1px ${theme.palette.neutral.light}`,
                                    borderRadius: "0.5rem",
                                    padding: "0.25rem 0.5rem",
                                  }}
                                />
                                {similar?.length > 1 ? (
                                  <Stack>
                                    {removeSimilarTwo ?
                                      <Tooltip title="Undo" placement="right">
                                        <IconButton onClick={() => setRemoveSimilarTwo(false)}>
                                          <CgUndo color={theme.palette.neutral.dark} />
                                        </IconButton>
                                      </Tooltip>
                                      :
                                      <Tooltip title="Delete" placement="left">
                                        <IconButton onClick={removeSimTwo}>
                                          <TbTrashX color={theme.palette.neutral.dark} />
                                        </IconButton>
                                      </Tooltip>
                                    }
                                  </Stack>
                                )
                                  :
                                  <IconButton onClick={subtractSimilarEntry} disabled={newSimilarTwo.length > 0}>
                                    <IoMdClose size={16} />
                                  </IconButton>
                                }
                              </Stack>
                            )}

                            {/* 3rd Similar */}
                            {(similar?.length > 2 || newSimilarEntry > 2) && (
                              <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                                <InputBase
                                  id={uuidv4()}
                                  // placeholder={similar[2]}
                                  onChange={(e) => setNewSimilarThree(e.target.value)}
                                  value={!removeSimilarThree ? similar[2] : newSimilarThree}
                                  required={true}
                                  sx={{
                                    width: isLandscape ? "75%" : "70%",
                                    fontSize: isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.5rem",
                                    color: theme.palette.neutral.dark,
                                    border: `solid 1px ${theme.palette.neutral.light}`,
                                    borderRadius: "0.5rem",
                                    padding: "0.25rem 0.5rem",
                                  }}
                                />
                                {similar?.length > 2 ? (
                                  <Stack>
                                    {removeSimilarThree ?
                                      <Tooltip title="Undo" placement="right">
                                        <IconButton onClick={() => setRemoveSimilarThree(false)}>
                                          <CgUndo color={theme.palette.neutral.dark} />
                                        </IconButton>
                                      </Tooltip>
                                      :
                                      <Tooltip title="Delete" placement="left">
                                        <IconButton onClick={removeSimThree}>
                                          <TbTrashX color={theme.palette.neutral.dark} />
                                        </IconButton>
                                      </Tooltip>
                                    }
                                  </Stack>
                                )
                                  :
                                  <IconButton onClick={subtractSimilarEntry} disabled={newSimilarThree.length > 0}>
                                    <IoMdClose size={16} />
                                  </IconButton>
                                }
                              </Stack>
                            )}

                            {/* 4th Similar */}
                            {(similar?.length > 3 || newSimilarEntry > 3) && (
                              <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                                <InputBase
                                  id={uuidv4()}
                                  // placeholder={similar[3]}
                                  onChange={(e) => setNewSimilarFour(e.target.value)}
                                  value={!removeSimilarFour ? similar[3] : newSimilarFour}
                                  required={true}
                                  sx={{
                                    width: isLandscape ? "75%" : "70%",
                                    fontSize: isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.5rem",
                                    color: theme.palette.neutral.dark,
                                    border: `solid 1px ${theme.palette.neutral.light}`,
                                    borderRadius: "0.5rem",
                                    padding: "0.25rem 0.5rem",
                                  }}
                                />
                                {similar?.length > 3 ? (
                                  <Stack>
                                    {removeSimilarFour ?
                                      <Tooltip title="Undo" placement="right">
                                        <IconButton onClick={() => setRemoveSimilarFour(false)}>
                                          <CgUndo color={theme.palette.neutral.dark} />
                                        </IconButton>
                                      </Tooltip>
                                      :
                                      <Tooltip title="Delete" placement="left">
                                        <IconButton onClick={removeSimFour}>
                                          <TbTrashX color={theme.palette.neutral.dark} />
                                        </IconButton>
                                      </Tooltip>
                                    }
                                  </Stack>
                                )
                                  :
                                  <IconButton onClick={subtractSimilarEntry} disabled={newSimilarFour.length > 0}>
                                    <IoMdClose size={16} />
                                  </IconButton>
                                }
                              </Stack>
                            )}
                            <Button
                              onClick={handleUpdateSimilar}
                              sx={{ fontSize: isWideScreens ? "1.25rem" : isQHDScreens ? "1rem" : "0.8rem" }}
                            >
                              Done
                            </Button>
                          </>
                          :
                          <>
                            {/* ----- Similar ----- */}
                            <Stack
                              // onClick={openEditSimilar} 
                              direction={"row"} alignItems={"center"} spacing={2}>
                              <Stack>
                                <Stack
                                  direction={"row"}
                                  alignItems={"center"}
                                  spacing={0}
                                  flexWrap={"wrap"}
                                >
                                  {similar?.map((item, index) => (
                                    <Stack
                                      key={`${item}-${index}`}
                                      spacing={0}
                                      sx={{
                                        borderRadius: "0.75rem",
                                        padding: "0.25rem 0.75rem",
                                      }}
                                    >
                                      <SimilarText item={item} searchSimilar={searchSimilar} />
                                      <Typography
                                        fontSize={isWideScreens ? "1.5rem" : isQHDScreens ? "1rem" : "0.8rem"}
                                        lineHeight={1}
                                        fontStyle={"italic"}
                                        color={theme.palette.primary.dark}
                                      >
                                        {item ? pinyin(item) : ""}
                                      </Typography>
                                    </Stack>
                                  ))}
                                </Stack>
                              </Stack>
                            </Stack>
                          </>
                        }
                      </>
                    )}
                  </Stack>

                </Stack>
              </Stack>

            </Stack>
          </Stack>

          <Stack>

            {/* ----- Labels ----- */}
            <Stack>
              {editingLabels &&
                <Stack direction="row" alignItems={"center"} justifyContent={"space-between"}>
                  <Typography
                    sx={{ fontSize: isWideScreens ? "1.25rem" : isQHDScreens ? "1rem" : "0.8rem", textAlign: "flex-start", color: theme.palette.neutral.mid }}
                  >
                    Select New Labels
                  </Typography>
                  <Button onClick={handleUpdateLabels}
                    sx={{ fontSize: isWideScreens ? "1.25rem" : isQHDScreens ? "1rem" : "0.8rem" }}
                  >
                    Done
                  </Button>
                </Stack>
              }
              {editingLabels &&
                <Stack direction="row" flexWrap={"wrap"} alignItems={"center"} justifyContent={"flex-start"} spacing={0} pr={0.5}
                  sx={{
                    border: `solid 1px rgba(255, 255, 255, 0.15)`,
                    borderRadius: "0.75rem",
                    padding: "0.5rem",
                  }}
                >
                  {labelsData?.[0].label.map((text, index) => (
                    <Stack key={index} direction="row" spacing={0} p={0.5} alignItems={"center"} sx={{ cursor: "pointer" }}>
                      <Checkbox
                        color="primary"
                        value={text}
                        checked={checkedLabels?.includes(text)} // Control the checked state
                        onChange={() => handleCheckboxChange(text)} // Handle checkbox change
                        sx={{
                          p: 0.25,
                        }}
                      />
                      <Typography
                        onClick={() => handleCheckboxChange(text)}
                        color={checkedLabels?.includes(text) ? theme.palette.primary.main : theme.palette.neutral.darker}
                        fontSize={isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.9rem"}
                      >
                        {text}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              }

              {label?.length > 0 ?
                <Stack direction={"row"} alignItems={"center"}
                  justifyContent={"flex-end"}
                  pb={isPortrait ? 1 : 0}
                  spacing={1}
                  pt={4}
                >
                  <Stack onClick={() => setEditingLabels(true)}
                    direction={"row"}
                    flexWrap={"wrap"}
                    alignItems={"center"}
                    alignContent={"flex-end"}
                    justifyContent={"flex-end"}
                    spacing={0}>
                    {label?.map((item, index) => (
                      <Stack
                        key={`${item}-${index}`}
                        sx={{
                          margin: "0.25rem",
                          cursor: "pointer",
                          color: theme.palette.neutral.mid,
                          border: mode === "dark" ? `solid 1px rgba(255,255,255, 0.15)` : `solid 1px ${theme.palette.neutral.mid}`,
                          borderRadius: "6rem",
                          padding: "0.25rem 0.75rem",
                        }}
                      >
                        <Typography fontSize={isWideScreens ? "1.25rem" : isQHDScreens ? "1rem" : "0.8rem"} color={theme.palette.neutral.darker}
                        >
                          {item}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
                :
                <Stack direction={"row"} alignItems={"center"}
                  justifyContent={editingLabels ? "space-between" : "flex-end"}
                  pb={isPortrait ? 1 : 0}
                  spacing={1}
                  pt={4}
                >
                  {editingLabels ?
                    <Button onClick={handleUpdateLabels}
                      sx={{ fontSize: isWideScreens ? "1.25rem" : isQHDScreens ? "1rem" : "0.8rem" }}
                    >
                      Done
                    </Button>
                    :
                    <Typography fontSize={isWideScreens ? "1.25rem" : isQHDScreens ? "1rem" : "0.8rem"} color={theme.palette.neutral.medium}>
                      Label
                    </Typography>
                  }
                  <IconButton onClick={() => setEditingLabels(true)}>
                    <IoAddCircleOutline size={36} style={{ color: theme.palette.neutral.medium }} />
                  </IconButton>
                </Stack>
              }

            </Stack>

            {isPortrait && (
              <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} pt={1} borderTop={`solid 1px rgba(255,255,255, 0.15)`}>
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <Button
                    onClick={handleViewVocab}
                    sx={
                      viewVocab ?
                        {
                          color: mode === "dark" ? theme.palette.neutral.darker : theme.palette.neutral.lighter,
                          margin: 0,
                          padding: "0.25rem 0.5rem",
                          borderRadius: "3.5rem",
                          fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.75rem",
                          textTransform: "none",
                          backgroundColor: mode === "dark" ? "rgba(255,255,255, 0.1)" : theme.palette.neutral.dark,
                          ":hover": {
                            color: mode === "dark" ? theme.palette.neutral.darker : theme.palette.neutral.lighter,
                            cursor: "default",
                            backgroundColor: mode === "dark" ? "rgba(255,255,255, 0.1)" : theme.palette.neutral.dark,
                          }
                        }
                        :
                        {
                          color: theme.palette.neutral.mid,
                          margin: 0,
                          padding: isWideScreens ? "0.5rem 1.25rem" : isQHDScreens ? "0.5rem 1rem" : "0.25rem 0.5rem",
                          borderRadius: "3.5rem",
                          fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.75rem",
                          textTransform: "none",
                          backgroundColor: "none",
                          ":hover": {
                            color: theme.palette.primary.main,
                            backgroundColor: "none"
                          }
                        }
                    }
                  >
                    Vocab
                  </Button>
                  <Button
                    onClick={handleViewUsage}
                    sx={
                      viewUsage ?
                        {
                          color: mode === "dark" ? theme.palette.neutral.darker : theme.palette.neutral.lighter,
                          margin: 0,
                          padding: isWideScreens ? "0.5rem 1.25rem" : isQHDScreens ? "0.5rem 1rem" : "0.25rem 0.5rem",
                          borderRadius: "3.5rem",
                          fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.75rem",
                          textTransform: "none",
                          backgroundColor: mode === "dark" ? "rgba(255,255,255, 0.1)" : theme.palette.neutral.dark,
                          ":hover": {
                            color: mode === "dark" ? theme.palette.neutral.darker : theme.palette.neutral.lighter,
                            cursor: "default",
                            backgroundColor: mode === "dark" ? "rgba(255,255,255, 0.1)" : theme.palette.neutral.dark,
                          }
                        }
                        :
                        {
                          color: theme.palette.neutral.mid,
                          margin: 0,
                          padding: isWideScreens ? "0.5rem 1.25rem" : isQHDScreens ? "0.5rem 1rem" : "0.25rem 0.5rem",
                          borderRadius: "3.5rem",
                          fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.75rem",
                          textTransform: "none",
                          backgroundColor: "none",
                          ":hover": {
                            color: theme.palette.primary.main,
                            backgroundColor: "none"
                          }
                        }
                    }
                  >
                    Usage
                  </Button>
                </Stack>
                {pinned ?
                  <Tooltip title="Unpin" placement="top">
                    <Stack>
                      <TbPinFilled size={24} style={{ cursor: "pointer", color: theme.palette.primary.main }} onClick={handleUpdatePinned} />
                    </Stack>
                  </Tooltip>
                  :
                  <Tooltip title="Pin" placement="top">
                    <Stack>
                      <TbPin size={24} style={{ cursor: "pointer", color: theme.palette.neutral.main }} onClick={handleUpdatePinned} />
                    </Stack>
                  </Tooltip>
                }
              </Stack>
            )}
          </Stack>
        </Stack>
      ) : (
        <>
          {/* Usage Section */}
          <Stack
            height={isPortrait ? "66vh" : isWideScreens ? "67vh" : isQHDScreens ? "60vh" : "68vh"}
            justifyContent={"space-between"}
          >
            <Stack>
              {isLandscape && (
                <Stack direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"} pb={1.5}
                  borderBottom={mode === "dark" ? `solid 1px rgba(255,255,255, 0.15)` : `solid 1px ${theme.palette.neutral.lighter}`}
                >
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <Button
                      onClick={handleViewVocab}
                      sx={
                        viewVocab ?
                          {
                            color: mode === "dark" ? theme.palette.neutral.darker : theme.palette.neutral.lighter,
                            margin: 0,
                            padding: isWideScreens ? "0.5rem 1.25rem" : isQHDScreens ? "0.5rem 1rem" : "0.25rem 0.5rem",
                            borderRadius: "3.5rem",
                            fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.75rem",
                            textTransform: "none",
                            backgroundColor: mode === "dark" ? "rgba(255,255,255, 0.1)" : theme.palette.neutral.dark,
                            ":hover": {
                              color: mode === "dark" ? theme.palette.neutral.darker : theme.palette.neutral.lighter,
                              cursor: "default",
                              backgroundColor: mode === "dark" ? "rgba(255,255,255, 0.1)" : theme.palette.neutral.dark,

                            }
                          }
                          :
                          {
                            color: theme.palette.neutral.mid,
                            margin: 0,
                            padding: isWideScreens ? "0.5rem 1rem" : isQHDScreens ? "0.5rem 0.75rem" : "0.25rem 0.5rem",
                            borderRadius: "3.5rem",
                            fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.75rem",
                            textTransform: "none",
                            backgroundColor: "none",
                            ":hover": {
                              color: theme.palette.primary.main,
                              backgroundColor: "none"
                            }
                          }
                      }
                    >
                      Vocab
                    </Button>
                    <Button
                      onClick={handleViewUsage}
                      sx={
                        viewUsage ?
                          {
                            color: mode === "dark" ? theme.palette.neutral.darker : theme.palette.neutral.lighter,
                            margin: 0,
                            padding: isWideScreens ? "0.5rem 1rem" : isQHDScreens ? "0.5rem 0.75rem" : "0.25rem 0.5rem",
                            borderRadius: "3.5rem",
                            fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.75rem",
                            textTransform: "none",
                            backgroundColor: mode === "dark" ? "rgba(255,255,255, 0.1)" : theme.palette.neutral.dark,
                            ":hover": {
                              color: mode === "dark" ? theme.palette.neutral.darker : theme.palette.neutral.lighter,
                              cursor: "default",
                              backgroundColor: mode === "dark" ? "rgba(255,255,255, 0.1)" : theme.palette.neutral.dark,

                            }
                          }
                          :
                          {
                            color: theme.palette.neutral.mid,
                            margin: 0,
                            padding: isWideScreens ? "0.5rem 1rem" : isQHDScreens ? "0.5rem 0.75rem" : "0.25rem 0.5rem",
                            borderRadius: "3.5rem",
                            fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.75rem",
                            textTransform: "none",
                            backgroundColor: "none",
                            ":hover": {
                              color: theme.palette.primary.main,
                              backgroundColor: "none"
                            }
                          }
                      }
                    >
                      Usage
                    </Button>
                  </Stack>
                  {pinned ?
                    <Tooltip title="Unpin" placement="top">
                      <Stack>
                        <TbPinFilled size={24} style={{ cursor: "pointer", color: theme.palette.primary.main }} onClick={handleUpdatePinned} />
                      </Stack>
                    </Tooltip>
                    :
                    <Tooltip title="Pin" placement="top">
                      <Stack>
                        <TbPin size={24} style={{ cursor: "pointer", color: theme.palette.neutral.main }} onClick={handleUpdatePinned} />
                      </Stack>
                    </Tooltip>
                  }
                </Stack>
              )}

              <Stack pt={isLandscape ? 1 : 0}>
                <Stack direction={"column"} justifyItems={"space-between"}>
                  <Stack spacing={1}>
                    <Typography fontSize={isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.8rem"} color={theme.palette.neutral.mid} fontWeight={400}>
                      Expressions
                    </Typography>

                    {(!editingExpressions && expression?.length === 0) && (
                      <Button sx={{ border: `solid 1px rgba(41, 54, 56, 0.8)`, borderRadius: "0.5rem" }} onClick={openEditExpressions}>
                        <Typography fontSize={"1.5rem"}>+</Typography>
                      </Button>
                    )}

                    {/* 1st Expression */}
                    {editingExpressions ?
                      <>
                        <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                          <InputBase
                            id={uuidv4()}
                            onChange={(e) => setNewExpressionsOne(e.target.value)}
                            value={newExpressionsEntry < 1 || newExpressionsOne?.length > 0 || removeExpressionsOne ? newExpressionsOne : expression[0]}
                            required={true}
                            sx={{
                              width: isLandscape ? "75%" : "70%",
                              fontSize: isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.5rem",
                              color: theme.palette.neutral.dark,
                              border: `solid 1px ${theme.palette.neutral.light}`,
                              borderRadius: "0.5rem",
                              padding: "0.25rem 0.5rem",
                            }}
                          />
                          {expression?.length > 0 ? (
                            <Stack>
                              {removeExpressionsOne ?
                                <Tooltip title="Undo" placement="right">
                                  <IconButton onClick={() => setRemoveExpressionsOne(false)}>
                                    <CgUndo color={theme.palette.neutral.dark} />
                                  </IconButton>
                                </Tooltip>
                                :
                                <Tooltip title="Delete" placement="left">
                                  <IconButton onClick={removeExpOne}>
                                    <TbTrashX color={theme.palette.neutral.dark} />
                                  </IconButton>
                                </Tooltip>
                              }
                            </Stack>
                          )
                            :
                            <IconButton onClick={subtractExpressionsEntry} disabled={newExpressionsOne.length > 0}>
                              <IoMdClose size={16} />
                            </IconButton>
                          }
                          {(expression?.length < 8 && newExpressionsEntry < 8) &&
                            <IconButton onClick={addExpressionsEntry}>
                              <IoMdAdd size={16} />
                            </IconButton>
                          }
                        </Stack>

                        {/* 2nd Expression */}
                        {(expression?.length > 1 || newExpressionsEntry > 1) && (
                          <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                            <InputBase
                              id={uuidv4()}
                              onChange={(e) => setNewExpressionsTwo(e.target.value)}
                              value={!removeExpressionsTwo ? expression[1] : newExpressionsTwo}
                              required={true}
                              sx={{
                                width: isLandscape ? "75%" : "70%",
                                fontSize: isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.5rem",
                                color: theme.palette.neutral.dark,
                                border: `solid 1px ${theme.palette.neutral.light}`,
                                borderRadius: "0.5rem",
                                padding: "0.25rem 0.5rem",
                              }}
                            />
                            {expression?.length > 1 ? (
                              <Stack>
                                {removeExpressionsTwo ?
                                  <Tooltip title="Undo" placement="right">
                                    <IconButton onClick={() => setRemoveExpressionsTwo(false)}>
                                      <CgUndo color={theme.palette.neutral.dark} />
                                    </IconButton>
                                  </Tooltip>
                                  :
                                  <Tooltip title="Delete" placement="left">
                                    <IconButton onClick={removeExpTwo}>
                                      <TbTrashX color={theme.palette.neutral.dark} />
                                    </IconButton>
                                  </Tooltip>
                                }
                              </Stack>
                            )
                              :
                              <IconButton onClick={subtractExpressionsEntry} disabled={newExpressionsTwo.length > 0}>
                                <IoMdClose size={16} />
                              </IconButton>
                            }
                          </Stack>
                        )}

                        {/* 3rd Expression */}
                        {(expression?.length > 2 || newExpressionsEntry > 2) && (
                          <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                            <InputBase
                              id={uuidv4()}
                              onChange={(e) => setNewExpressionsThree(e.target.value)}
                              value={!removeExpressionsThree ? expression[2] : newExpressionsThree}
                              required={true}
                              sx={{
                                width: isLandscape ? "75%" : "70%",
                                fontSize: isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.5rem",
                                color: theme.palette.neutral.dark,
                                border: `solid 1px ${theme.palette.neutral.light}`,
                                borderRadius: "0.5rem",
                                padding: "0.25rem 0.5rem",
                              }}
                            />
                            {expression?.length > 2 ? (
                              <Stack>
                                {removeExpressionsThree ?
                                  <Tooltip title="Undo" placement="right">
                                    <IconButton onClick={() => setRemoveExpressionsThree(false)}>
                                      <CgUndo color={theme.palette.neutral.dark} />
                                    </IconButton>
                                  </Tooltip>
                                  :
                                  <Tooltip title="Delete" placement="left">
                                    <IconButton onClick={removeExpThree}>
                                      <TbTrashX color={theme.palette.neutral.dark} />
                                    </IconButton>
                                  </Tooltip>
                                }
                              </Stack>
                            )
                              :
                              <IconButton onClick={subtractExpressionsEntry} disabled={newExpressionsThree.length > 0}>
                                <IoMdClose size={16} />
                              </IconButton>
                            }
                          </Stack>
                        )}

                        {/* 4th Expression */}
                        {(expression?.length > 3 || newExpressionsEntry > 3) && (
                          <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                            <InputBase
                              id={uuidv4()}
                              onChange={(e) => setNewExpressionsFour(e.target.value)}
                              value={!removeExpressionsFour ? expression[3] : newExpressionsFour}
                              required={true}
                              sx={{
                                width: isLandscape ? "75%" : "70%",
                                fontSize: isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.5rem",
                                color: theme.palette.neutral.dark,
                                border: `solid 1px ${theme.palette.neutral.light}`,
                                borderRadius: "0.5rem",
                                padding: "0.25rem 0.5rem",
                              }}
                            />
                            {expression?.length > 3 ? (
                              <Stack>
                                {removeExpressionsFour ?
                                  <Tooltip title="Undo" placement="right">
                                    <IconButton onClick={() => setRemoveExpressionsFour(false)}>
                                      <CgUndo color={theme.palette.neutral.dark} />
                                    </IconButton>
                                  </Tooltip>
                                  :
                                  <Tooltip title="Delete" placement="left">
                                    <IconButton onClick={removeExpFour}>
                                      <TbTrashX color={theme.palette.neutral.dark} />
                                    </IconButton>
                                  </Tooltip>
                                }
                              </Stack>
                            )
                              :
                              <IconButton onClick={subtractExpressionsEntry} disabled={newExpressionsFour.length > 0}>
                                <IoMdClose size={16} />
                              </IconButton>
                            }
                          </Stack>
                        )}

                        {/* 5th Expression */}
                        {(expression?.length > 4 || newExpressionsEntry > 4) && (
                          <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                            <InputBase
                              id={uuidv4()}
                              onChange={(e) => setNewExpressionsFive(e.target.value)}
                              value={!removeExpressionsFive ? expression[4] : newExpressionsFive}
                              required={true}
                              sx={{
                                width: isLandscape ? "75%" : "70%",
                                fontSize: isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.5rem",
                                color: theme.palette.neutral.dark,
                                border: `solid 1px ${theme.palette.neutral.light}`,
                                borderRadius: "0.5rem",
                                padding: "0.25rem 0.5rem",
                              }}
                            />
                            {expression?.length > 4 ? (
                              <Stack>
                                {removeExpressionsFive ?
                                  <Tooltip title="Undo" placement="right">
                                    <IconButton onClick={() => setRemoveExpressionsFive(false)}>
                                      <CgUndo color={theme.palette.neutral.dark} />
                                    </IconButton>
                                  </Tooltip>
                                  :
                                  <Tooltip title="Delete" placement="left">
                                    <IconButton onClick={removeExpFive}>
                                      <TbTrashX color={theme.palette.neutral.dark} />
                                    </IconButton>
                                  </Tooltip>
                                }
                              </Stack>
                            )
                              :
                              <IconButton onClick={subtractExpressionsEntry} disabled={newExpressionsFive.length > 0}>
                                <IoMdClose size={16} />
                              </IconButton>
                            }
                          </Stack>
                        )}

                        {/* 6th Expression */}
                        {(expression?.length > 5 || newExpressionsEntry > 5) && (
                          <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                            <InputBase
                              id={uuidv4()}
                              onChange={(e) => setNewExpressionsSix(e.target.value)}
                              value={!removeExpressionsSix ? expression[5] : newExpressionsSix}
                              required={true}
                              sx={{
                                width: isLandscape ? "75%" : "70%",
                                fontSize: isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.5rem",
                                color: theme.palette.neutral.dark,
                                border: `solid 1px ${theme.palette.neutral.light}`,
                                borderRadius: "0.5rem",
                                padding: "0.25rem 0.5rem",
                              }}
                            />
                            {expression?.length > 5 ? (
                              <Stack>
                                {removeExpressionsSix ?
                                  <Tooltip title="Undo" placement="right">
                                    <IconButton onClick={() => setRemoveExpressionsSix(false)}>
                                      <CgUndo color={theme.palette.neutral.dark} />
                                    </IconButton>
                                  </Tooltip>
                                  :
                                  <Tooltip title="Delete" placement="left">
                                    <IconButton onClick={removeExpSix}>
                                      <TbTrashX color={theme.palette.neutral.dark} />
                                    </IconButton>
                                  </Tooltip>
                                }
                              </Stack>
                            )
                              :
                              <IconButton onClick={subtractExpressionsEntry} disabled={newExpressionsSix.length > 0}>
                                <IoMdClose size={16} />
                              </IconButton>
                            }
                          </Stack>
                        )}

                        {/* 7th Expression */}
                        {(expression?.length > 6 || newExpressionsEntry > 6) && (
                          <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                            <InputBase
                              id={uuidv4()}
                              onChange={(e) => setNewExpressionsSeven(e.target.value)}
                              value={!removeExpressionsSeven ? expression[6] : newExpressionsSeven}
                              required={true}
                              sx={{
                                width: isLandscape ? "75%" : "70%",
                                fontSize: isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.5rem",
                                color: theme.palette.neutral.dark,
                                border: `solid 1px ${theme.palette.neutral.light}`,
                                borderRadius: "0.5rem",
                                padding: "0.25rem 0.5rem",
                              }}
                            />
                            {expression?.length > 6 ? (
                              <Stack>
                                {removeExpressionsSeven ?
                                  <Tooltip title="Undo" placement="right">
                                    <IconButton onClick={() => setRemoveExpressionsSeven(false)}>
                                      <CgUndo color={theme.palette.neutral.dark} />
                                    </IconButton>
                                  </Tooltip>
                                  :
                                  <Tooltip title="Delete" placement="left">
                                    <IconButton onClick={removeExpSeven}>
                                      <TbTrashX color={theme.palette.neutral.dark} />
                                    </IconButton>
                                  </Tooltip>
                                }
                              </Stack>
                            )
                              :
                              <IconButton onClick={subtractExpressionsEntry} disabled={newExpressionsSeven.length > 0}>
                                <IoMdClose size={16} />
                              </IconButton>
                            }
                          </Stack>
                        )}

                        {/* 8th Expression */}
                        {(expression?.length > 7 || newExpressionsEntry > 7) && (
                          <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                            <InputBase
                              id={uuidv4()}
                              onChange={(e) => setNewExpressionsEight(e.target.value)}
                              value={!removeExpressionsEight ? expression[7] : newExpressionsEight}
                              required={true}
                              sx={{
                                width: isLandscape ? "75%" : "70%",
                                fontSize: isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.5rem",
                                color: theme.palette.neutral.dark,
                                border: `solid 1px ${theme.palette.neutral.light}`,
                                borderRadius: "0.5rem",
                                padding: "0.25rem 0.5rem",
                              }}
                            />
                            {expression?.length > 7 ? (
                              <Stack>
                                {removeExpressionsEight ?
                                  <Tooltip title="Undo" placement="right">
                                    <IconButton onClick={() => setRemoveExpressionsEight(false)}>
                                      <CgUndo color={theme.palette.neutral.dark} />
                                    </IconButton>
                                  </Tooltip>
                                  :
                                  <Tooltip title="Delete" placement="left">
                                    <IconButton onClick={removeExpEight}>
                                      <TbTrashX color={theme.palette.neutral.dark} />
                                    </IconButton>
                                  </Tooltip>
                                }
                              </Stack>
                            )
                              :
                              <IconButton onClick={subtractExpressionsEntry} disabled={newExpressionsEight.length > 0}>
                                <IoMdClose size={16} />
                              </IconButton>
                            }
                          </Stack>
                        )}

                        <Button
                          onClick={handleUpdateExpressions}
                          sx={{ fontSize: isWideScreens ? "1.25rem" : isQHDScreens ? "1rem" : "0.8rem" }}
                        >
                          Done
                        </Button>
                      </>
                      :
                      <>
                        {/* ----- Expression ----- */}
                        <Stack onClick={openEditExpressions} direction={"row"} alignItems={"center"} spacing={2}>
                          <Stack>
                            <Stack
                              direction={"row"}
                              alignItems={"center"}
                              spacing={0}
                              flexWrap={"wrap"}
                            >
                              {expression?.map((item, index) => (
                                <Stack
                                  key={`${item}-${index}`}
                                  spacing={0}
                                  sx={{
                                    cursor: "pointer",
                                    borderRadius: "0.75rem",
                                    padding: "0.25rem 0.5rem",
                                  }}
                                >
                                  <Typography lineHeight={1.1} fontSize={isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.5rem"}>{item}</Typography>
                                  <Typography
                                    fontSize={isWideScreens ? "1.5rem" : isQHDScreens ? "1rem" : "0.8rem"}
                                    lineHeight={1}
                                    fontStyle={"italic"}
                                    color={theme.palette.primary.dark}
                                  >
                                    {item ? pinyin(item) : ""}
                                  </Typography>
                                </Stack>
                              ))}
                            </Stack>
                          </Stack>
                        </Stack>
                      </>
                    }

                    <Typography fontSize={isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.8rem"} color={theme.palette.neutral.mid} fontWeight={400}>
                      Sentences
                    </Typography>

                    {(!editingSentences && sentence?.length === 0) && (
                      <Button sx={{ border: `solid 1px rgba(41, 54, 56, 0.8)`, borderRadius: "0.5rem" }} onClick={openEditSentences}>
                        <Typography fontSize={"1.5rem"}>+</Typography>
                      </Button>
                    )}

                    {/* 1st Sentence */}
                    {editingSentences ?
                      <>
                        <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                          <InputBase
                            id={uuidv4()}
                            onChange={(e) => setNewSentencesOne(e.target.value)}
                            value={newSentencesEntry < 1 || newSentencesOne?.length > 0 || removeSentencesOne ? newSentencesOne : sentence[0]}
                            multiline
                            rows={3}
                            required={true}
                            sx={{
                              width: isLandscape ? "75%" : "70%",
                              fontSize: isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.5rem",
                              color: theme.palette.neutral.dark,
                              border: `solid 1px ${theme.palette.neutral.light}`,
                              borderRadius: "0.5rem",
                              padding: "0.25rem 0.5rem",
                            }}
                          />
                          {sentence?.length > 0 ? (
                            <Stack>
                              {removeSentencesOne ?
                                <Tooltip title="Undo" placement="right">
                                  <IconButton onClick={() => setRemoveSentencesOne(false)}>
                                    <CgUndo color={theme.palette.neutral.dark} />
                                  </IconButton>
                                </Tooltip>
                                :
                                <Tooltip title="Delete" placement="left">
                                  <IconButton onClick={removeSenOne}>
                                    <TbTrashX color={theme.palette.neutral.dark} />
                                  </IconButton>
                                </Tooltip>
                              }
                            </Stack>
                          )
                            :
                            <IconButton onClick={subtractSentencesEntry} disabled={newSentencesOne.length > 0}>
                              <IoMdClose size={16} />
                            </IconButton>
                          }
                          {(sentence?.length < 8 && newSentencesEntry < 8) &&
                            <IconButton onClick={addSentencesEntry}>
                              <IoMdAdd size={16} />
                            </IconButton>
                          }
                        </Stack>

                        {/* 2nd Sentence */}
                        {(sentence?.length > 1 || newSentencesEntry > 1) && (
                          <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                            <InputBase
                              id={uuidv4()}
                              onChange={(e) => setNewSentencesTwo(e.target.value)}
                              value={!removeSentencesTwo ? sentence[1] : newSentencesTwo}
                              multiline
                              rows={3}
                              required={true}
                              sx={{
                                width: isLandscape ? "75%" : "70%",
                                fontSize: isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.5rem",
                                color: theme.palette.neutral.dark,
                                border: `solid 1px ${theme.palette.neutral.light}`,
                                borderRadius: "0.5rem",
                                padding: "0.25rem 0.5rem",
                              }}
                            />
                            {sentence?.length > 1 ? (
                              <Stack>
                                {removeSentencesTwo ?
                                  <Tooltip title="Undo" placement="right">
                                    <IconButton onClick={() => setRemoveSentencesTwo(false)}>
                                      <CgUndo color={theme.palette.neutral.dark} />
                                    </IconButton>
                                  </Tooltip>
                                  :
                                  <Tooltip title="Delete" placement="left">
                                    <IconButton onClick={removeSenTwo}>
                                      <TbTrashX color={theme.palette.neutral.dark} />
                                    </IconButton>
                                  </Tooltip>
                                }
                              </Stack>
                            )
                              :
                              <IconButton onClick={subtractSentencesEntry} disabled={newSentencesTwo.length > 0}>
                                <IoMdClose size={16} />
                              </IconButton>
                            }
                          </Stack>
                        )}

                        {/* 3rd Sentence */}
                        {(sentence?.length > 2 || newSentencesEntry > 2) && (
                          <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                            <InputBase
                              id={uuidv4()}
                              onChange={(e) => setNewSentencesThree(e.target.value)}
                              value={!removeSentencesThree ? sentence[2] : newSentencesThree}
                              multiline
                              rows={3}
                              required={true}
                              sx={{
                                width: isLandscape ? "75%" : "70%",
                                fontSize: isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.5rem",
                                color: theme.palette.neutral.dark,
                                border: `solid 1px ${theme.palette.neutral.light}`,
                                borderRadius: "0.5rem",
                                padding: "0.25rem 0.5rem",
                              }}
                            />
                            {sentence?.length > 2 ? (
                              <Stack>
                                {removeSentencesThree ?
                                  <Tooltip title="Undo" placement="right">
                                    <IconButton onClick={() => setRemoveSentencesThree(false)}>
                                      <CgUndo color={theme.palette.neutral.dark} />
                                    </IconButton>
                                  </Tooltip>
                                  :
                                  <Tooltip title="Delete" placement="left">
                                    <IconButton onClick={removeSenThree}>
                                      <TbTrashX color={theme.palette.neutral.dark} />
                                    </IconButton>
                                  </Tooltip>
                                }
                              </Stack>
                            )
                              :
                              <IconButton onClick={subtractSentencesEntry} disabled={newSentencesThree.length > 0}>
                                <IoMdClose size={16} />
                              </IconButton>
                            }
                          </Stack>
                        )}

                        {/* 4th Sentence */}
                        {(sentence?.length > 3 || newSentencesEntry > 3) && (
                          <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                            <InputBase
                              id={uuidv4()}
                              onChange={(e) => setNewSentencesFour(e.target.value)}
                              value={!removeSentencesFour ? sentence[3] : newSentencesFour}
                              multiline
                              rows={3}
                              required={true}
                              sx={{
                                width: isLandscape ? "75%" : "70%",
                                fontSize: isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.5rem",
                                color: theme.palette.neutral.dark,
                                border: `solid 1px ${theme.palette.neutral.light}`,
                                borderRadius: "0.5rem",
                                padding: "0.25rem 0.5rem",
                              }}
                            />
                            {sentence?.length > 3 ? (
                              <Stack>
                                {removeSentencesFour ?
                                  <Tooltip title="Undo" placement="right">
                                    <IconButton onClick={() => setRemoveSentencesFour(false)}>
                                      <CgUndo color={theme.palette.neutral.dark} />
                                    </IconButton>
                                  </Tooltip>
                                  :
                                  <Tooltip title="Delete" placement="left">
                                    <IconButton onClick={removeSenFour}>
                                      <TbTrashX color={theme.palette.neutral.dark} />
                                    </IconButton>
                                  </Tooltip>
                                }
                              </Stack>
                            )
                              :
                              <IconButton onClick={subtractSentencesEntry} disabled={newSentencesFour.length > 0}>
                                <IoMdClose size={16} />
                              </IconButton>
                            }
                          </Stack>
                        )}

                        <Button
                          onClick={handleUpdateSentences}
                          sx={{ fontSize: isWideScreens ? "1.25rem" : isQHDScreens ? "1rem" : "0.8rem" }}
                        >
                          Done
                        </Button>
                      </>
                      :
                      <>
                        {/* ----- Sentence ----- */}
                        <Stack onClick={openEditSentences} direction={"row"} alignItems={"center"} spacing={2}>
                          <Stack>
                            <Stack
                              direction={"column"}
                              alignItems={"flex-start"}
                              spacing={0.5}
                              flexWrap={"wrap"}
                              pb={1}
                            >
                              {sentence?.map((item, index) => (
                                <Stack
                                  key={`${item}-${index}`}
                                  spacing={0.5}
                                  sx={{
                                    cursor: "pointer",
                                    borderRadius: "0.5rem",
                                    padding: "0.5rem 0.75rem",
                                    backgroundColor: mode === "light" ? "rgba(180, 180, 180, 0.2)" : "rgba(0, 11, 13, 0.45)", // Semi-transparent background
                                    backdropFilter: "blur(10px)", // Apply the glass effect
                                    WebkitBackdropFilter: "blur(10px)",
                                  }}
                                >
                                  <Typography lineHeight={1.1}
                                    fontSize={isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : isPortrait ? "1.5rem" : "1.5rem"}>
                                    {item}
                                  </Typography>
                                  <Typography
                                    fontSize={isWideScreens ? "1.5rem" : isQHDScreens ? "1rem" : "0.8rem"}
                                    lineHeight={1}
                                    fontStyle={"italic"}
                                    color={theme.palette.primary.dark}
                                  >
                                    {item ? pinyin(item) : ""}
                                  </Typography>
                                </Stack>
                              ))}
                            </Stack>
                          </Stack>
                        </Stack>
                      </>
                    }

                  </Stack>
                </Stack>

              </Stack>
            </Stack>

            {isPortrait && (
              <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} mt={1} pt={1}
                pb={(expression.length > 6 && sentence.length > 1) ||
                  (expression[0]?.length > 4
                    && expression[1]?.length > 4
                    && expression[2]?.length > 4
                    && expression[3]?.length > 4
                    && expression[4]?.length > 4
                    && expression[5]?.length > 4
                    && expression[6]?.length > 4
                  ) ||
                  (expression[0]?.length > 4
                    && expression[1]?.length > 4
                    && expression[2]?.length > 4
                    && expression[3]?.length > 4
                    && expression[4]?.length > 4
                    && expression[5]?.length > 4
                    && sentence[0]?.length > 9
                  ) ||
                  (sentence.length > 3) ? 2 : 0}
                borderTop={`solid 1px rgba(255,255,255, 0.15)`}>
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <Button
                    onClick={handleViewVocab}
                    // className={mode === "dark" ? "gradient-button-dark" : "gradient-button"}
                    sx={
                      viewVocab ?
                        {
                          color: mode === "dark" ? theme.palette.neutral.darker : theme.palette.neutral.lighter,
                          margin: 0,
                          padding: "0.25rem 0.5rem",
                          borderRadius: "3.5rem",
                          fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.75rem",
                          textTransform: "none",
                          backgroundColor: mode === "dark" ? "rgba(255,255,255, 0.1)" : theme.palette.neutral.dark,
                          ":hover": {
                            color: mode === "dark" ? theme.palette.neutral.darker : theme.palette.neutral.lighter,
                            cursor: "default",
                            backgroundColor: mode === "dark" ? "rgba(255,255,255, 0.1)" : theme.palette.neutral.dark,
                          }
                        }
                        :
                        {
                          color: theme.palette.neutral.mid,
                          margin: 0,
                          padding: isWideScreens ? "0.5rem 1.25rem" : isQHDScreens ? "0.5rem 1rem" : "0.25rem 0.5rem",
                          borderRadius: "3.5rem",
                          fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.75rem",
                          textTransform: "none",
                          backgroundColor: "none",
                          ":hover": {
                            color: theme.palette.primary.main,
                            backgroundColor: "none"
                          }
                        }
                    }
                  >
                    Vocab
                  </Button>
                  <Button
                    // className={mode === "dark" ? "gradient-button-dark" : "gradient-button"}
                    onClick={handleViewUsage}
                    sx={
                      viewUsage ?
                        {
                          color: mode === "dark" ? theme.palette.neutral.darker : theme.palette.neutral.lighter,
                          margin: 0,
                          padding: isWideScreens ? "0.5rem 1.25rem" : isQHDScreens ? "0.5rem 1rem" : "0.25rem 0.5rem",
                          borderRadius: "3.5rem",
                          fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.75rem",
                          textTransform: "none",
                          backgroundColor: mode === "dark" ? "rgba(255,255,255, 0.1)" : theme.palette.neutral.dark,
                          ":hover": {
                            color: mode === "dark" ? theme.palette.neutral.darker : theme.palette.neutral.lighter,
                            cursor: "default",
                            backgroundColor: mode === "dark" ? "rgba(255,255,255, 0.1)" : theme.palette.neutral.dark,
                          }
                        }
                        :
                        {
                          color: theme.palette.neutral.mid,
                          margin: 0,
                          padding: isWideScreens ? "0.5rem 1.25rem" : isQHDScreens ? "0.5rem 1rem" : "0.25rem 0.5rem",
                          borderRadius: "3.5rem",
                          fontSize: isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.75rem",
                          textTransform: "none",
                          backgroundColor: "none",
                          ":hover": {
                            color: theme.palette.primary.main,
                            backgroundColor: "none"
                          }
                        }
                    }
                  >
                    Usage
                  </Button>
                </Stack>
                {pinned ?
                  <Tooltip title="Unpin" placement="top">
                    <Stack>
                      <TbPinFilled size={24} style={{ cursor: "pointer", color: theme.palette.primary.main }} onClick={handleUpdatePinned} />
                    </Stack>
                  </Tooltip>
                  :
                  <Tooltip title="Pin" placement="top">
                    <Stack>
                      <TbPin size={24} style={{ cursor: "pointer", color: theme.palette.neutral.main }} onClick={handleUpdatePinned} />
                    </Stack>
                  </Tooltip>
                }
              </Stack>
            )}
          </Stack>
        </>
      )}
      <Menu
        id="basic-menu"
        anchorEl={menuAnchor}
        open={openMenu}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: mode === "light" ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 11, 13, 0.3)", // Semi-transparent background
            backgroundImage: `linear-gradient(
              to bottom right, 
              rgba(255, 255, 255, 0.15), 
              rgba(255, 255, 255, 0.05)
            )`, // Gradient overlay for the glassmorphism effect
            backdropFilter: "blur(10px)", // Apply the blur effect
            WebkitBackdropFilter: "blur(10px)", // Safari support for blur effect
            borderRadius: "1rem",
            boxShadow: "0px 4px 12px rgba(0, 11, 13, 0.4)", // Shadow for depth
            border: "1px solid rgba(255, 255, 255, 0.2)", // Optional border for frosted effect
          },
        }}
      >
        <MenuItem onClick={handleUpdatePinned}>
          <ListItemIcon><TbPin fontSize="large" color={theme.palette.neutral.darker} /></ListItemIcon>
          <ListItemText sx={{ color: theme.palette.neutral.darker }}>{pinned ? "Unpin" : "Pin"}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSetBeg}>
          <ListItemIcon><PiCircleBold fontSize="large" color={theme.palette.neutral.darker} /></ListItemIcon>
          <ListItemText sx={{ color: theme.palette.neutral.darker }}>Set Lv. 1</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSetInt}>
          <ListItemIcon><PiDiamondBold fontSize="large" color={theme.palette.neutral.darker} /></ListItemIcon>
          <ListItemText sx={{ color: theme.palette.neutral.darker }}>Set Lv. 2</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSetAdv}>
          <ListItemIcon><PiStarBold fontSize="large" color={theme.palette.neutral.darker} /></ListItemIcon>
          <ListItemText sx={{ color: theme.palette.neutral.darker }}>Set Lv. 3</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteVocab}>
          <ListItemIcon><TbTrashX fontSize="large" color={theme.palette.neutral.darker} /></ListItemIcon>
          <ListItemText sx={{ color: theme.palette.neutral.darker }}>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default ViewVocabDialog