import Image from "next/image";
import { Inter } from "next/font/google";
import ImageCard from "@/pages/Img_Card";
import { useState, useEffect } from "react";
import { Directus, ID } from "@directus/sdk";
import { render } from "react-dom";
import FormData from "form-data";
const inter = Inter({ subsets: ["latin"] });

const directus = new Directus("http://localhost:8055");

export default function Home() {
  const [directusData, setDirectusData] = useState(null);
  async function publicData() {
    // We don't need to authenticate if the public role has access to some_public_collection.
    const pubData = await directus.items("pages").readByQuery();
    const publicData = await directus.graphql.items(`
                    query {
                        pages{
                            id
                            name_input
                            image {
                                id
                            }
                            rating
                            status
                            user_created
                            date_created
                        }
                    }
                `);

    const mutation = `
            mutation {
                update_pages_item(id: 1, data: {name_input: "Andy Dorable"}) {
                    id
                    name_input
                }
            }
    
    `;
    const mutateData = await directus.graphql
      .items(mutation)
      .catch((error) => console.error("bitte helfen sie mir!"));

    setDirectusData(pubData.data);
  }

  function createPanda() {
    directus
      .items("pages")
      .createOne({
        name_input: "Panda1",
      })
      .then((response) => {
        console.log("New post created:", response);
        publicData();
      })
      .catch((error) => console.error("Error creating new post:", error));
  }

  useEffect(() => {
    publicData();
  }, []);

  const handleUpdate = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const name = formData.get("updatedName");
    const id = 1;
    const rating = formData.get("rating");

    const variables = {
      name: name,
      id: id,
    };

    const updateMutation = `
    mutation updatePageItem($id: ID!, $name: String!) {
      update_pages_item(id: $id, data: { name_input: $name }) {
        id
        name_input
      }
    }
  `;

    const mutateData = await directus.graphql
      .items(updateMutation, variables)
      .catch((error) => console.error(error + "hahlp!"));

    console.log(mutateData);
    console.log(directusData);
    publicData();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 ">
      <h1>Rate pictures of pandas</h1>
      {/*<button className='rounded-2xl bg-red-500 p-4' onClick={() => createPanda()}>Create new Panda</button>*/}
      <form onSubmit={handleUpdate} name={"updateMyPanda"}>
        <div>
          <label>New Panda Name</label>
          <input type={"text"} name={"updatedName"} />
        </div>
        <button className="m-4 p-4 rounded-xl bg-gray-400" type={"submit"}>
          Submit
        </button>
      </form>
      {/*<p>Status: {directusData?[0].rating}</p>*/}
      <ImageCard
        directusData={directusData}
        setDirectusData={setDirectusData}
        publicData={publicData}
      />
    </main>
  );
}
