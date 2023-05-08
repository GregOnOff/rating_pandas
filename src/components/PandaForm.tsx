import { useState } from "react";
import { uploadImage } from "@/components/api";
import { Paper, TextField, Slider } from "@mui/material";

export default function PandaForm({
  directusData: cardData,
  setDirectusData: setCardData,
  publicData,
  setAddIsOn,
}) {
  const [ratingValue, setRatingValue] = useState(3);
  const [imageToUpload, setImageToUpload] = useState(null);

  const imageProvidingFolder = "f844e100-6b43-4c60-a9a6-961a82ee4de9";

  return (
    <Paper elevation={24} className={"p-3"}>
      <form
        className="flex-col"
        encType={"multipart/form-data"}
        onSubmit={(event) => {
          event.preventDefault();
          uploadImage(event, imageToUpload, imageProvidingFolder);
          publicData();
        }}
      >
        <div>
          <label className="m-2">New Name</label>
          <TextField
            type={"text"}
            name={"updatedName"}
            placeholder={"what's your pandas name?"}
            required={true}
            inputProps={{
              pattern: "^[a-zA-Z]*y$",
            }}
            onInvalid={(event) =>
              event.target.setCustomValidity(
                "Bitte wähle einen Namen der auf 'y' endet."
              )
            }
            onChange={(event) => event.target.setCustomValidity("")}
          />
        </div>
        <div className="flex gap-3">
          <label> Cuteness lvl:</label>
          <Slider
            name="range"
            value={ratingValue}
            onChange={(event, newValue) => {
              setRatingValue(newValue);
            }}
            min={1}
            max={7}
            defaultValue={3}
            aria-labelledby="discrete-slider"
            step={1}
            marks
            valueLabelDisplay="auto"
          />
          <p>{ratingValue}</p>
        </div>
        <div>
          <label>Upload</label>
          <input
            name={"imgUpload"}
            type={"file"}
            required={true}
            onChange={(event) => setImageToUpload(event.target.files[0])}
          />
        </div>
        <div className="flex justify-between">
          <button
            className="bg-red-500 p-2 rounded-xl "
            onClick={() => setAddIsOn(false)}
          >
            cancel
          </button>
          <button className="bg-red-500 p-2 rounded-xl " type={"submit"}>
            save
          </button>
        </div>
      </form>
    </Paper>
  );
}
