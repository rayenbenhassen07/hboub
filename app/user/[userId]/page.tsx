'use client';
import Avatar from '@/app/components/Avatar';
import Loader from '@/app/components/Loader';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface User {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: string;
  image?: string;
}

interface UserParams {
  userId?: string;
}

const Page = ({ params }: { params: UserParams }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (params.userId) {
      axios.get(`/api/getUser/${params.userId}`)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [params.userId]);

  return (
    <div className='h-[70vh] w-full flex justify-center items-center'>
      {user ? (
        <div className='w-96 m-2 lg:m-0'>
            <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-900 p-4">
                <h2 className="text-white text-lg font-semibold mb-2">User Details</h2>
            </div>
            <div className="p-4 relative">
                
                <div className="mb-4">
                    <p className="text-gray-600 font-medium">Nom:</p>
                    <p className="text-gray-900">{user.name}</p>
                </div>
                <div className="mb-4">
                    <p className="text-gray-600 font-medium">Email:</p>
                    <p className="text-gray-900">{user.email}</p>
                </div>
                
                <div className="mb-4 absolute -top-10 right-5">
                    
                    <Avatar width={70} height={70} src={user.image} />
                </div>
                {/* Display other user properties as needed */}
            </div>
        </div>
    
    </div>
      ) : (
        <Loader/>
      )}
    </div>
  );
};

export default Page;
