import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { useTheme } from "@mui/material/styles"
import OutlinedInput from "@mui/material/OutlinedInput"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import { useSelector } from "react-redux"
import { useQuery } from "@tanstack/react-query"
import apiUrl from "config/api"

export default function LabelSelect({ updateVocabLabel }) {
  const token = useSelector((state) => state.token)
  const { _id } = useSelector((state) => state.user)

  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;

  const getVocabLabels = () => {
    return fetch(`${apiUrl}/labels/${_id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
  }

  const { data } = useQuery(["vocabLabelsData"], getVocabLabels, {
    // keepPreviousData: true,
    staleTime: 500
  })

  const events = data ? data?.[0].label.sort() : []

  function getLabels(event, vocabLabel, theme) {
    return {
      fontWeight:
        vocabLabel?.indexOf(event) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    }
  }

  const ITEM_HEIGHT = isLandscape ? 40 : 56
  const ITEM_PADDING_TOP = isLandscape ? 8 : 2
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * events.length + ITEM_PADDING_TOP,
        width: isLandscape ? 150 : 160,
      },
    },
  }

  const theme = useTheme()
  const stylingOccasions = useSelector((state) => state.stylingOccasions)
  const [vocabLabel, setVocabLabel] = useState(stylingOccasions)

  const handleChange = async (event) => {
    const { target: { value }, } = event
    // On autofill we get a stringified value.
    setVocabLabel(typeof value === "string" ? value.split(",") : value)
  }

  useEffect(() => {
    updateVocabLabel(vocabLabel)
  }, [vocabLabel, updateVocabLabel])

  return (
    <div>
      <FormControl
        sx={isLandscape ? { m: 0, minWidth: 150, maxWidth: 240 } : { m: 0, minWidth: 160, maxWidth: 240 }}
      >
        <Select
          labelId="multiple-event-label"
          multiple
          value={vocabLabel}
          onChange={handleChange}
          input={<OutlinedInput sx={isLandscape ? undefined : { p: 1 }} id={uuidv4()} />}
          MenuProps={MenuProps}
          size={isPortrait ? "small" : "medium"}
        >
          {events?.map((event) => (
            <MenuItem
              key={event}
              value={event}
              labels={getLabels(event, vocabLabel, theme)}
            >
              {event}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}
