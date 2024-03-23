import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch, IoIosPersonAdd } from 'react-icons/io';
import { IoChatboxEllipses } from "react-icons/io5";
import { fetchUser } from '../utils/fetchUser';

const Navbar = ({ user, query, setSearchParams }) => {
  const navigate = useNavigate();
  const [user_data, setUserData] = useState({});
  // console.log(user_data);

  useEffect(() => {
    const user = fetchUser();
    setUserData(user);
  }, []);

  return (
    <div className='flex gap-2 md:gap-5 w-full mt-5 pb-4'>
      <div className='flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm'>
        <IoMdSearch fontSize={21} className='ml-1' />
        <input
          type='text'
          onChange={(e) => setSearchParams((prev) => {
            const q = e.target.value;
            prev.set('q', q);
            return prev;
          }, { replace: true })}
          placeholder='Search'
          value={query}
          className='p-2 w-full bg-white outline-none'
        />
        <Link to={`/user-profile/${user_data?.email}`}>
        <p className="font-semibold capitalize">
          {user_data?.name?.length > 20
            ? `${user_data?.name.slice(0, 20)}...`
            : user_data?.name}
            
        </p>

        </Link>
        {user_data && (
       

        <Link to={`/user-profile/${user_data?.email}`}>
        <img src={user_data?.imageUrl} alt='user-pic' className='rounded-full w-10 mr-3' />

        </Link>
       
          )}
      </div>

      <div className='flex gap-2 items-center'>
        {user_data ? (
         <>
            <Link to="/create-pin" className="bg-black text-white rounded-xl w-8 h-8 flex justify-center items-center">
              <IoMdAdd />
            </Link>

            <Link to="/chat" className="bg-black text-white rounded-xl w-8 h-8 flex justify-center items-center">
              <IoChatboxEllipses  />
            </Link>

          
</>
          
        ) : (
          <Link to={`/login`} >
            <IoIosPersonAdd className='w-8 h-8' />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
