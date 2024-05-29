'use client';

import { BiUpload } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";

import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import Heading from "../Heading";
import {categories} from "../navbar/Categories";
import CategoryInput from "../Inputs/CategoryInput";
import Input from "../Inputs/Input";
import CountrySelect from "../Inputs/CountrySelect";
import Counter from "../Inputs/Counter";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";


enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5,
}

const RentModal = () => {
    const rentModal  = useRentModal();

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(STEPS.CATEGORY);

    const [upload , setupload] = useState(false);

    const [file, setFile] = useState<File | undefined>(undefined);
    const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setFile(file);

      if (fileUrl){
        URL.revokeObjectURL(fileUrl);
      }


      if (file){
        const url = URL.createObjectURL(file);
        setFileUrl(url);
      }else{
        setFileUrl(undefined);
      }
  };

    const handleImage = (e:any) => {
    e.preventDefault();

    if(!file){
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file as any);

    fetch("/api/documents", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data[0]);
        setCustomValue('image',data[0].toString());
        setIsLoading(false);
        toast.success("Image Uploaded!");
        setupload(true);
      })
      
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
      
      
      
    };


    const {
      register,
      handleSubmit,
      setValue,
      watch,
      formState: {
        errors,
      },
      reset
    } = useForm<FieldValues>({
      defaultValues:{
        category : '',
        location : '',
        adresse :'',
        guestCount : 1,
        roomCount : 1,
        bathroomCount : 1,

        image : '',

        price : 1 ,
        title : '',
        description : ''
      }
    });

    const category = watch('category');
    const location = watch('location');
    const guestCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
    const image = watch('image');
    
    

    const setCustomValue = (id : string , value: any) =>{
      setValue(id,value ,{
        shouldValidate:true,
        shouldDirty:true,
        shouldTouch:true,
      })
    }

    const onBack = () => {
        setStep((value) => value - 1);
    };

    const onNext = () => {
        setStep((value) => value + 1);
    };

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
          return 'Create'
        }
    
        return 'Next'
      }, [step]);

    const secondaryActionLabel = useMemo(() => {
      if (step === STEPS.CATEGORY) {
        return undefined
      }

      return 'Back'
    }, [step]);

    const onSubmit : SubmitHandler<FieldValues> = (data) =>{
      if(step !== STEPS.PRICE){
        return onNext();
      }
      setIsLoading(true);

      axios.post('/api/listings',data)
      .then(() => {
        toast.success('Listing Created');
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        rentModal.onClose();
      })
      .catch(() => {
        toast.error('Something went wrong! Please try again.');
      }).finally(() => {
        setIsLoading(false);
      })

    }

      let bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading
            title="Which of these best describes your place?"
            subtitle="Pick a category"
          />
          <div 
            className="
              grid 
              grid-cols-1 
              md:grid-cols-2 
              gap-3
              max-h-[50vh]
              overflow-y-auto
            "
          >
            {categories.map((item) =>(
              <div key={item.label} className="col-span-1">

                <CategoryInput 
                  onClick={(category) =>
                    {setCustomValue('category',category)}}
                  selected={category === item.label}
                  label = {item.label}
                  icon = {item.icon}               
                />

              </div>
            ))}
          </div>
        </div>
      )

      if (step === STEPS.LOCATION){

        bodyContent = (
          <div className=" flex flex-col gap-8">
            <Heading 
            title="Where is your place located ?"
            subtitle="Help guests find you !"
            />
            
            <CountrySelect
              value={location}
              onChange={(value) => setCustomValue('location' , value)}
            />
    
            <hr />
    
            <Input
              id = "adresse"
              label="adresse"
              disabled = {isLoading}
              register={register}
              errors={errors}
              required
            />
            
          </div>
        )
      }

      if (step === STEPS.INFO){
        bodyContent = (
          <div className="flex flex-col gap-8">
            <Heading 
              title="Share some basics about your place"
              subtitle="What amenities do you have ?"
            />
    
            <Counter 
             title="Guests"
             subtitle="How many guests do you allow ?"
             value={guestCount}
             onChange={(value) => setCustomValue('guestCount' , value)}
            />
            
            <hr />
    
            <Counter 
             title="Rooms"
             subtitle="How many rooms do you have ?"
             value={roomCount}
             onChange={(value) => setCustomValue('roomCount' , value)}
            />
    
            <hr />
    
            <Counter 
             title="Bathrooms"
             subtitle="How many bathrooms do you have ?"
             value={bathroomCount}
             onChange={(value) => setCustomValue('bathroomCount' , value)}
            />  
            
          </div>
        )
      }

      if (step === STEPS.IMAGES){
        bodyContent = (
          <div className="flex flex-col gap-8">
            <Heading 
              title="Add some photos of your place"
              subtitle="Help guests understand your place"
            />
          
            {!upload ?  
                  
            <form onSubmit={handleImage}>
              <div className="flex justify-center items-center ">
                <label
                  htmlFor="image"
                  className="flex items-center text-center space-x-2  px-28 lg:px-44 py-5 border-2 border-dashed  border-gray-600 rounded-lg cursor-pointer "
                >
                  <BiUpload size={20} className="h-10 w-10 text-black" />
                  <span className="text-black text-sm lg:text-xl">Upload Image</span>
                  <input
                    id="image"
                    type="file"
                    disabled={isLoading}
                    onChange={handleChange}
                    required
                    className="hidden"
                  />
                </label>
              </div>

              {fileUrl && file && (
                <div className="flex flex-col justify-center gap-3">

                  
                  <div className="h-48 w-full m-2 ">
                    <Image src={fileUrl} alt={file.name} width={500} height={500} className="w-full h-full object-cover" />
                  </div>

                  

                  

                  <button
                    type="button"
                    className="border-2 rounded-xl p-2 transition bg-red-200  hover:bg-red-500 hover:text-white"
                    onClick={() => {
                      setFile(undefined);
                      setFileUrl(undefined);
                    }}
                  >
                    Remove
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading || !file}
                    className={`${!upload ? "": "hidden" } border-2 rounded-xl p-2 transition font-bold hover:bg-green-500 hover:text-white`} 
                  >
                    {isLoading ? "Uploading..." : "Upload"}
                    {!upload ? <span></span> : <span>Uploaded</span>}
                  </button> 
                  
                </div>
              )} 
              
              
              
            </form>
            : <div>
              {fileUrl && file && (
                <div className="flex flex-col justify-center gap-3">

                  
                  <div className="h-48 w-full m-2 ">
                    <Image src={fileUrl} alt={file.name} width={500} height={500} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full text-center font-bold text-xl flex justify-center items-center gap-4">
                    <span>Uploaded !</span>
                    <FaCheck className="text-green-500" size={26}/>
                  </div>

                </div>    
              )}
                
              </div>}

                
            
          </div>     
          
        )
      }

      if (step === STEPS.DESCRIPTION){
        bodyContent = (
          <div className="flex flex-col gap-8">
            <Heading
              title="How would you describe your place ?"
              subtitle="Short and sweet works best!"
            />
    
            <Input
              id = "title"
              label="Title"
              disabled = {isLoading}
              register={register}
              errors={errors}
              required
            />
    
            <hr />
    
            <Input
              id = "description"
              label="description"
              disabled = {isLoading}
              register={register}
              errors={errors}
              required
            />
    
          </div>
        )
      }

      if (step === STEPS.PRICE){
        bodyContent = (
          <div className="flex flex-col gap-8">
            <Heading
              title="Now, set your price"
              subtitle="How much do you charge per night!"
            />
    
            <Input
              id = "price"
              label="price"
              type="number"
              disabled = {isLoading}
              formatPrice
              register={register}
              errors={errors}
              required
            />
    
            <hr />
    
          </div>
        )
      }
      
      
    return (
        <Modal
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            title="Add post"
            body={bodyContent}
            disabled={isLoading}
        
        />
    )
}

export default RentModal