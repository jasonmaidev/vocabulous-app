import { v4 as uuidv4 } from "uuid"
import { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { IoClose } from "react-icons/io5"
import { AiFillDelete } from "react-icons/ai";
import { IoMdAdd, IoMdClose, IoMdCheckmark } from "react-icons/io";
import { MdLabel } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FiEdit2 } from "react-icons/fi";
import { setViewByLabel } from "state"
import { Box, Stack, Typography, InputBase, useTheme, IconButton, useMediaQuery, Tooltip } from "@mui/material"
import apiUrl from "config/api"

const EditLabelsRow = ({ handleDeleteLabel, id, text, labels }) => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px) and (max-height:2160px)")
  const token = useSelector((state) => state.token)
  const { _id } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const theme = useTheme()

  const queryClient = useQueryClient()

  const [isHovered, setIsHovered] = useState(false);
  const [newLabelName, setNewLabelName] = useState("")

  const [renamingLabel, setRenamingLabel] = useState(false)

  const replaceTextInArray = (array, text, newText) => {
    return array?.map(item => item === text ? newText : item);
  };

  const renamedLabels = replaceTextInArray(labels, text, newLabelName);

  // Edit Labels Mutation
  const handleRenameLabel = () => {
    if (newLabelName === "") {
      setRenamingLabel(false)
      return
    }
    renameLabelMutation.mutate()
    updateLabelsMutation.mutate()
    setRenamingLabel(false)
  }

  const renameLabelMutation = useMutation({
    mutationFn: async () => {
      return await fetch(`${apiUrl}/labels/${_id}/rename?oldLabel=${text}&newLabel=${newLabelName}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: labels
        }),
      })
    },
    onError: (error, _styleName, context) => {
      console.log('Error fetching:' + context.id + error)
    },
    onSettled: () => {
      dispatch(setViewByLabel({ viewByLabel: newLabelName }))
      queryClient.invalidateQueries({ queryKey: ["vocabLabelsData"] })
      queryClient.invalidateQueries({ queryKey: ["labeledVocabsData"] })
    }
  })

  const updateLabelsMutation = useMutation({
    mutationFn: async () => {
      return await fetch(`${apiUrl}/labels/${id}/update/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: renamedLabels
        }),
      })
    },
    onError: (error, _styleName, context) => {
      console.log('Error fetching:' + context.id + error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["vocabLabelsData"] })
    }
  })

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center" // Align items vertically in the center
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{ width: '100%' }}
    >
      {isHovered ? (
        <Tooltip title="Delete Label" placement="top">
          <IconButton size="small" onClick={() => handleDeleteLabel(text)}>
            <AiFillDelete size={24} color={theme.palette.neutral.dark} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Delete Label" placement="top">
          <IconButton size="small" onClick={() => handleDeleteLabel(text)}>
            <MdLabel size={24} color={theme.palette.neutral.dark} />
          </IconButton>
        </Tooltip>
      )}
      {renamingLabel ?
        <InputBase
          id={uuidv4()}
          placeholder={text}
          onChange={(e) => setNewLabelName(e.target.value)}
          value={newLabelName}
          required={true}
          sx={isNonMobileScreens ? {
            width: "100%",
            marginLeft: '1rem',
            borderBottom: "1px solid #f2f2f2",
          } : {
            width: "100%",
            borderRadius: "2rem",
            margin: "0",
          }}
        />
        :
        <Typography onClick={() => setRenamingLabel(true)} sx={{ flexGrow: 1, textAlign: 'left', marginLeft: '1rem' }}>{text}</Typography>
      }

      {renamingLabel ?
        <IconButton onClick={handleRenameLabel}>
          <IoMdCheckmark color={theme.palette.neutral.dark} />
        </IconButton>
        :
        <IconButton onClick={() => setRenamingLabel(!renamingLabel)}>
          <FiEdit2 color={theme.palette.neutral.dark} />
        </IconButton>
      }
    </Box>
  )
}


const EditLabelsWidget = ({ data, id, handleEditLabelsClose }) => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px) and (max-height:2160px)")
  const theme = useTheme()
  const token = useSelector((state) => state.token)
  const queryClient = useQueryClient()


  const [labels, setLabels] = useState(data)

  const [newLabel, setNewLabel] = useState("")

  const [creatingLabel, setCreatingLabel] = useState(false)
  const inputRef = useRef(null)

  const handleFocusInput = () => {
    if (inputRef.current) {
      if (creatingLabel) {
        inputRef.current.blur();
      } else {
        inputRef.current.focus(); // Focus if it's not focused
      }
      setCreatingLabel(!creatingLabel); // Toggle the state
    }
    setNewLabel("")
  };

  const handleDeleteLabel = (text) => {
    setLabels(labels.filter((label) => label !== text))
    editLabelsMutation.mutate()
  }

  // Edit Labels Mutation
  const handleEditLabels = () => {
    setLabels([...labels, newLabel])
    editLabelsMutation.mutate()
  }

  const editLabelsMutation = useMutation({
    mutationFn: async () => {
      return await fetch(`${apiUrl}/labels/${id}/update/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: labels
        }),
      })
    },
    onError: (error, _styleName, context) => {
      console.log('Error fetching:' + context.id + error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["vocabLabelsData"] })
      setNewLabel("")
    }
  })

  useEffect(() => {
    setLabels(data)
  }, [data])


  return (
    <>
      <Stack direction="column" spacing={2} p={4}>
        <IoClose
          size={24}
          onClick={handleEditLabelsClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            cursor: 'pointer'
          }}
        />
        <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center" }}>Edit Labels</Typography>
        <Stack direction="row" spacing={2} justifyContent={"space-between"} alignItems={"center"} sx={{ cursor: "pointer" }}>
          <Stack direction="row" spacing={2}>
            <IconButton onClick={handleFocusInput} >
              {creatingLabel ?
                <IoMdClose color={theme.palette.neutral.dark} />
                :
                <IoMdAdd color={theme.palette.neutral.dark} />
              }
            </IconButton>
            <InputBase
              id={uuidv4()}
              placeholder={"Create new label"}
              onChange={(e) => setNewLabel(e.target.value)}
              value={newLabel}
              required={true}
              inputRef={inputRef}
              onFocus={handleFocusInput}
              sx={isNonMobileScreens ? {
                width: "100%",
                // fontSize: "1.5rem",
                borderRadius: "2rem",
                margin: "1rem 1rem 0 1rem",
              } : {
                width: "100%",
                // fontSize: "1.5rem",
                borderRadius: "2rem",
                margin: "0",
              }}
            />
          </Stack>
          {creatingLabel ? (
            <Tooltip title="Create Label" placement="top">
              <Box>
                <IoMdCheckmark
                  size={24}
                  onClick={handleEditLabels} sx={{ opacity: creatingLabel ? 1 : 0 }}
                  style={{
                    color: !newLabel ? theme.palette.neutral.medium : theme.palette.primary.main,
                    opacity: creatingLabel ? 1 : 0
                  }}
                />
              </Box>
            </Tooltip>
          )
            : (
              <Box>
                <IoMdCheckmark
                  size={24}
                  style={{
                    cursor: "default",
                    color: !newLabel ? theme.palette.neutral.medium : theme.palette.primary.main,
                    opacity: creatingLabel ? 1 : 0
                  }}
                />
              </Box>
            )}
        </Stack>
        {data?.map((text, index) => (
          <Stack key={index} direction="row" spacing={8} justifyContent={"space-between"} alignItems={"center"} sx={{ cursor: "pointer" }}>
            <EditLabelsRow data={data} id={id} text={text} handleDeleteLabel={handleDeleteLabel} labels={labels} />
          </Stack>
        ))}
      </Stack>
    </>
  )
}

export default EditLabelsWidget