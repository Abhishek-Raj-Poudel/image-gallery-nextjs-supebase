import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
// now we will create client and use it to make a database of images
import { createClient } from "@supabase/supabase-js";
// this only runs on the surver
export async function getStaticProps() {
  const superbaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPERBASE_URL || "",
    process.env.SUPERBASE_SERVICE_ROLE_KEY || ""
  );
  // a new quary done to supabase Admin from images to select all according to the order of id
  const { data } = await superbaseAdmin.from("images").select("*").order("id");

  return {
    props: {
      images: data,
    },
    revalidate: 60,
  };
}

type Image = {
  id: number;
  href: string;
  imageSrc: string;
  name: string;
  username: string;
};

const Home = ({ images }: { images: Image[] }) => {
  return (
    <div className=" relative max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <Head>
        <title>Image Gallary App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-center font-black text-5xl md:text-7xl mb-20 font-serif">
          Done Splash
        </h1>
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols2 gap-x-6 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 pb-5">
          {/* image here */}
          {images?.map((image) => (
            <ImageComponent key={image.id} image={image} />
          ))}
          {/* <ImageComponent /> */}
        </div>
      </main>

      <footer className="flex pt-10 w-full items-center justify-center border-t">
        Made by Abhishek raj poudel
      </footer>
    </div>
  );
};

export default Home;

//helper funciton that combines a list of classname
function cn(...classes: string[]) {
  return classes.filter(Boolean).join("");
}
// this will blur and then unblur as a loading mechanism.
function ImageComponent({ image }: { image: Image }) {
  const [isLoading, setLoading] = useState(true);

  return (
    <Link href={image.href} className="group bg-gray-100 rounded-lg pb-2">
      <div className="aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8 w-full overflow-hidden rounded-t-lg ">
        <Image
          src={image.imageSrc}
          alt=""
          width={1920}
          height={1080}
          className={cn(
            "group-hover:opacity-75 duration-700 ease-in-out object-cover ",
            isLoading
              ? "grayscale blur-2xl scale-110"
              : "grayscale-0 blur-0 scale-100"
          )}
          onLoadingComplete={() => setLoading(false)}
        />
      </div>
      <h3 className="mt-4 ml-4 text-sm text-gray-700">{image.name}</h3>
      <p className="mt-1 ml-4 text-lg font-medium text-gray-900">
        {image.username}
      </p>
    </Link>
  );
}
