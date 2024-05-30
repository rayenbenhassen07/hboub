'use client';
import qs from "query-string";
import { useSearchParams , useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import Modal from "./Modal"
import Heading from "../Heading";
import CountrySelect from "../Inputs/CountrySelect";
import Calendar from "../Inputs/Calendar";

import useSearchModal from "@/app/hooks/useSearchModal"
import {  Range } from "react-date-range";
import { formatISO } from "date-fns";
import Counter from "../Inputs/Counter";




enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2
}

const SearchModal = () => {
  const router = useRouter();
  const params = useSearchParams();
  const searchModal = useSearchModal();

  const [step , setStep] = useState(STEPS.LOCATION);
  const [locationValue, setlocationValue] = useState< {value : string ,label : string }>({value : "", label: ""}); // Add type annotation to locationValue

  
  

  const [guestCount, setGuestCount] = useState(1);
  
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });

  




  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO) {
      return onNext();
    }

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString())
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationValue: locationValue.value,
      guestCount,
      roomCount,
      bathroomCount
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl({
      url: '/',
      query: updatedQuery,
    }, { skipNull: true });

    setStep(STEPS.LOCATION);
    searchModal.onClose();
    router.push(url);
  }, 
  [
    step, 
    searchModal, 
    locationValue, 
    router, 
    guestCount, 
    roomCount,
    dateRange,
    onNext,
    bathroomCount,
    params
  ]);

  const actionLabel = useMemo(() => {
    if(step === STEPS.INFO) {
      return 'Rechercher';
    }

    return 'Suivant';
  },[step])

  const secondaryActionLabel = useMemo(() => {
    if(step === STEPS.LOCATION) {
      return undefined;
    }

    return 'Retour';
  },[step])

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Où voulez-vous aller ?"
        subtitle="Trouvez l'emplacement parfait !"
        
      />

      <CountrySelect 
        
        value={locationValue}
        onChange={(value) => {setlocationValue(value)}}
      />

      

      <hr />
      
    </div>
  )

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Quand prévoyez-vous d'y aller ?"
          subtitle="Assurez-vous que tout le monde est disponible !"
        />
        <Calendar
          value={dateRange}
          onChange={(value) => setDateRange(value.selection)}
        />
      </div>
    )
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Plus d'informations"
          subtitle="Trouvez votre lieu parfait !"
        />
        <Counter 
          onChange={(value) => setGuestCount(value)}
          value={guestCount}
          title="Invités" 
          subtitle="Combien d'invités viennent ?"
        />
        <hr />
        <Counter 
          onChange={(value) => setRoomCount(value)}
          value={roomCount}
          title="Chambres" 
          subtitle="Combien de chambres avez-vous besoin ?"
        />        
        <hr />
        <Counter 
          onChange={(value) => setBathroomCount(value)}
          value={bathroomCount}
          title="Salles de bains"
          subtitle="Combien de salles de bains avez-vous besoin ?"
        />

      </div>
    )
  }
 
  return (
    <Modal
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      onSubmit={onSubmit}
      title="Filtres"
      actionLabel={actionLabel}
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      secondaryActionLabel={secondaryActionLabel}
      body={bodyContent}
    />
  )
}

export default SearchModal