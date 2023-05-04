import { useEffect, useState } from "react";
import Image from "next/image";
import { Directus, ID } from "@directus/sdk";
import * as crypto from "crypto";
import FormData from "form-data";
import { randomUUID } from "crypto";
import { json } from "stream/consumers";
import { images } from "next/dist/build/webpack/config/blocks/images";
export default function PandaForm({
  directusData: cardData,
  setDirectusData: setCardData,
  publicData,
  setAddIsOn,
}) {
  const [ratingValue, setRatingValue] = useState(3);
  const [imageToUpload, setImageToUpload] = useState(null);

  const directus = new Directus("http://localhost:8055");

  const handleRatingRange = (event) => {
    const ratingVal = event.target.value;
    setRatingValue(ratingVal);
  };

  const handleFileInput = (event) => {
    setImageToUpload(event.target.files[0]);
  };
  // Upload Image
  const handleImageUpload = (event) => {
    event.preventDefault();
    let formdata = new FormData();
    formdata.append("title", "name");
    formdata.append("folder", "f844e100-6b43-4c60-a9a6-961a82ee4de9");
    formdata.append("file", imageToUpload);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };
    // Get Image ID inside Directus files 'folder'

    fetch("http://localhost:8055/files", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const imgData = JSON.parse(result);
        const latestImageId = imgData.data.id;
        console.log(imgData.data.id);
        saveNewPandaData(event, latestImageId);
      })
      .catch((error) => console.log("error", error));
    // publicData();
    // setAddIsOn(false);
    // console.log(event);
  };

  const saveNewPandaData = async (event, latestImageId) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    console.log(Object.fromEntries(formData));
    const name = formData.get("updatedName");
    const rating = formData.get("range");
    console.log(formData);
    console.log(rating, name);

    const variables = {
      name: name,
      rating: rating,
    };

    console.log(variables);

    const updateDataMutation = `
            mutation createPagesItem( $name: String!, $rating: JSON! ){
                create_pages_item( data: {name_input: $name, rating: $rating}) {
                    id
                    name_input
                    rating

              }
            }
    `;

    const newEntryData = await directus.graphql.items(
      updateDataMutation,
      variables
    );
    const latestId = newEntryData.data.create_pages_item.id;

    mergeImageAndData(latestId, latestImageId);
  };

  const mergeImageAndData = async (latestId: number, latestImageId: string) => {
    const imgVariables = {
      id: latestId,
      image: latestImageId,
    };
    console.log(imgVariables);

    const updateImageAtEntry = `
        mutation updatePagesItem($id : ID!, $image: String!){
                    update_pages_item( id: $id , data: {image: $image}) {
                       image{
                            id
                        }


                }
    }
        `;

    const updatedNewEntry = await directus.graphql.items(
      updateImageAtEntry,
      imgVariables
    );
  };

  // console.log(cardData);

  return (
    <div className="flex justify-center align-top p-4 bg-green-200 rounded-xl ">
      <form
        className="flex-col"
        encType={"multipart/form-data"}
        onSubmit={(event) => handleImageUpload(event)}
      >
        <div>
          <label className="m-2">New Name</label>
          <input
            type={"text"}
            name={"updatedName"}
            placeholder={"what's your pandas name?"}
            required={true}
            pattern="^[a-zA-Z]*y$"
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
          <input
            name={"range"}
            type={"range"}
            min={1}
            max={7}
            defaultValue={3}
            onChange={(event) => handleRatingRange(event)}
          />
          <p>{ratingValue}</p>
        </div>
        <div>
          <label>Upload</label>
          <input
            name={"imgUpload"}
            type={"file"}
            required={true}
            onChange={handleFileInput}
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
    </div>
  );
}
