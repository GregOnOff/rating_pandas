import {useEffect, useState} from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import Image from "next/image";

export default function ImageCard({directusData: cardData, setDirectusData: setCardData, publicData}) {
    const [isEditMode, setIsEditMode] = useState(false)
    const imgURL = 'http://localhost:8055/assets/'

    const client = new ApolloClient({

        uri: 'http://localhost:8055/graphql',
        cache: new InMemoryCache(),
        credentials: 'include',

    });
    const [isCardUpdated, setIsCardUpdated] = useState(false);

    const handleRatingRange = (event, panda) => {
        const updatedPandas = cardData.map((uPanda) => {
            if (uPanda.id === panda.id) {
                const updatedPanda = { ...uPanda, rating: event.target.value };
                setIsCardUpdated(JSON.stringify(updatedPanda) !== JSON.stringify(uPanda));
                return updatedPanda
            }
            return uPanda;
        });
        setCardData(updatedPandas);
    };


    return (
        <div className='grid grid-cols-2'>
            {cardData?.map((panda, index) => {
                return (
                    <div key={panda.id} className='m-20 justify-center bg-amber-50 p-20 rounded-2xl'>
                    {isEditMode ? (<div >

                        <form className='flex-col'>
                            <div>
                        <label className='m-2'>New Name</label>
                            <input/>
                            </div>
                        <label> Cuteness lvl:
                        </label>
                            <input type={"range"} min={1} max={7} value={panda.rating} onChange={(event) => handleRatingRange(event, panda)}/>

                        </form>
                        <div className='flex justify-between'>
                        <button className='bg-red-500 p-2 rounded-xl ' onClick={() => setIsEditMode(false)}>cancel</button>
                        <button className='bg-red-500 p-2 rounded-xl ' type={'submit'}>save</button>
                        </div>
                    </div>) :(
                                <div>
                                    <button className='bg-red-500 p-4 rounded-xl ' onClick={() => setIsEditMode(true)}>Edit</button>
                                <p>ID: {panda.id}</p>
                                <p>Name: {panda.name_input}</p>
                                <p>Cuteness: {panda.rating}</p>
                                {panda.image ? (
                                <Image className='rounded-2xl' src={'http://localhost:8055/assets/' + panda.image} alt={'img'} width={450} height={450} />
                                ) : null }
                            <div className='flex justify-end'>
                                <p>{new Date(panda.date_created).toLocaleDateString('de-de', ) } -</p>
                                <p>{new Date(panda.date_created).toLocaleTimeString('de-de', {hour: 'numeric', minute: 'numeric'}) }</p>
                            </div>
                                </div>
                        )}

                    </div>

                )
            })}
            <button disabled={!isCardUpdated} onClick={() => console.log('gespeichert')} className='m-4 p-4 bg-amber-100 rounded-2xl'>
                Speichern
            </button>
        </div>
    )
}