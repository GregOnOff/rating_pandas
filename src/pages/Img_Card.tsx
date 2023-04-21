import {useEffect, useState} from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import Image from "next/image";

export default function ImageCard() {

    const imgURL = 'http://localhost:8055/assets/'

    const client = new ApolloClient({

        uri: 'http://localhost:8055/graphql',
        cache: new InMemoryCache(),
        credentials: 'include',

    });

    const [cardData, setcardData] = useState<null | object>(null)
    const fetchCardData = async () => {

        try {
            const result = await client.query({
                query: gql`
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
                `
            });

            setcardData(result.data)
        } catch (error) {
            console.error(error);
        }

    };


    useEffect(() => {
        fetchCardData();
    }, []);

     console.log('http://localhost:8055/assets/' + cardData?.pages[0].image.id)

    return (
        <div>
            {cardData?.pages.map((panda) => {
                return (
                    <div key={panda.id} className='m-20 justify-center bg-amber-50 p-20 rounded-2xl'>
                        <div>Status: {panda.status}</div>
                        <p>Name: {panda.name_input}</p>
                        <p>Cuteness: {panda.rating}</p>
                        <Image className='rounded-2xl' src={'http://localhost:8055/assets/' + panda.image.id} alt={'img'} width={450} height={450} />
                        <div className='flex justify-end'>
                        <p>{new Date(panda.date_created).toLocaleDateString('de-de', ) } -</p>
                        <p>{new Date(panda.date_created).toLocaleTimeString('de-de', {hour: 'numeric', minute: 'numeric'}) }</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}