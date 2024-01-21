import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {

  // keep tracking for all data
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // funtioning the handleChange function
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  
  // declaring the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // before the submit the loading set to the true
      setLoading(true);
  
      // sending the data to the server
      const res = await fetch('/api/auth/signin', 
      {
        // converting to the formData to String
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      // converting the response for the json
      const data = await res.json();
  
      // checking the success state of the data
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
  
      // setting the loading to false
      setLoading(false);
      setError(null);

      // if all right navigate to the sign in page
      navigate('/');
      
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }


  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange} />

        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />

        <button disabled={ loading } className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-85 disabled: opacity-95'>
          { loading? 'Loading...' : 'Sign In' }
        </button>

      </form>

      <div className='flex gap-2 mt-5'>
        <p>Dont Have an account?</p>
        <Link to={"/sign-up"}>
            <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>

      {/* if there is a error we display the error message */}
      { error && <p className='text-red-500 mt-5'>{ error }</p> }

    </div>
  )
}
