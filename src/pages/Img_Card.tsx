import {useEffect, useState} from "react";

import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

export default function ImageCard() {
    const client = new ApolloClient({

        uri: 'http://localhost:8055/graphql',
        cache: new InMemoryCache(),
        credentials: 'include',

    });

    const [cardData, setcardData] = useState('')
    const fetchCardData = async () => {
        console.log('panda power!')
        try {
            const result = await client.query({
                query: gql`
                    query {
                        pages{
                            status
                        }
                    }
                `
            });
            console.log(result.data);
            setcardData(result.data)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCardData();
    }, []);


    return (
        <div>
        <h1>ImageCard</h1>
            <p>Status: {cardData.pages?.[0]?.status}</p>
        </div>
    )
}