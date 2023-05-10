import "@/styles/globals.css";
import { Directus } from "@directus/sdk";
import type { AppProps } from "next/app";
import { useState } from "react";

const directus = new Directus("http://localhost:8055");
export default function App({ Component, pageProps }: AppProps) {
  const [directusData, setDirectusData] = useState(null);
  const [addIsOn, setAddIsOn] = useState(false);
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

  return (
    <Component
      {...pageProps}
      directus={directus}
      directusData={directusData}
      setDirectusData={setDirectusData}
      publicData={publicData}
      addIsOn={addIsOn}
      setAddIsOn={setAddIsOn}
    />
  );
}
