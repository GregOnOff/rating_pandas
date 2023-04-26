import { useEffect, useState } from "react";
import Image from "next/image";
import { Directus, ID } from "@directus/sdk";
import * as crypto from "crypto";
import FormData from "form-data";
import { randomUUID } from "crypto";
export default function PandaForm({
  directusData: cardData,
  setDirectusData: setCardData,
  publicData,
}) {
  const [ratingValue, setRatingValue] = useState(3);

  const directus = new Directus("http://localhost:8055");

  const handleRatingRange = (event) => {
    const ratingVal = event.target.value;
    setRatingValue(ratingVal);
  };

  const saveUpdatedData = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    console.log(Object.fromEntries(formData));
    const name = formData.get("updatedName");
    const rating = formData.get("range");

    const variables = {
      name: name,
      rating: rating,
    };

    const updateDataMutation = `
            mutation createPagesItem( $name: String!, $rating: JSON! ){
                create_pages_item( data: {name_input: $name, rating: $rating}) {
                    id
                    name_input
                    rating
                    
                }
            }
    
    `;

    const newDataEntry = await directus.graphql
      .items(updateDataMutation, variables)
      .catch((error) => console.error(error + "hahlp!"));
    publicData();
  };

  return (
    <div className="grid grid-cols-1">
      <form className="flex-col" onSubmit={(event) => saveUpdatedData(event)}>
        <div>
          <label className="m-2">New Name</label>
          <input
            type={"text"}
            name={"updatedName"}
            placeholder={"what's your pandas name?"}
          />
        </div>
        <div className="flex gap-3">
          <label> Cuteness lvl:</label>
          <input
            name={"range"}
            type={"range"}
            min={1}
            max={7}
            onChange={(event) => handleRatingRange(event)}
          />
          <p>{ratingValue}</p>
        </div>
        <div className="flex justify-between">
          <button
            className="bg-red-500 p-2 rounded-xl "
            onClick={() => console.log("close add option")}
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
