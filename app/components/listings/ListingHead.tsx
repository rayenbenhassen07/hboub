'use client';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import Image from "next/image";


import { SafeUser } from "@/app/types";

import Heading from "../Heading";
import HeartButton from "../HeartButton";

interface ListingHeadProps {
  title: string;
  locationValue: string;
  adresse: string;
  imageSrc: string[];
  id: string;
  currentUser?: SafeUser | null
}

const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  locationValue,
  adresse,
  imageSrc,
  id,
  currentUser
}) => {
  

  const location = locationValue;

  return (
    <>
      <Heading title={title} subtitle={`${location}, ${adresse}`} />

      <div className="w-full h-[70vh] mx-auto overflow-hidden rounded-xl relative">
        
         
        <div className="w-full z-10">
          <Swiper
            navigation
            pagination={{
              type: 'progressbar',
            }}
            modules={[Navigation, Pagination]}
            onSwiper={swiper => console.log(swiper)}
            className='h-[70vh] w-full rounded-lg mySwiper'
          >
            {imageSrc.map((src, index) => (
            <SwiperSlide >
              <Image
                key={index}
                src={src}
                width={1000}
                height={600}
                className="object-cover w-full h-full"
                alt="Image"
              />
            </SwiperSlide>
            ))}
          </Swiper>
        </div>
      

        <div className="absolute top-5 right-5 z-10">
          <HeartButton listingId={id} currentUser={currentUser} />
        </div>
      </div>
    </>
  );
}
 
export default ListingHead;