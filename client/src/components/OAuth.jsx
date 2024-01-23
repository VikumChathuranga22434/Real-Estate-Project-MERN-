import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {

  const navigate = useNavigate();
  
  // initialize the dispatcher
  const dispatch = useDispatch();

  const handleGoogleClick = async () => {
    try {

      
      // creating a const to get authentication provider
      const provider = new GoogleAuthProvider();

      // getAuth
      const auth = getAuth(app);

      // getting the sign up popup 
      const result = await signInWithPopup(auth, provider);

      // sending the nessassery data to the backend
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        })
      })

      // convert the data to JSON
      const data = await res.json();

      // use the dispatch sign in success
      dispatch(signInSuccess(data));

      // navigate to the home
      navigate('/');

    } catch (error) {
      console.log('could not sign in with google', error);
    }
  };

  return (
    <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Continue with google</button>
  )
}
