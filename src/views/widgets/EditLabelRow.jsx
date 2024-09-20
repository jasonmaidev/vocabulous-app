import "../../styles/radio-button.min.css"
import { useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { AiFillDelete } from "react-icons/ai";
import { MdLabel } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Stack, Typography, useTheme, useMediaQuery } from "@mui/material"
import apiUrl from "config/api"


const EditLabelsRow = ({ data, id, text }) => {
  const token = useSelector((state) => state.token)
  const queryClient = useQueryClient()

  const [isHovered, setIsHovered] = useState(false);


  const [labels, setLabels] = useState(data)

  const [newLabel, setNewLabel] = useState("")
  const inputRef = useRef(null)

  const setNewLabels = (e) => {
    setNewLabel(e.target.value)
  }

  const handleDeleteLabel = (text) => {
    setLabels(labels.filter((label) => label !== text))
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
  return (
    <Stack
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      direction="row"
      spacing={2}
    >
      {isHovered ? (
        <AiFillDelete size={24} onClick={() => handleDeleteLabel(text)} />
      ) : (
        <MdLabel size={24} onClick={() => handleDeleteLabel(text)} />
      )}
      {/* <MdLabel onClick={() => handleDeleteLabel(text)} size={24} /> */}
      <Typography sx={{ textAlign: "flex-start" }}>{text}</Typography>
    </Stack>
  )
}

export default EditLabelsRow