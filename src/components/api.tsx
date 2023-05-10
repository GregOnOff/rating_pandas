import { Directus } from "@directus/sdk";
import FormData from "form-data";

const API_ENDPOINT = "http://localhost:8055";
const directus = new Directus(API_ENDPOINT);

export async function uploadImage(
  event,
  imageToUpload,
  imageProvidingFolder,
  publicData
) {
  const formdata = new FormData();
  formdata.append("title", imageToUpload.name);
  formdata.append("folder", imageProvidingFolder);
  formdata.append("file", imageToUpload);

  try {
    const response = await fetch(`${API_ENDPOINT}/files`, {
      method: "POST",
      body: formdata,
      redirect: "follow",
    });

    const imgData = await response.json();
    const latestImageId = imgData.data.id;
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
    const latestItemId = newEntryData.data.create_pages_item.id;

    const imgVariables = {
      id: latestItemId,
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
  } catch (error) {
    console.log("error", error);
  }
  publicData();
}
