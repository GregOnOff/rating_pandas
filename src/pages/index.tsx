import Image from 'next/image'
import { Inter } from 'next/font/google'
import ImageCard from "@/pages/Img_Card";
import {useState, useEffect} from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { Directus } from '@directus/sdk';
const inter = Inter({ subsets: ['latin'] })

const directus = new Directus('http://localhost:8055')

async function publicData() {
    // GET DATA

    // We don't need to authenticate if the public role has access to some_public_collection.
    const publicData = await directus.items('pages').readByQuery({ sort: ['id'] });

    console.log(publicData.data);
}
publicData()

const client = new ApolloClient({

    uri: 'http://localhost:8055/graphql',
    cache: new InMemoryCache(),
    credentials: 'include',

});

export default function Home() {
    const [directusData, setDirectusData] = useState('')
    const fetchPandaData = async () => {
        console.log('panda power!')
        try {
            const result = await client.query({
                query: gql`
                    query {
                        panda_rating{
                            status
                        }
                    }
                `
            });
            console.log(result.data);
            setDirectusData(result.data)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPandaData();
    }, []);



        {console.log(directusData)}
    return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Rate pictures of pandas</h1>
        <p>Status: {directusData.panda_rating?.[0]?.status}</p>
        <ImageCard />
        <p>nothing here</p>
    </main>
  )
}
