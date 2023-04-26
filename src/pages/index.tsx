import { Inter } from "next/font/google";
import ImageCard from "../../components/Img_Card";
import { useState, useEffect } from "react";
import { Directus, ID } from "@directus/sdk";
import FormData from "form-data";
import PandaForm from "../../components/PandaForm";
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

  useEffect(() => {
    publicData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 ">
      <header>Panda comparison </header>
      <div>
        <button className="rounded-2xl bg-gray-400 p-4 m-1 hover:scale-90">
          Rate Pandas
        </button>
        <button className="rounded-2xl bg-gray-400 p-4 m-1 hover:scale-90">
          Add new Panda
        </button>
      </div>
      <p>See our collection</p>
      <PandaForm
        directusData={directusData}
        setDirectusData={setDirectusData}
        publicData={publicData}
      />
      <ImageCard
        directusData={directusData}
        setDirectusData={setDirectusData}
        publicData={publicData}
      />
    </main>
  );
}
