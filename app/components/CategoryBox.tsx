'use client';

import qs from "query-string";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";


interface CategoryBoxProps {
    icon: IconType,
    label: string;
    selected?: boolean;
}

const CategoryBox : React.FC<CategoryBoxProps> = ({
    icon: Icon,
    label,
     selected
}) => {

    const router = useRouter();
    const params = useSearchParams();

    const handleClick = useCallback(() => {
        let currentQuery = {};

        // na5thou currentquery ou nrajj3ouha string
        if (params){
            currentQuery = qs.parse(params.toString());
        }

        // na5thou party elli fiha category=...
        const updatedQuery : any ={
            ...currentQuery,
            category : label
        };

        //itha label si deja mawjoud na7ih
        if (params?.get('category') === label) {
            delete updatedQuery.category;
          }
      
        // hna 7ot natija (updatedQuery)
        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
          }, { skipNull: true });
      
          router.push(url);
        }, [label, router, params]);

    return (
        <div
            onClick={handleClick}
            className={`
                flex 
                flex-col 
                items-center 
                justify-center 
                gap-2
                p-3
                border-b-2
                hover:text-neutral-800
                transition
                cursor-pointer
                ${selected ? 'border-b-neutral-800' : 'border-transparent'}
                ${selected ? 'text-neutral-800' : 'text-neutral-500'}
            `}
        >
            <Icon size={24} />
            <span  className="font-medium text-sm">{label}</span>
        </div>
    )
}

export default CategoryBox