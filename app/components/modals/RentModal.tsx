'use client';

import { BiUpload } from "react-icons/bi";
import { FaBullseye, FaCheck } from "react-icons/fa";

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

    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState<string[]>([]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles) {
          const newFiles = Array.from(selectedFiles);
          setFile((prevFiles) => [...prevFiles, ...newFiles]);
          const newUrls = newFiles.map((file) => URL.createObjectURL(file));
          setFileUrl((prevUrls) => [...prevUrls, ...newUrls]);
      }
    };
    
    const handleImage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!file){
      return;
    }

    setIsLoading(true);

    const formData = new FormData();

    file.forEach((file) => {
        formData.append('file', file);
    });
    

    fetch("/api/documents", {
      method: "POST",
      body: formData,
    })

    .then((response) => response.json())
    .then((data) => {
      setCustomValue('images', data.imageUrls);
      toast.success('Image Uploaded');
      setIsLoading(false);
      setupload(true);
    })
    .catch(() => {
        toast.error('Something went wrong! Please try again.');
    })};
    


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

        images : [],

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
    const images = watch('images');
    

   
    
    

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
          return 'Créer'
        }
    
        return 'Suivant'
      }, [step]);

    const secondaryActionLabel = useMemo(() => {
      if (step === STEPS.CATEGORY) {
        return undefined
      }

      return 'Retour'
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
            title="Laquelle de ces options décrit le mieux votre lieu ?"
            subtitle="Choisissez une catégorie"
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
              title="Où se situe votre lieu ?"
              subtitle="Aidez les invités à vous trouver !"
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
              title="Partagez quelques informations de base sur votre lieu"
              subtitle="Quels équipements avez-vous ?"
              
            />
    
            <Counter 
              title="Invités"
              subtitle="Combien d'invités autorisez-vous ?"
              value={guestCount}
              onChange={(value) => setCustomValue('guestCount', value)}
            />

            <hr />

            <Counter 
              title="Chambres"
              subtitle="Combien de chambres avez-vous ?"
              value={roomCount}
              onChange={(value) => setCustomValue('roomCount', value)}
            />

            <hr />

            <Counter 
              title="Salles de bains"
              subtitle="Combien de salles de bains avez-vous ?"
              value={bathroomCount}
              onChange={(value) => setCustomValue('bathroomCount', value)}
            />
            
          </div>
        )
      }

      if (step === STEPS.IMAGES){
        if (step === STEPS.IMAGES){
          bodyContent = (
            <div className="flex flex-col gap-8">
              <Heading 
                title="Ajoutez quelques photos de votre lieu"
                subtitle="Aidez les invités à comprendre votre lieu"
              />
            
              {!upload ?  
                    
                <form onSubmit={handleImage}>
                  <div className="flex justify-center items-center ">
                    <label
                      htmlFor="image"
                      className="flex items-center text-center space-x-2  px-28 lg:px-44 py-5 border-2 border-dashed  border-gray-600 rounded-lg cursor-pointer "
                    >
                      <BiUpload size={20} className="h-10 w-10 text-black" />
                      <span className="text-black text-sm lg:text-xl">Importer des images</span>
                      <input
                        id="image"
                        type="file"
                        disabled={isLoading}
                        onChange={handleChange}
                        required
                        className="hidden"
                        accept="image/*"
                        multiple
                      />
                    </label>
                  </div>

                  {(fileUrl.length != 0) && (file.length != 0) && (
                    <div className="flex flex-col justify-center gap-3">
                      <div className="h-44 overflow-y-auto border-2 border-separate  border-gray-600 rounded-lg mt-4 lg:mx-4">
                        <div className="flex flex-wrap">

                          {file.map((f, index) => (
                            <div key={index} className="h-32 w-[20%] m-2 ">
                              <Image src={fileUrl[index]} alt={f.name} width={500} height={500} className="w-full h-full object-cover" />
                            </div>
                          ))}
                          
                        </div>
                      </div>

                      <div className="w-full flex justify-center items-center gap-4">
                        <button
                          type="button"
                          className="border-2 rounded-xl p-2 transition bg-red-200  hover:bg-red-500 hover:text-white"
                          onClick={() => {
                            setFile([]);
                            setFileUrl([]);
                          }}
                        >
                          Supprimer
                        </button>

                        <button
                          type="submit"
                          disabled={isLoading || !file}
                          className={`${!upload ? "": "hidden" } border-2 rounded-xl p-2 transition font-bold hover:bg-green-500 hover:text-white`} 
                        >
                          {isLoading ? "Téléversement en cours..." : "Importer"}
                          {!upload ? <span></span> : <span>Téléversé</span>}
                        </button> 
                      </div>
                      
                    </div>
                  )} 
                  
                  
                  
                </form>
              : 
                <div>
                  {fileUrl && file && (
                    <div className="flex flex-col justify-center gap-3">
                      <div className="h-44 overflow-y-auto border-2 border-separate  border-gray-600 rounded-lg mt-4 lg:mx-4">
                        <div className="flex flex-wrap">

                          {file.map((f, index) => (
                            <div key={index} className="h-32 w-[20%] m-2 ">
                              <Image src={fileUrl[index]} alt={f.name} width={500} height={500} className="w-full h-full object-cover" />
                            </div>
                          ))}
                          
                        </div>
                      </div>
                      <div className="w-full text-center font-bold text-xl flex justify-center items-center gap-4">
                        <span>Téléversé !</span>
                        <FaCheck className="text-green-500" size={26}/>
                      </div>

                    </div>    
                  )} 
                </div>
              }

                  
              
            </div>     
          )
        }
      }

      if (step === STEPS.DESCRIPTION){
        bodyContent = (
          <div className="flex flex-col gap-8">
            <Heading
              title="Comment décririez-vous votre lieu ?"
              subtitle="Courte et douce fonctionne le mieux !"
            />
    
            <Input
              id = "title"
              label="Titre"
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
              textarea
              
            />
    
          </div>
        )
      }

      if (step === STEPS.PRICE){
        bodyContent = (
          <div className="flex flex-col gap-8">
            <Heading
              title="Maintenant, fixez votre prix"
              subtitle="Combien facturez-vous par nuit !"
            />
    
            <Input
              id = "price"
              label="prix"
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
            title="Créer une annonce"
            body={bodyContent}
            disabled={isLoading}
        
        />
    )
}

export default RentModal