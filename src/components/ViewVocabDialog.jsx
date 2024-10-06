import "../styles/gradient-button.min.css"
import { v4 as uuidv4 } from "uuid"
import { useState, useEffect, forwardRef, lazy, Suspense } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { TbPin, TbPinFilled, TbTrashX } from "react-icons/tb";
import { CgUndo } from "react-icons/cg";
import { FiEdit2, FiBookOpen } from "react-icons/fi";
import { IoSearch, IoAddCircleOutline, IoRefresh } from "react-icons/io5";
import { IoMdAdd, IoMdClose, IoMdMore, IoMdCheckmark } from "react-icons/io";
import { PiCircleBold, PiDiamondBold, PiStarBold, PiSparkle, PiSparkleFill } from "react-icons/pi";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { Box, Grow, Stack, Dialog, Typography, Checkbox, InputBase, Menu, MenuItem, ListItemIcon, ListItemText, useTheme, Button, IconButton, useMediaQuery, Tooltip, } from "@mui/material"
import { pinyin } from "pinyin-pro"
import { setViewBySearchTerm } from "state"
import HashLoader from "react-spinners/HashLoader"
import PropagateLoader from "react-spinners/PropagateLoader"
import apiUrl from "config/api"
const AiDefDialog = lazy(() => import("./AiDefDialog"))


const Transition = forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />
})

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
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  const theme = useTheme()
  const mode = useSelector((state) => state.mode)

  /* View Vocab Dialog State */
  const [defOpen, setDefOpen] = useState(false)
  const handleDefClose = () => {
    setDefOpen(false)
  }
  const openDef = () => {
    handleMenuClose()
    setDefOpen(true)
  }

  /* Options Drowndown Menu */
  const [simMenuAnchor, setSimMenuAnchor] = useState(null)
  const openMenu = Boolean(simMenuAnchor)
  const handleSimMenuClick = (event) => {
    setSimMenuAnchor(event.currentTarget)
  }
  const handleMenuClose = () => {
    setSimMenuAnchor(null)
  }

  return (
    <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
      <Typography fontSize={isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.75rem"}
        onClick={handleSimMenuClick}
        sx={{ cursor: "pointer" }}
      >
        {item}
      </Typography>
      <Menu
        id="basic-menu"
        anchorEl={simMenuAnchor}
        open={openMenu}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: mode === "light" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 11, 13, 0.2)", // Semi-transparent background
            backgroundImage: `linear-gradient(
              to bottom right, 
              rgba(255, 255, 255, 0.15), 
              rgba(255, 255, 255, 0.05)
            )`, // Gradient overlay for the glassmorphism effect
            backdropFilter: "blur(4px)", // Apply the blur effect
            WebkitBackdropFilter: "blur(4px)", // Safari support for blur effect
            borderRadius: "1rem",
            border: "1px solid rgba(255, 255, 255, 0.2)", // Optional border for frosted effect
          },
        }}
      >
        <MenuItem
          onMouseDown={() => searchSimilar(item)}
          onClick={() => searchSimilar(item)}
        >
          <ListItemIcon
          >
            <IoSearch size={24} color={theme.palette.neutral.darker} />
          </ListItemIcon>
          <ListItemText sx={{ color: theme.palette.neutral.dark }}>Search</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={openDef}
        >
          <ListItemIcon
          >
            <FiBookOpen size={24} color={theme.palette.neutral.darker} />
          </ListItemIcon>
          <ListItemText sx={{ color: theme.palette.neutral.dark }}>Define</ListItemText>
        </MenuItem>
      </Menu>
      <Dialog
        open={defOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDefClose}
        aria-describedby="alert-dialog-grow-description"
        sx={{
          "& .MuiDialog-paper": {
            width: isLandscape ? "18%" : "100%",
            padding: "1rem",
            borderRadius: "1rem",
            display: "flex",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
            backgroundColor: mode === "light" ? "rgba(255, 255, 255, 1)" : "rgba(0, 11, 13, 0.3)", // Semi-transparent background
            backgroundImage: `linear-gradient(
              to top left, 
              rgba(255, 255, 255, 0.15), 
              rgba(255, 255, 255, 0.05)
            )`, // Gradient overlay
            backdropFilter: "blur(6px)", // Apply the glass effect
            WebkitBackdropFilter: "blur(6px)", // For Safari support
            border: "1px solid rgba(255, 255, 255, 0.2)"
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 11, 13, 0.7)", // Custom backdrop color
            },
          },
        }}
      >
        <AiDefDialog item={item} handleDefClose={handleDefClose} />
      </Dialog>
    </Stack>
  )
}

const ExpressionText = ({ item }) => {
  const isQHDScreens = useMediaQuery("(min-width:2500px) and (max-height:1600px)") // 2K Laptops
  const isWideScreens = useMediaQuery("(min-width:3400px) and (max-height:1500px)") // Wide and Ultrawide Desktops
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  const theme = useTheme()
  const mode = useSelector((state) => state.mode)

  /* View Vocab Dialog State */
  const [defOpen, setDefOpen] = useState(false)
  const handleDefClose = () => {
    setDefOpen(false)
  }
  const openDef = () => {
    handleMenuClose()
    setDefOpen(true)
  }

  /* Options Drowndown Menu */
  const [expMenuAnchor, setExpMenuAnchor] = useState(null)
  const openMenu = Boolean(expMenuAnchor)
  const handleExpMenuClick = (event) => {
    setExpMenuAnchor(event.currentTarget)
  }
  const handleMenuClose = () => {
    setExpMenuAnchor(null)
  }

  return (
    <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
      <Typography fontSize={isWideScreens ? "2.5rem" : isQHDScreens ? "2rem" : "1.5rem"}
        onClick={handleExpMenuClick}
        sx={{ cursor: "pointer" }}
      >
        {item}
      </Typography>
      <Menu
        id="basic-menu"
        anchorEl={expMenuAnchor}
        open={openMenu}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: mode === "light" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 11, 13, 0.2)", // Semi-transparent background
            backgroundImage: `linear-gradient(
              to bottom right, 
              rgba(255, 255, 255, 0.15), 
              rgba(255, 255, 255, 0.05)
            )`, // Gradient overlay for the glassmorphism effect
            backdropFilter: "blur(4px)", // Apply the blur effect
            WebkitBackdropFilter: "blur(4px)", // Safari support for blur effect
            borderRadius: "6rem",
            padding: isLandscape ? "0.5rem 0" : "0.125rem 0",
            border: "1px solid rgba(255, 255, 255, 0.2)", // Optional border for frosted effect
          },
        }}
      >
        <MenuItem
          onClick={openDef}
          sx={{
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          <ListItemIcon
            sx={{
              display: 'flex',
              justifyContent: 'center',  // Centers the icon horizontally
              minWidth: 'unset',  // Removes the default minWidth from ListItemIcon
              width: '100%',
            }}
          >
            <FiBookOpen size={24} color={theme.palette.neutral.darker} />
          </ListItemIcon>
        </MenuItem>
      </Menu>
      <Dialog
        open={defOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDefClose}
        aria-describedby="alert-dialog-grow-description"
        sx={{
          "& .MuiDialog-paper": {
            width: isLandscape ? "18%" : "100%",
            padding: "1rem",
            borderRadius: "1rem",
            display: "flex",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
            backgroundColor: mode === "light" ? "rgba(255, 255, 255, 1)" : "rgba(0, 11, 13, 0.3)", // Semi-transparent background
            backgroundImage: `linear-gradient(
              to top left, 
              rgba(255, 255, 255, 0.15), 
              rgba(255, 255, 255, 0.05)
            )`, // Gradient overlay
            backdropFilter: "blur(6px)", // Apply the glass effect
            WebkitBackdropFilter: "blur(6px)", // For Safari support
            border: "1px solid rgba(255, 255, 255, 0.2)"
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 11, 13, 0.7)", // Custom backdrop color
            },
          },
        }}
      >
        <Suspense fallback={
          <PropagateLoader
            color={theme.palette.neutral.light}
            loading={true}
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        }>
          <AiDefDialog item={item} handleDefClose={handleDefClose} defOpen={defOpen} />
        </Suspense>
      </Dialog>
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


const ViewVocabDialog = (
  { viewVocab, setViewVocab, viewUsage, setViewUsage, handleViewClose, id, text, pinyinText, label, difficulty, definition, similar, expression, sentence, pinned }
) => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px) and (max-height:2160px)") // All Desktops
  const isQHDScreens = useMediaQuery("(min-width:2500px) and (max-height:1600px)") // 2K Laptops
  const isWideScreens = useMediaQuery("(min-width:3400px) and (max-height:1500px)") // Wide and Ultrawide Desktops
  const theme = useTheme()

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { _id } = useSelector((state) => state.user)
  const token = useSelector((state) => state.token)
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

  const [generatingSim, setGeneratingSim] = useState(false)
  const [showRegenSimOne, setShowRegenSimOne] = useState(false)
  const [showRegenSimTwo, setShowRegenSimTwo] = useState(false)
  const [showRegenSimThree, setShowRegenSimThree] = useState(false)
  const [showRegenSimFour, setShowRegenSimFour] = useState(false)
  const [generatedAiSim, setGeneratedAiSim] = useState(false)

  const genSimOne = () => {
    if (genSimData) {
      const randomIndex = Math.floor(Math.random() * genSimData.similar.length);
      setNewSimilarOne(genSimData.similar[randomIndex])
    }
  }
  const clearSimilarOne = () => {
    setNewSimilarOne("")
    subtractSimilarEntry();
  }
  const genSimTwo = () => {
    if (genSimData) {
      const randomIndex = Math.floor(Math.random() * genSimData.similar.length);
      setNewSimilarTwo(genSimData.similar[randomIndex])
    }
  }
  const clearSimilarTwo = () => {
    setNewSimilarTwo("")
    subtractSimilarEntry();
  }
  const genSimThree = () => {
    if (genSimData) {
      const randomIndex = Math.floor(Math.random() * genSimData.similar.length);
      setNewSimilarThree(genSimData.similar[randomIndex])
    }
  }
  const clearSimilarThree = () => {
    setNewSimilarThree("")
    subtractSimilarEntry();
  }
  const genSimFour = () => {
    if (genSimData) {
      const randomIndex = Math.floor(Math.random() * genSimData.similar.length);
      setNewSimilarFour(genSimData.similar[randomIndex])
    }
  }
  const clearSimilarFour = () => {
    setNewSimilarFour("")
    subtractSimilarEntry();
  }
  /* Generate Ai Similars Data */
  const getGenSim = () => {
    return fetch(`${apiUrl}/openai/similar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Ensure Content-Type is set to JSON
      },
      body: JSON.stringify({ simVocab: text, simLabel: label }), // Send the correct data in the body
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json(); // Parse the response as JSON
      });
  };

  const { data: genSimData } = useQuery(["aiSimData", text], getGenSim,
    {
      enabled: generatingSim, // Ensure that vocabText is not empty
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
          simVocab: text,
          simLabel: label
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
        if (newSimilarEntry === 4) {
          if (removeSimilarFour || !similar[3]?.length) {
            setNewSimilarFour(data.similar[3]);
          }
          if (removeSimilarThree || !similar[2]?.length) {
            setNewSimilarThree(data.similar[2]);
          }
          if (removeSimilarTwo || !similar[1]?.length) {
            setNewSimilarTwo(data.similar[1]);
          }
          if (removeSimilarOne || !similar[0]?.length) {
            setNewSimilarOne(data.similar[0]);
          }
        }
        if (newSimilarEntry === 3) {
          if (removeSimilarThree || !similar[2]?.length) {
            setNewSimilarThree(data.similar[2]);
          }
          if (removeSimilarTwo || !similar[1]?.length) {
            setNewSimilarTwo(data.similar[1]);
          }
          if (removeSimilarOne || !similar[0]?.length) {
            setNewSimilarOne(data.similar[0]);
          }
        }
        if (newSimilarEntry === 2) {
          if (removeSimilarTwo || !similar[1]?.length) {
            setNewSimilarTwo(data.similar[1]);
          }
          if (removeSimilarOne || !similar[0]?.length) {
            setNewSimilarOne(data.similar[0]);
          }
        }
        if (newSimilarEntry === 1) {
          if (removeSimilarOne || !similar[0]?.length) {
            setNewSimilarOne(data.similar[0]);
          }
        }
      }

      setGeneratingSim(false)
    },
  });

  const handleGenAiSim = () => {
    setGeneratingSim(true)
    generateAiSimilars.mutate()
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

  /* Expression Input States */
  const [editingExpression, setEditingExpression] = useState(false)
  const [newExpression, setNewExpression] = useState([])
  const [newExpressionOne, setNewExpressionOne] = useState("")
  const [newExpressionTwo, setNewExpressionTwo] = useState("")
  const [newExpressionThree, setNewExpressionThree] = useState("")
  const [newExpressionFour, setNewExpressionFour] = useState("")
  const [newExpressionFive, setNewExpressionFive] = useState("")
  const [newExpressionSix, setNewExpressionSix] = useState("")
  const [newExpressionSeven, setNewExpressionSeven] = useState("")
  const [newExpressionEight, setNewExpressionEight] = useState("")
  const [newExpressionEntry, setNewExpressionEntry] = useState(expression?.length) // Increments a new InputBase onClick for new entry
  const addExpressionEntry = () => {
    setEditingExpression(true);
    if (newExpressionEntry === 8) {
      return
    }
    setNewExpressionEntry(newExpressionEntry + 1);
  }
  const subtractExpressionEntry = () => {
    if (newExpressionEntry === 1) {
      return
    }
    setNewExpressionEntry(newExpressionEntry - 1);
  }
  const [removeExpressionOne, setRemoveExpressionOne] = useState(false)
  const [removeExpressionTwo, setRemoveExpressionTwo] = useState(false)
  const [removeExpressionThree, setRemoveExpressionThree] = useState(false)
  const [removeExpressionFour, setRemoveExpressionFour] = useState(false)
  const [removeExpressionFive, setRemoveExpressionFive] = useState(false)
  const [removeExpressionSix, setRemoveExpressionSix] = useState(false)
  const [removeExpressionSeven, setRemoveExpressionSeven] = useState(false)
  const [removeExpressionEight, setRemoveExpressionEight] = useState(false)
  const removeExpOne = () => {
    setRemoveExpressionOne(true);
    subtractExpressionEntry();
  }
  const removeExpTwo = () => {
    setRemoveExpressionTwo(true);
    subtractExpressionEntry();
  }
  const removeExpThree = () => {
    setRemoveExpressionThree(true);
    subtractExpressionEntry();
  }
  const removeExpFour = () => {
    setRemoveExpressionFour(true);
    subtractExpressionEntry();
  }
  const removeExpFive = () => {
    setRemoveExpressionFive(true);
    subtractExpressionEntry();
  }
  const removeExpSix = () => {
    setRemoveExpressionSix(true);
    subtractExpressionEntry();
  }
  const removeExpSeven = () => {
    setRemoveExpressionSeven(true);
    subtractExpressionEntry();
  }
  const removeExpEight = () => {
    setRemoveExpressionEight(true);
    subtractExpressionEntry();
  }

  const updateNewExpression = () => {
    setNewExpression((prevState) => {
      const newExpressionArray = [];
      if (removeExpressionOne || newExpressionOne.length > 0) {
        newExpressionArray.push(newExpressionOne);
      } else {
        if (expression[0]?.length > 0) {
          newExpressionArray.push(expression[0])
        }
      }
      if (removeExpressionTwo || newExpressionTwo.length > 0) {
        if (newExpressionTwo.length > 0) {
          newExpressionArray.push(newExpressionTwo);
        }
      } else {
        if (expression[1]?.length > 0) {
          newExpressionArray.push(expression[1])
        }
      }
      if (removeExpressionThree || newExpressionThree.length > 0) {
        if (newExpressionThree.length > 0) {
          newExpressionArray.push(newExpressionThree);
        }
      } else {
        if (expression[2]?.length > 0) {
          newExpressionArray.push(expression[2])
        }
      }
      if (removeExpressionFour || newExpressionFour.length > 0) {
        if (newExpressionFour.length > 0) {
          newExpressionArray.push(newExpressionFour);
        }
      } else {
        if (expression[3]?.length > 0) {
          newExpressionArray.push(expression[3])
        }
      }
      if (removeExpressionFive || newExpressionFive.length > 0) {
        if (newExpressionFive.length > 0) {
          newExpressionArray.push(newExpressionFive);
        }
      } else {
        if (expression[4]?.length > 0) {
          newExpressionArray.push(expression[4])
        }
      }
      if (removeExpressionSix || newExpressionSix.length > 0) {
        if (newExpressionSix.length > 0) {
          newExpressionArray.push(newExpressionSix);
        }
      } else {
        if (expression[5]?.length > 0) {
          newExpressionArray.push(expression[5])
        }
      }
      if (removeExpressionSeven || newExpressionSeven.length > 0) {
        if (newExpressionSeven.length > 0) {
          newExpressionArray.push(newExpressionSeven);
        }
      } else {
        if (expression[6]?.length > 0) {
          newExpressionArray.push(expression[6])
        }
      }
      if (removeExpressionEight || newExpressionEight.length > 0) {
        if (newExpressionEight.length > 0) {
          newExpressionArray.push(newExpressionEight);
        }
      } else {
        if (expression[7]?.length > 0) {
          newExpressionArray.push(expression[7])
        }
      }

      return newExpressionArray;
    });
  };

  const openEditExpression = () => {
    if (newExpressionEntry === 0) {
      setNewExpressionEntry(expression?.length + 1);
    }
    setEditingExpression(true);
  }

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

  const genExpOne = () => {
    if (genExpData) {
      const randomIndex = Math.floor(Math.random() * genExpData.expression.length);
      setNewExpressionOne(genExpData.expression[randomIndex])
    }
  }
  const clearExpressionOne = () => {
    setNewExpressionOne("")
    subtractExpressionEntry();
  }
  const genExpTwo = () => {
    if (genExpData) {
      const randomIndex = Math.floor(Math.random() * genExpData.expression.length);
      setNewExpressionTwo(genExpData.expression[randomIndex])
    }
  }
  const clearExpressionTwo = () => {
    setNewExpressionTwo("")
    subtractExpressionEntry();
  }
  const genExpThree = () => {
    if (genExpData) {
      const randomIndex = Math.floor(Math.random() * genExpData.expression.length);
      setNewExpressionThree(genExpData.expression[randomIndex])
    }
  }
  const clearExpressionThree = () => {
    setNewExpressionThree("")
    subtractExpressionEntry();
  }
  const genExpFour = () => {
    if (genExpData) {
      const randomIndex = Math.floor(Math.random() * genExpData.expression.length);
      setNewExpressionFour(genExpData.expression[randomIndex])
    }
  }
  const clearExpressionFour = () => {
    setNewExpressionFour("")
    subtractExpressionEntry();
  }
  const genExpFive = () => {
    if (genExpData) {
      const randomIndex = Math.floor(Math.random() * genExpData.expression.length);
      setNewExpressionFive(genExpData.expression[randomIndex])
    }
  }
  const clearExpressionFive = () => {
    setNewExpressionFive("")
    subtractExpressionEntry();
  }
  const genExpSix = () => {
    if (genExpData) {
      const randomIndex = Math.floor(Math.random() * genExpData.expression.length);
      setNewExpressionSix(genExpData.expression[randomIndex])
    }
  }
  const clearExpressionSix = () => {
    setNewExpressionSix("")
    subtractExpressionEntry();
  }
  const genExpSeven = () => {
    if (genExpData) {
      const randomIndex = Math.floor(Math.random() * genExpData.expression.length);
      setNewExpressionSeven(genExpData.expression[randomIndex])
    }
  }
  const clearExpressionSeven = () => {
    setNewExpressionSeven("")
    subtractExpressionEntry();
  }
  const genExpEight = () => {
    if (genExpData) {
      const randomIndex = Math.floor(Math.random() * genExpData.expression.length);
      setNewExpressionEight(genExpData.expression[randomIndex])
    }
  }
  const clearExpressionEight = () => {
    setNewExpressionEight("")
    subtractExpressionEntry();
  }
  /* Generate Ai Expression Data */
  const getGenExp = () => {
    return fetch(`${apiUrl}/openai/expression`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Ensure Content-Type is set to JSON
      },
      body: JSON.stringify({ expVocab: text, expLabel: label }), // Send the correct data in the body
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json(); // Parse the response as JSON
      });
  };

  const { data: genExpData } = useQuery(["aiExpData", text], getGenExp,
    {
      enabled: generatingExp, // Ensure that vocabText is not empty
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  const generateAiExpression = useMutation({
    mutationFn: async () => {
      return await fetch(`${apiUrl}/openai/expression`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expVocab: text,
          expLabel: label
        }),
      }).then((res) => res.json()); // Ensure the response is parsed as JSON
    },
    onError: (error, _styleName, context) => {
      console.log("Error fetching:" + context?.id + error);
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: ["aiExpData"] });

      setGeneratedAiExp(true);

      if (data?.expression) {
        if (newExpressionEntry === 8) {
          if (removeExpressionEight || !expression[7]?.length) {
            setNewExpressionEight(data.expression[7]);
          }
          if (removeExpressionSeven || !expression[6]?.length) {
            setNewExpressionSeven(data.expression[6]);
          }
          if (removeExpressionSix || !expression[5]?.length) {
            setNewExpressionSix(data.expression[5]);
          }
          if (removeExpressionFive || !expression[4]?.length) {
            setNewExpressionFive(data.expression[4]);
          }
          if (removeExpressionFour || !expression[3]?.length) {
            setNewExpressionFour(data.expression[3]);
          }
          if (removeExpressionThree || !expression[2]?.length) {
            setNewExpressionThree(data.expression[2]);
          }
          if (removeExpressionTwo || !expression[1]?.length) {
            setNewExpressionTwo(data.expression[1]);
          }
          if (removeExpressionOne || !expression[0]?.length) {
            setNewExpressionOne(data.expression[0]);
          }
        }
        if (newExpressionEntry === 7) {
          if (removeExpressionSeven || !expression[6]?.length) {
            setNewExpressionSeven(data.expression[6]);
          }
          if (removeExpressionSix || !expression[5]?.length) {
            setNewExpressionSix(data.expression[5]);
          }
          if (removeExpressionFive || !expression[4]?.length) {
            setNewExpressionFive(data.expression[4]);
          }
          if (removeExpressionFour || !expression[3]?.length) {
            setNewExpressionFour(data.expression[3]);
          }
          if (removeExpressionThree || !expression[2]?.length) {
            setNewExpressionThree(data.expression[2]);
          }
          if (removeExpressionTwo || !expression[1]?.length) {
            setNewExpressionTwo(data.expression[1]);
          }
          if (removeExpressionOne || !expression[0]?.length) {
            setNewExpressionOne(data.expression[0]);
          }
        }
        if (newExpressionEntry === 6) {
          if (removeExpressionSix || !expression[5]?.length) {
            setNewExpressionSix(data.expression[5]);
          }
          if (removeExpressionFive || !expression[4]?.length) {
            setNewExpressionFive(data.expression[4]);
          }
          if (removeExpressionFour || !expression[3]?.length) {
            setNewExpressionFour(data.expression[3]);
          }
          if (removeExpressionThree || !expression[2]?.length) {
            setNewExpressionThree(data.expression[2]);
          }
          if (removeExpressionTwo || !expression[1]?.length) {
            setNewExpressionTwo(data.expression[1]);
          }
          if (removeExpressionOne || !expression[0]?.length) {
            setNewExpressionOne(data.expression[0]);
          }
        }
        if (newExpressionEntry === 5) {
          if (removeExpressionFive || !expression[4]?.length) {
            setNewExpressionFive(data.expression[4]);
          }
          if (removeExpressionFour || !expression[3]?.length) {
            setNewExpressionFour(data.expression[3]);
          }
          if (removeExpressionThree || !expression[2]?.length) {
            setNewExpressionThree(data.expression[2]);
          }
          if (removeExpressionTwo || !expression[1]?.length) {
            setNewExpressionTwo(data.expression[1]);
          }
          if (removeExpressionOne || !expression[0]?.length) {
            setNewExpressionOne(data.expression[0]);
          }
        }
        if (newExpressionEntry === 4) {
          if (removeExpressionFour || !expression[3]?.length) {
            setNewExpressionFour(data.expression[3]);
          }
          if (removeExpressionThree || !expression[2]?.length) {
            setNewExpressionThree(data.expression[2]);
          }
          if (removeExpressionTwo || !expression[1]?.length) {
            setNewExpressionTwo(data.expression[1]);
          }
          if (removeExpressionOne || !expression[0]?.length) {
            setNewExpressionOne(data.expression[0]);
          }
        }
        if (newExpressionEntry === 3) {
          if (removeExpressionThree || !expression[2]?.length) {
            setNewExpressionThree(data.expression[2]);
          }
          if (removeExpressionTwo || !expression[1]?.length) {
            setNewExpressionTwo(data.expression[1]);
          }
          if (removeExpressionOne || !expression[0]?.length) {
            setNewExpressionOne(data.expression[0]);
          }
        }
        if (newExpressionEntry === 2) {
          if (removeExpressionTwo || !expression[1]?.length) {
            setNewExpressionTwo(data.expression[1]);
          }
          if (removeExpressionOne || !expression[0]?.length) {
            setNewExpressionOne(data.expression[0]);
          }
        }
        if (newExpressionEntry === 1) {
          if (removeExpressionOne || !expression[0]?.length) {
            setNewExpressionOne(data.expression[0]);
          }
        }
      }

      setGeneratingExp(false)
      setUpdatedExpression(false)
    },
  });

  const handleGenAiExp = () => {
    setGeneratingExp(true)
    generateAiExpression.mutate()
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
    setGeneratingSim(false)
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

  const [updatedExpression, setUpdatedExpression] = useState(false)

  const handleUpdateExpression = (updatedData) => {
    updateNewExpression()
    updateExpressionMutation.mutate(updatedData)
    setEditingExpression(false)
    setUpdatedExpression(true)
  }

  const updateExpressionMutation = useMutation({
    mutationFn: async () => {
      const updatedData = {
        expression: newExpression ? newExpression : expression,
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
      setEditingExpression(false)
      setNewExpression([])
      setNewExpressionOne("")
      setNewExpressionTwo("")
      setNewExpressionThree("")
      setNewExpressionFour("")
      setNewExpressionFive("")
      setNewExpressionSix("")
      setNewExpressionSeven("")
      setNewExpressionEight("")
      setRemoveExpressionOne(false)
      setRemoveExpressionTwo(false)
      setRemoveExpressionThree(false)
      setRemoveExpressionFour(false)
      setRemoveExpressionFive(false)
      setRemoveExpressionSix(false)
      setRemoveExpressionSeven(false)
      setRemoveExpressionEight(false)
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
    setSimilarSearchText(item);

    if (similarSearchData?.length > 0) {
      dispatch(setViewBySearchTerm({ viewBySearchTerm: item }))
      navigate(`/search/${_id}`)
    }
  };

  const handleViewVocab = () => {
    if (viewUsage === true) {
      setViewUsage(false)
    } else if (viewVocab === false) {
      setViewVocab(true)
    }
  }

  const handleViewUsage = () => {
    if (viewVocab === true) {
      setViewVocab(false)
    } else if (viewUsage === false) {
      setViewUsage(true)
    }
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
                          {editingSimilar ?
                            <Button
                              startIcon={<PiSparkleFill size={16} color={theme.palette.neutral.darker} />}
                              onClick={handleGenAiSim}
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
                              Ai Gen
                            </Button>
                            :
                            <IconButton onClick={openEditSimilar}>
                              <FiEdit2 style={{ color: mode === "light" ? theme.palette.neutral.light : "rgba(41, 54, 56, 0.8)" }} />
                            </IconButton>
                          }

                          {(similar?.length < 4 && newSimilarEntry < 4 && editingSimilar) &&
                            <Tooltip title="Add Entry" placement="right">
                              <IconButton onClick={addSimilarEntry}>
                                <IoMdAdd size={16} />
                              </IconButton>
                            </Tooltip>
                          }
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
                                placeholder={""}
                                onChange={(e) => setNewSimilarOne(e.target.value)}
                                value={(generatedAiSim && !similar[0]?.length) ? newSimilarOne : !removeSimilarOne ? similar[0] : newSimilarOne}
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
                                      <IconButton onClick={!similar[0]?.length ? clearSimilarOne : removeSimOne}>
                                        <TbTrashX color={theme.palette.neutral.dark} />
                                      </IconButton>
                                    </Tooltip>
                                  }
                                </Stack>
                              )
                                :
                                <IconButton
                                  onClick={clearSimilarOne}
                                // onClick={subtractSimilarEntry} 
                                // disabled={newSimilarOne.length > 0}
                                >
                                  <IoMdClose size={16} />
                                </IconButton>
                              }
                              {generatedAiSim && (
                                <>
                                  {(newSimilarOne?.length < 1 && generatingSim) ?
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
                                        {(showRegenSimOne && newSimilarOne?.length > 1) ?
                                          <Tooltip title="Regenerate" placement="right">
                                            <IconButton onClick={genSimOne}>
                                              <IoRefresh size={16} />
                                            </IconButton>
                                          </Tooltip>
                                          :
                                          <Tooltip title="Generate" placement="right">
                                            <IconButton onClick={genSimOne}>
                                              {newSimilarOne?.length < 1 ?
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

                            {/* 2nd Similar */}
                            {(similar?.length > 1 || newSimilarEntry > 1) && (
                              <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                                <InputBase
                                  id={uuidv4()}
                                  placeholder={""}
                                  onChange={(e) => setNewSimilarTwo(e.target.value)}
                                  value={(generatedAiSim && !similar[1]?.length) ? newSimilarTwo : !removeSimilarTwo ? similar[1] : newSimilarTwo}
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
                                  <IconButton
                                    onClick={clearSimilarTwo}
                                  //  onClick={subtractSimilarEntry}
                                  //  disabled={newSimilarTwo.length > 0}
                                  >
                                    <IoMdClose size={16} />
                                  </IconButton>
                                }
                                {generatedAiSim && (
                                  <>
                                    {(newSimilarTwo?.length < 1 && generatingSim) ?
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
                                          {(showRegenSimTwo && newSimilarTwo?.length > 1) ?
                                            <Tooltip title="Regenerate" placement="right">
                                              <IconButton onClick={genSimTwo}>
                                                <IoRefresh size={16} />
                                              </IconButton>
                                            </Tooltip>
                                            :
                                            <Tooltip title="Generate" placement="right">
                                              <IconButton onClick={genSimTwo}>
                                                {newSimilarTwo?.length < 1 ?
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

                            {/* 3rd Similar */}
                            {(similar?.length > 2 || newSimilarEntry > 2) && (
                              <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                                <InputBase
                                  id={uuidv4()}
                                  placeholder={""}
                                  onChange={(e) => setNewSimilarThree(e.target.value)}
                                  value={(generatedAiSim && !similar[2]?.length) ? newSimilarThree : !removeSimilarThree ? similar[2] : newSimilarThree}
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
                                  <IconButton
                                    onClick={clearSimilarThree}
                                  // onClick={subtractSimilarEntry} 
                                  // disabled={newSimilarThree.length > 0}
                                  >
                                    <IoMdClose size={16} />
                                  </IconButton>
                                }
                                {generatedAiSim && (
                                  <>
                                    {(newSimilarThree?.length < 1 && generatingSim) ?
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
                                          {(showRegenSimThree && newSimilarThree?.length > 1) ?
                                            <Tooltip title="Regenerate" placement="right">
                                              <IconButton onClick={genSimThree}>
                                                <IoRefresh size={16} />
                                              </IconButton>
                                            </Tooltip>
                                            :
                                            <Tooltip title="Generate" placement="right">
                                              <IconButton onClick={genSimThree}>
                                                {newSimilarThree?.length < 1 ?
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

                            {/* 4th Similar */}
                            {(similar?.length > 3 || newSimilarEntry > 3) && (
                              <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                                <InputBase
                                  id={uuidv4()}
                                  placeholder={""}
                                  onChange={(e) => setNewSimilarFour(e.target.value)}
                                  value={(generatedAiSim && !similar[3]?.length) ? newSimilarFour : !removeSimilarFour ? similar[3] : newSimilarFour}
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
                                  <IconButton
                                    onClick={clearSimilarFour}
                                  // onClick={subtractSimilarEntry} 
                                  // disabled={newSimilarFour.length > 0}
                                  >
                                    <IoMdClose size={16} />
                                  </IconButton>
                                }
                                {generatedAiSim && (
                                  <>
                                    {(newSimilarFour?.length < 1 && generatingSim) ?
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
                                          {(showRegenSimFour && newSimilarFour?.length > 1) ?
                                            <Tooltip title="Regenerate" placement="right">
                                              <IconButton onClick={genSimFour}>
                                                <IoRefresh size={16} />
                                              </IconButton>
                                            </Tooltip>
                                            :
                                            <Tooltip title="Generate" placement="right">
                                              <IconButton onClick={genSimFour}>
                                                {newSimilarFour?.length < 1 ?
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
                <Stack direction="row" alignItems={"center"} justifyContent={"space-between"} pt={2}>
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
                    border: "none",
                    borderRadius: "0.75rem",
                    padding: "0.25rem",
                    backgroundColor: mode === "light" ? "rgba(180, 180, 180, 0.2)" : "rgba(0, 11, 13, 0.45)", // Semi-transparent background
                    backdropFilter: "blur(10px)", // Apply the glass effect
                    WebkitBackdropFilter: "blur(10px)",
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
                        fontSize={isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.8rem"}
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
              <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} pt={1}
                pb={editingLabels || (text?.length > 4 && similar?.length > 2) ? 2 : 0}
                borderTop={`solid 1px rgba(255,255,255, 0.15)`}
              >
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
                  <Stack spacing={0.5}>
                    <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                      <Typography fontSize={isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.8rem"} color={theme.palette.neutral.mid} fontWeight={400}>
                        Expression
                      </Typography>
                      {(editingExpression && newExpressionEntry > expression?.length) ?
                        <Button
                          startIcon={<PiSparkleFill size={16} color={theme.palette.neutral.darker} />}
                          onClick={handleGenAiExp}
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
                          Ai Gen
                        </Button>
                        :
                        !editingExpression ?
                          <IconButton onClick={openEditExpression}>
                            <FiEdit2 style={{ color: mode === "light" ? theme.palette.neutral.light : "rgba(41, 54, 56, 0.8)" }} />
                          </IconButton>
                          :
                          null
                      }

                      {(expression?.length < 8 && newExpressionEntry < 8 && editingExpression) &&
                        <Tooltip title="Add Entry" placement="right">
                          <IconButton onClick={addExpressionEntry}>
                            <IoMdAdd size={16} />
                          </IconButton>
                        </Tooltip>
                      }
                    </Stack>

                    {(!editingExpression && expression?.length === 0) && (
                      <Button sx={{ border: `solid 1px rgba(41, 54, 56, 0.8)`, borderRadius: "0.5rem" }} onClick={openEditExpression}>
                        <Typography fontSize={"1.5rem"}>+</Typography>
                      </Button>
                    )}

                    {/* 1st Expression */}
                    {editingExpression ?
                      <>
                        <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                          <InputBase
                            id={uuidv4()}
                            placeholder={""}
                            onChange={(e) => setNewExpressionOne(e.target.value)}
                            value={(generatedAiExp && !expression[0]?.length) ? newExpressionOne : !removeExpressionOne ? expression[0] : newExpressionOne}
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
                              {removeExpressionOne ?
                                <Tooltip title="Undo" placement="right">
                                  <IconButton onClick={() => setRemoveExpressionOne(false)}>
                                    <CgUndo color={theme.palette.neutral.dark} />
                                  </IconButton>
                                </Tooltip>
                                :
                                <Tooltip title="Delete" placement="left">
                                  <IconButton onClick={!expression[0]?.length ? clearExpressionOne : removeExpOne}>
                                    <TbTrashX color={theme.palette.neutral.dark} />
                                  </IconButton>
                                </Tooltip>
                              }
                            </Stack>
                          )
                            :
                            <IconButton onClick={clearExpressionOne}>
                              <IoMdClose size={16} />
                            </IconButton>
                          }
                          {generatedAiExp && (
                            <>
                              {(newExpressionOne?.length < 1 && generatingExp) ?
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
                                  <>
                                    {!updatedExpression &&
                                      <Stack
                                        onMouseOver={() => setShowRegenExpOne(true)}
                                        onMouseLeave={() => setShowRegenExpOne(false)}
                                      >
                                        {(showRegenExpOne && newExpressionOne?.length > 1) ?
                                          <Tooltip title="Regenerate" placement="right">
                                            <IconButton onClick={genExpOne}>
                                              <IoRefresh size={16} />
                                            </IconButton>
                                          </Tooltip>
                                          :
                                          <Tooltip title="Generate" placement="right">
                                            <IconButton onClick={genExpOne}>
                                              {newExpressionOne?.length < 1 ?
                                                <PiSparkle size={16} />
                                                :
                                                <PiSparkleFill size={16} />
                                              }
                                            </IconButton>
                                          </Tooltip>
                                        }
                                      </Stack>
                                    }
                                  </>
                                )
                              }
                            </>
                          )}
                        </Stack>

                        {/* 2nd Expression */}
                        {(expression?.length > 1 || newExpressionEntry > 1) && (
                          <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                            <InputBase
                              id={uuidv4()}
                              placeholder={""}
                              onChange={(e) => setNewExpressionTwo(e.target.value)}
                              value={(generatedAiExp && !expression[1]?.length) ? newExpressionTwo : !removeExpressionTwo ? expression[1] : newExpressionTwo}
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
                                {removeExpressionTwo ?
                                  <Tooltip title="Undo" placement="right">
                                    <IconButton onClick={() => setRemoveExpressionTwo(false)}>
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
                              <IconButton onClick={clearExpressionTwo}>
                                <IoMdClose size={16} />
                              </IconButton>
                            }
                            {generatedAiExp && (
                              <>
                                {(newExpressionTwo?.length < 1 && generatingExp) ?
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
                                    <>
                                      {!updatedExpression &&
                                        <Stack
                                          onMouseOver={() => setShowRegenExpTwo(true)}
                                          onMouseLeave={() => setShowRegenExpTwo(false)}
                                        >
                                          {(showRegenExpTwo && newExpressionTwo?.length > 1) ?
                                            <Tooltip title="Regenerate" placement="right">
                                              <IconButton onClick={genExpTwo}>
                                                <IoRefresh size={16} />
                                              </IconButton>
                                            </Tooltip>
                                            :
                                            <Tooltip title="Generate" placement="right">
                                              <IconButton onClick={genExpTwo}>
                                                {newExpressionTwo?.length < 1 ?
                                                  <PiSparkle size={16} />
                                                  :
                                                  <PiSparkleFill size={16} />
                                                }
                                              </IconButton>
                                            </Tooltip>
                                          }
                                        </Stack>
                                      }
                                    </>
                                  )
                                }
                              </>
                            )}
                          </Stack>
                        )}

                        {/* 3rd Expression */}
                        {(expression?.length > 2 || newExpressionEntry > 2) && (
                          <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                            <InputBase
                              id={uuidv4()}
                              placeholder={""}
                              onChange={(e) => setNewExpressionThree(e.target.value)}
                              value={(generatedAiExp && !expression[2]?.length) ? newExpressionThree : !removeExpressionThree ? expression[2] : newExpressionThree}
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
                                {removeExpressionThree ?
                                  <Tooltip title="Undo" placement="right">
                                    <IconButton onClick={() => setRemoveExpressionThree(false)}>
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
                              <IconButton onClick={clearExpressionThree}>
                                <IoMdClose size={16} />
                              </IconButton>
                            }
                            {generatedAiExp && (
                              <>
                                {(newExpressionThree?.length < 1 && generatingExp) ?
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
                                    <>
                                      {!updatedExpression &&
                                        <Stack
                                          onMouseOver={() => setShowRegenExpThree(true)}
                                          onMouseLeave={() => setShowRegenExpThree(false)}
                                        >
                                          {(showRegenExpThree && newExpressionThree?.length > 1) ?
                                            <Tooltip title="Regenerate" placement="right">
                                              <IconButton onClick={genExpThree}>
                                                <IoRefresh size={16} />
                                              </IconButton>
                                            </Tooltip>
                                            :
                                            <Tooltip title="Generate" placement="right">
                                              <IconButton onClick={genExpThree}>
                                                {newExpressionThree?.length < 1 ?
                                                  <PiSparkle size={16} />
                                                  :
                                                  <PiSparkleFill size={16} />
                                                }
                                              </IconButton>
                                            </Tooltip>
                                          }
                                        </Stack>
                                      }
                                    </>
                                  )
                                }
                              </>
                            )}
                          </Stack>
                        )}

                        {/* 4th Expression */}
                        {(expression?.length > 3 || newExpressionEntry > 3) && (
                          <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                            <InputBase
                              id={uuidv4()}
                              placeholder={""}
                              onChange={(e) => setNewExpressionFour(e.target.value)}
                              value={(generatedAiExp && !expression[3]?.length) ? newExpressionFour : !removeExpressionFour ? expression[3] : newExpressionFour}
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
                                {removeExpressionFour ?
                                  <Tooltip title="Undo" placement="right">
                                    <IconButton onClick={() => setRemoveExpressionFour(false)}>
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
                              <IconButton onClick={clearExpressionFour}>
                                <IoMdClose size={16} />
                              </IconButton>
                            }
                            {generatedAiExp && (
                              <>
                                {(newExpressionFour?.length < 1 && generatingExp) ?
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
                                    <>
                                      {!updatedExpression &&
                                        <Stack
                                          onMouseOver={() => setShowRegenExpFour(true)}
                                          onMouseLeave={() => setShowRegenExpFour(false)}
                                        >
                                          {(showRegenExpFour && newExpressionFour?.length > 1) ?
                                            <Tooltip title="Regenerate" placement="right">
                                              <IconButton onClick={genExpFour}>
                                                <IoRefresh size={16} />
                                              </IconButton>
                                            </Tooltip>
                                            :
                                            <Tooltip title="Generate" placement="right">
                                              <IconButton onClick={genExpFour}>
                                                {newExpressionFour?.length < 1 ?
                                                  <PiSparkle size={16} />
                                                  :
                                                  <PiSparkleFill size={16} />
                                                }
                                              </IconButton>
                                            </Tooltip>
                                          }
                                        </Stack>
                                      }
                                    </>
                                  )
                                }
                              </>
                            )}
                          </Stack>
                        )}

                        {/* 5th Expression */}
                        {(expression?.length > 4 || newExpressionEntry > 4) && (
                          <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                            <InputBase
                              id={uuidv4()}
                              placeholder={""}
                              onChange={(e) => setNewExpressionFive(e.target.value)}
                              value={(generatedAiExp && !expression[4]?.length) ? newExpressionFive : !removeExpressionFive ? expression[4] : newExpressionFive}
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
                                {removeExpressionFive ?
                                  <Tooltip title="Undo" placement="right">
                                    <IconButton onClick={() => setRemoveExpressionFive(false)}>
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
                              <IconButton onClick={clearExpressionFive}>
                                <IoMdClose size={16} />
                              </IconButton>
                            }
                            {generatedAiExp && (
                              <>
                                {(newExpressionFive?.length < 1 && generatingExp) ?
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
                                    <>
                                      {!updatedExpression &&
                                        <Stack
                                          onMouseOver={() => setShowRegenExpFive(true)}
                                          onMouseLeave={() => setShowRegenExpFive(false)}
                                        >
                                          {(showRegenExpFive && newExpressionFive?.length > 1) ?
                                            <Tooltip title="Regenerate" placement="right">
                                              <IconButton onClick={genExpFive}>
                                                <IoRefresh size={16} />
                                              </IconButton>
                                            </Tooltip>
                                            :
                                            <Tooltip title="Generate" placement="right">
                                              <IconButton onClick={genExpFive}>
                                                {newExpressionFive?.length < 1 ?
                                                  <PiSparkle size={16} />
                                                  :
                                                  <PiSparkleFill size={16} />
                                                }
                                              </IconButton>
                                            </Tooltip>
                                          }
                                        </Stack>
                                      }
                                    </>
                                  )
                                }
                              </>
                            )}
                          </Stack>
                        )}

                        {/* 6th Expression */}
                        {(expression?.length > 5 || newExpressionEntry > 5) && (
                          <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                            <InputBase
                              id={uuidv4()}
                              placeholder={""}
                              onChange={(e) => setNewExpressionSix(e.target.value)}
                              value={(generatedAiExp && !expression[5]?.length) ? newExpressionSix : !removeExpressionSix ? expression[5] : newExpressionSix}
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
                                {removeExpressionSix ?
                                  <Tooltip title="Undo" placement="right">
                                    <IconButton onClick={() => setRemoveExpressionSix(false)}>
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
                              <IconButton onClick={clearExpressionSix}>
                                <IoMdClose size={16} />
                              </IconButton>
                            }
                            {generatedAiExp && (
                              <>
                                {(newExpressionSix?.length < 1 && generatingExp) ?
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
                                    <>
                                      {!updatedExpression &&
                                        <Stack
                                          onMouseOver={() => setShowRegenExpSix(true)}
                                          onMouseLeave={() => setShowRegenExpSix(false)}
                                        >
                                          {(showRegenExpSix && newExpressionSix?.length > 1) ?
                                            <Tooltip title="Regenerate" placement="right">
                                              <IconButton onClick={genExpSix}>
                                                <IoRefresh size={16} />
                                              </IconButton>
                                            </Tooltip>
                                            :
                                            <Tooltip title="Generate" placement="right">
                                              <IconButton onClick={genExpSix}>
                                                {newExpressionSix?.length < 1 ?
                                                  <PiSparkle size={16} />
                                                  :
                                                  <PiSparkleFill size={16} />
                                                }
                                              </IconButton>
                                            </Tooltip>
                                          }
                                        </Stack>
                                      }
                                    </>
                                  )
                                }
                              </>
                            )}
                          </Stack>
                        )}

                        {/* 7th Expression */}
                        {(expression?.length > 6 || newExpressionEntry > 6) && (
                          <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                            <InputBase
                              id={uuidv4()}
                              placeholder={""}
                              onChange={(e) => setNewExpressionSeven(e.target.value)}
                              value={(generatedAiExp && !expression[6]?.length) ? newExpressionSeven : !removeExpressionSeven ? expression[6] : newExpressionSeven}
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
                                {removeExpressionSeven ?
                                  <Tooltip title="Undo" placement="right">
                                    <IconButton onClick={() => setRemoveExpressionSeven(false)}>
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
                              <IconButton onClick={clearExpressionSeven}>
                                <IoMdClose size={16} />
                              </IconButton>
                            }
                            {generatedAiExp && (
                              <>
                                {(newExpressionSeven?.length < 1 && generatingExp) ?
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
                                    <>
                                      !updatedExpression &&
                                      <Stack
                                        onMouseOver={() => setShowRegenExpSeven(true)}
                                        onMouseLeave={() => setShowRegenExpSeven(false)}
                                      >
                                        {(showRegenExpSeven && newExpressionSeven?.length > 1) ?
                                          <Tooltip title="Regenerate" placement="right">
                                            <IconButton onClick={genExpSeven}>
                                              <IoRefresh size={16} />
                                            </IconButton>
                                          </Tooltip>
                                          :
                                          <Tooltip title="Generate" placement="right">
                                            <IconButton onClick={genExpSeven}>
                                              {newExpressionSeven?.length < 1 ?
                                                <PiSparkle size={16} />
                                                :
                                                <PiSparkleFill size={16} />
                                              }
                                            </IconButton>
                                          </Tooltip>
                                        }
                                      </Stack>
                                      }
                                    </>
                                  )
                                }
                              </>
                            )}
                          </Stack>
                        )}

                        {/* 8th Expression */}
                        {(expression?.length > 7 || newExpressionEntry > 7) && (
                          <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                            <InputBase
                              id={uuidv4()}
                              placeholder={""}
                              onChange={(e) => setNewExpressionEight(e.target.value)}
                              value={(generatedAiExp && !expression[7]?.length) ? newExpressionEight : !removeExpressionEight ? expression[7] : newExpressionEight}
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
                                {removeExpressionEight ?
                                  <Tooltip title="Undo" placement="right">
                                    <IconButton onClick={() => setRemoveExpressionEight(false)}>
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
                              <IconButton onClick={clearExpressionEight}>
                                <IoMdClose size={16} />
                              </IconButton>
                            }
                            {generatedAiExp && (
                              <>
                                {(newExpressionEight?.length < 1 && generatingExp) ?
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
                                    <>
                                      {!updatedExpression &&
                                        <Stack
                                          onMouseOver={() => setShowRegenExpEight(true)}
                                          onMouseLeave={() => setShowRegenExpEight(false)}
                                        >
                                          {(showRegenExpEight && newExpressionEight?.length > 1) ?
                                            <Tooltip title="Regenerate" placement="right">
                                              <IconButton onClick={genExpEight}>
                                                <IoRefresh size={16} />
                                              </IconButton>
                                            </Tooltip>
                                            :
                                            <Tooltip title="Generate" placement="right">
                                              <IconButton onClick={genExpEight}>
                                                {newExpressionEight?.length < 1 ?
                                                  <PiSparkle size={16} />
                                                  :
                                                  <PiSparkleFill size={16} />
                                                }
                                              </IconButton>
                                            </Tooltip>
                                          }
                                        </Stack>
                                      }
                                    </>
                                  )
                                }
                              </>
                            )}
                          </Stack>
                        )}
                        <Button
                          onClick={handleUpdateExpression}
                          sx={{ fontSize: isWideScreens ? "1.25rem" : isQHDScreens ? "1rem" : "0.8rem" }}
                        >
                          Done
                        </Button>
                      </>
                      :
                      <>
                        {/* ----- Expression ----- */}
                        <Stack
                          direction={"row"} alignItems={"center"} spacing={2}>
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
                                    borderRadius: "0.75rem",
                                    padding: "0.25rem 0.75rem",
                                  }}
                                >
                                  <ExpressionText item={item} />
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

                    <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                      <Typography fontSize={isWideScreens ? "1.5rem" : isQHDScreens ? "1.25rem" : "0.8rem"} color={theme.palette.neutral.mid} fontWeight={400}>
                        Sentences
                      </Typography>
                      <IconButton onClick={openEditSentences}>
                        <FiEdit2 style={{ color: mode === "light" ? theme.palette.neutral.light : "rgba(41, 54, 56, 0.8)" }} />
                      </IconButton>
                    </Stack>

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
                            placeholder={""}
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
                              placeholder={""}
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
                              placeholder={""}
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
                              placeholder={""}
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
                        <Stack direction={"row"} alignItems={"center"} spacing={2}>
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
                  (sentence.length > 2
                    && expression[0]?.length > 3
                    && expression[1]?.length > 3
                    && expression[2]?.length > 3
                    && sentence[0]?.length > 9
                    && sentence[1]?.length > 9
                    && sentence[2]?.length > 9
                  ) ? 2 : 0}
                borderTop={`solid 1px rgba(255,255,255, 0.15)`}>
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