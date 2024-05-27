
import Select from 'react-select';

interface CountrySelectProps {
    value : any;
    onChange : (value : any) => void ;
}


export const States = [
    "Ariana",
    "Béja",
    "Ben Arous",
    "Bizerte",
    "Gabès",
    "Gafsa",
    "Jendouba",
    "Kairouan",
    "Kasserine",
    "Kébili",
    "Kef",
    "Mahdia",
    "Manouba",
    "Médenine",
    "Monastir",
    "Nabeul",
    "Sfax",
    "Sidi Bouzid",
    "Siliana",
    "Sousse",
    "Tataouine",
    "Tozeur",
    "Tunis",
    "Zaghouan"
  ];


const CountrySelect : React.FC<CountrySelectProps> = ({
    value,
    onChange
}) => {
    
    

    return (
        <div>
            <Select 
            className="z-20"
            placeholder='Anywhere'
            isClearable
            options={States.map(state => ({ value: state, label: state }))}
            value={value}
            onChange={(value) => onChange(value)}
            formatOptionLabel={(option : any) =>(
                <div className='flex flex-row items-center gap-3'> 
                    <div>
                        {option.label}
                    </div>
                </div>
            )}
            classNames={{
                control:()=>'p-3 border-2',
                input:() => 'text-lg',
                option : () => 'text-lg '
            }}
            theme={(theme) => ({
                ...theme,
                borderRadius : 6,
                colors:{
                    ...theme.colors,
                    primary :'#40A578',
                    primary25:'#BFF6C3'
                }

            })}
            />

        </div>
    )
}

export default CountrySelect