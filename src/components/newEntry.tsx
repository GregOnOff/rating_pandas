import FormData from "form-data";
import { Directus } from "@directus/sdk";

const API_ENDPOINT = "http://localhost:8055";

const directus = new Directus(API_ENDPOINT);

export default function saveNewPandaData = async (event, latestImageId) => {
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

    // mergeImageAndData(latestItemId, latestImageId);
};