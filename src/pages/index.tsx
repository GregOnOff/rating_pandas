import { Inter } from "next/font/google";
import ImageCard from "@/components/Img_Card";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Directus, ID } from "@directus/sdk";
import PandaForm from "@/components/PandaForm";
const inter = Inter({ subsets: ["latin"] });

export default function Home({
  directusData,
  setDirectusData,
  publicData,
  addIsOn,
  setAddIsOn,
}) {
  useEffect(() => {
    publicData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <header>Panda comparison </header>
      {!addIsOn ? (
        <div>
          <Link href={"/rating"}>
            <button className="rounded-2xl bg-gray-400 p-4 m-1 hover:scale-90">
              Rate Pandas
            </button>
          </Link>
          <button
            className="rounded-2xl bg-gray-400 p-4 m-1 hover:scale-90"
            onClick={() => setAddIsOn(true)}
          >
            Add new Panda
          </button>
        </div>
      ) : null}
      {addIsOn ? (
        <PandaForm
          directusData={directusData}
          setDirectusData={setDirectusData}
          publicData={publicData}
          setAddIsOn={setAddIsOn}
        />
      ) : (
        <ImageCard
          directusData={directusData}
          setDirectusData={setDirectusData}
          publicData={publicData}
        />
      )}
    </main>
  );
}
