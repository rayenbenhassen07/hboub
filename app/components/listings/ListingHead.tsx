"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Image from "next/image";

import { SafeUser } from "@/app/types";

import Heading from "../Heading";
import HeartButton from "../HeartButton";
import AllimagesModal from "../modals/AllimagesModal";
import Button from "../Button";
import useAllimagesModal from "@/app/hooks/useAllimagesModal";

interface ListingHeadProps {
  title: string;
  locationValue: string;
  adresse: string;
  imageSrc: string[];
  id: string;
  currentUser?: SafeUser | null;
}

const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  locationValue,
  adresse,
  imageSrc,
  id,
  currentUser,
}) => {
  const location = locationValue;
  const AllimagesModals = useAllimagesModal();

  return (
    <>
      <Heading title={title} subtitle={`${location}, ${adresse}`} />

      <div className="w-full  mx-auto overflow-hidden rounded-xl relative">
        {/* --  image grid for PC*/}
        <div className="hidden lg:block">
          <div className=" w-full h-[50vh] flex flex-col lg:flex-row gap-2 ">
            <div className="w-[50%] h-full ">
              {imageSrc[0] && (
                <Image
                  src={imageSrc[0]}
                  width={500}
                  height={400}
                  className="object-cover w-full h-full rounded-l-2xl  cursor-pointer "
                  alt="Image"
                  objectFit="center" // Add this line to center the image
                />
              )}
            </div>

            <div className="w-[50%] h-full flex flex-row gap-2  ">
              <div className="w-[50%] h-full flex flex-col gap-1  ">
                <div className="w-full h-[50%] ">
                  {imageSrc[1] && (
                    <Image
                      src={imageSrc[1]}
                      width={500}
                      height={400}
                      className="object-cover w-full h-full cursor-pointer "
                      alt="Image"
                      objectFit="center" // Add this line to center the image
                    />
                  )}
                </div>
                <div className="w-full h-[50%]">
                  {imageSrc[2] && (
                    <Image
                      src={imageSrc[2]}
                      width={500}
                      height={400}
                      className="object-cover w-full h-full cursor-pointer "
                      alt="Image"
                      objectFit="center" // Add this line to center the image
                    />
                  )}
                </div>
              </div>
              <div className="w-[50%] h-full flex flex-col gap-1  ">
                <div className="w-full h-[50%] ">
                  {imageSrc[3] && (
                    <Image
                      src={imageSrc[3]}
                      width={500}
                      height={400}
                      className="object-cover w-full h-full rounded-tr-2xl cursor-pointer"
                      alt="Image"
                      objectFit="center" // Add this line to center the image
                    />
                  )}
                </div>
                <div className="w-full h-[50%]">
                  {imageSrc[4] && (
                    <Image
                      src={imageSrc[4]}
                      width={500}
                      height={400}
                      className="object-cover w-full h-full rounded-br-2xl cursor-pointer"
                      alt="Image"
                      objectFit="center" // Add this line to center the image
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --  image grid for TELEPHON*/}
        <div className="lg:hidden">
          <Swiper
            navigation
            pagination={{
              type: "progressbar",
            }}
            modules={[Navigation, Pagination]}
            onSwiper={(swiper) => console.log(swiper)}
            className="h-[50vh] lg:h-[60vh] w-full rounded-lg mySwiper"
          >
            {imageSrc.map((src, index) => (
              <SwiperSlide key={index}>
                <Image
                  key={index}
                  src={src}
                  width={500}
                  height={400}
                  className="object-cover w-full h-full "
                  alt="Image"
                  objectFit="center" // Add this line to center the image
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <button
          className="hidden lg:block absolute bottom-5 right-5 z-10 bg-white rounded-full p-1 text-sm hover:bg-black hover:text-white transition"
          onClick={AllimagesModals.onOpen}
        >
          Afficher toutes les photos
        </button>

        <div className="absolute top-5 right-5 z-10">
          <HeartButton listingId={id} currentUser={currentUser} />
        </div>
      </div>

      <AllimagesModal imageSrc={imageSrc} />
    </>
  );
};

export default ListingHead;
