'use client'

import useAllimagesModal from "@/app/hooks/useAllimagesModal"
import Modal from "./Modal";

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Image from "next/image";

interface AllimagesModalProps{
  imageSrc: string[];

} 
const AllimagesModal:React.FC<AllimagesModalProps> = ({
  imageSrc
}) => {

    const AllimagesModals = useAllimagesModal();

    const bodyContent = (
      <div >
        <Swiper
          navigation
          pagination={{ 
            type: 'progressbar',
          }}
          modules={[Navigation, Pagination]}
          onSwiper={swiper => console.log(swiper)}
          className='h-[50vh] lg:h-[60vh] w-full rounded-lg mySwiper'
        >
          {imageSrc.map((src, index) => (
          <SwiperSlide >
            <Image
              key={index}
              src={src}
              width={1000}
              height={600}
              className="object-cover w-full h-full "
              alt="Image"
              objectFit="center" // Add this line to center the image
            />
          </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );

  return (
    <Modal
      isOpen={AllimagesModals.isOpen}
      onClose={AllimagesModals.onClose} 
      body={bodyContent}    
      title="toutes les photos"
    />
  )
}

export default AllimagesModal