import { useEffect, useState } from "react";
import Image from "next/image";
import { Directus, ID } from "@directus/sdk";
import FormData from "form-data";
export default function ImageCard({
  directusData: cardData,
  setDirectusData: setCardData,
  publicData,
}) {
  const [isInEditMode, setIsInEditMode] = useState<number[]>([]);
  const [isCardUpdated, setIsCardUpdated] = useState(false);

  const directus = new Directus("http://localhost:8055");

  const handleRatingRange = (event, panda) => {
    const updatedPandas = cardData.map((uPanda) => {
      if (uPanda.id === panda.id) {
        const updatedPanda = { ...uPanda, rating: event.target.value };
        setIsCardUpdated(
          JSON.stringify(updatedPanda) !== JSON.stringify(uPanda)
        );
        return updatedPanda;
      }
      return uPanda;
    });
    setCardData(updatedPandas);
  };

  const saveUpdatedData = async (event, pandaId) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    console.log(Object.fromEntries(formData));
    const name = formData.get("updatedName");
    const id = pandaId;
    const rating = formData.get("range");

    const variables = {
      name: name,
      id: id,
      rating: rating,
    };

    const updateDataMutation = `
               mutation updatePageItem($id: ID!, $name: String!, $rating: JSON! ){
                update_pages_item(id: $id, data: {name_input: $name, rating: $rating}) {
                    id
                    name_input
                    rating
                       
                }
            }
    
    `;

    const mutateData = await directus.graphql
      .items(updateDataMutation, variables)
      .catch((error) => console.error(error + "hahlp!"));
    publicData();
    closeEditForm(id);
  };
  const openEditForm = (cardId: number) => {
    setIsInEditMode([...isInEditMode, cardId]);
  };
  const closeEditForm = (cardId: number) => {
    setIsInEditMode(isInEditMode.filter((id) => id !== cardId));
  };

  return (
    <div className="grid grid-cols-2">
      {cardData?.map((panda) => {
        return (
          <div
            key={panda.id}
            className="m-20 justify-center bg-amber-50 p-20 rounded-2xl"
          >
            {isInEditMode.includes(panda.id) ? (
              <div>
                <form
                  className="flex-col"
                  onSubmit={(event) => saveUpdatedData(event, panda.id)}
                >
                  <div>
                    <label className="m-2">New Name</label>
                    <input
                      type={"text"}
                      name={"updatedName"}
                      placeholder={panda.name_input}
                    />
                  </div>
                  <div className="flex gap-3">
                    <label> Cuteness lvl:</label>
                    <input
                      name={"range"}
                      type={"range"}
                      min={1}
                      max={7}
                      value={panda.rating}
                      onChange={(event) => handleRatingRange(event, panda)}
                    />
                    <p>{panda.rating}</p>
                  </div>
                  <div className="flex justify-between">
                    <button
                      className="bg-red-500 p-2 rounded-xl "
                      onClick={() => closeEditForm(panda.id)}
                    >
                      cancel
                    </button>
                    <button
                      className="bg-red-500 p-2 rounded-xl "
                      type={"submit"}
                    >
                      save
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <button
                  className="bg-red-500 p-4 rounded-xl "
                  onClick={() => openEditForm(panda.id)}
                >
                  Edit
                </button>
                <p>ID: {panda.id}</p>
                <p>Name: {panda.name_input}</p>
                <p>Cuteness: {panda.rating}</p>
                {panda.image ? (
                  <Image
                    className="rounded-2xl"
                    src={"http://localhost:8055/assets/" + panda.image}
                    alt={"img"}
                    width={450}
                    height={450}
                  />
                ) : null}
                <div className="flex justify-end">
                  <p>
                    {new Date(panda.date_created).toLocaleDateString("de-de")} -
                  </p>
                  <p>
                    {new Date(panda.date_created).toLocaleTimeString("de-de", {
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <button
        disabled={!isCardUpdated}
        onClick={() => console.log("gespeichert")}
        className="m-4 p-4 bg-amber-100 rounded-2xl"
      >
        Speichern
      </button>
    </div>
  );
}
