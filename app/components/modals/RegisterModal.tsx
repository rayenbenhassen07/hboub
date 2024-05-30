'use client';
import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useState , useCallback } from "react";
import { FieldValues,SubmitHandler, useForm } from "react-hook-form";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../Inputs/Input";
import toast from "react-hot-toast";
import Button from "../Button";
import { signIn } from "next-auth/react";
import useLoginModal from "@/app/hooks/useLoginModal";

const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading,setIsLoading] = useState(false);

    const { 
        register, 
        handleSubmit,
        formState: {
          errors,
        },
      } = useForm<FieldValues>({
        defaultValues: {
          name: '',
          email: '',
          password: ''
        },
    });

    

    const onSubmit : SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        axios.post('/api/register', data)
            .then(() => {
                toast.success('Account created! ');
                loginModal.onOpen();
                registerModal.onClose();
            })
            .catch((error) => {
                toast.error('Something went wrong.');
            })
            .finally(()=>{
                setIsLoading(false);
            })
    }

    const onToggle = useCallback(() => {
        registerModal.onClose();
        loginModal.onOpen();
      }, [loginModal, registerModal])

    const bodyContent = (
        <div className="flex flex-col gap-4">

            <Heading 
                title="Bienvenue sur hbibna"
                subtitle="Créez un compte"
            />

            <Input
                id="email"
                label="Email"
                type="email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />

            <Input
                id="name"
                label="Nom"
                type="text"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                
            />

            <Input
                id="password"
                label="Mot de passe"
                type="password"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />

        </div>
    );

    const footerContent = (
        <div className="flex flex-col gap-2 mt-2">
            <hr />
            <Button
                outline
                label="Continuer avec Google"
                icon={FcGoogle}
                onClick={() => signIn('google') }
            />
            
            
            <div className="text-neutral-500 text-center mt-4 font-light">
                <div className="justify-center flex flex-row items-center gap-2">
                    <div>
                        Vous avez déjà un compte
                    </div>
                    <div 
                        onClick={onToggle}
                        className="text-neutral-800 cursor-pointer hover:underline"
                    >
                        Connexion
                    </div>
                </div>
                
            </div>
        </div>
    );

  return (
    <Modal 
        disabled={isLoading} // disable the modification when the user click on submit
        isOpen={registerModal.isOpen}
        title="Inscription"
        actionLabel="Continuer"
        onClose={registerModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        body={bodyContent}
        footer={footerContent}
    />
  )
}

export default RegisterModal