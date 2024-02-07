import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFaliure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFaliure,
  singOutUserStart,
  singOutUserSuccess,
  singOutUserFaliure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
  // getting the current user and saved details
  const { currentUser, loading, error } = useSelector((state) => state.user);

  // getting the useRef to configure a click event on the on the image
  const fileRef = useRef(null);

  // setting a change file state to the keep track of the image changes
  const [file, setFile] = useState(undefined);

  // to display the uploading percetage to the user
  const [filePerc, setFilePerc] = useState(0);

  // define a useState for the handle the error
  const [fileUploadError, setFileUploadError] = useState(false);

  // define a useState for get updated form data
  const [formData, setFormData] = useState({});

  // define the update success state
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // initialzing the useDispatcher
  const dispatch = useDispatch();

  // initialize the Showing listing Error
  const [showListingsError, setShowListingsError] = useState(false);

  // save the listing data into a array
  const [userListing, setUserListing] = useState([]);

  // using the use efect to upload the file
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // implemting the handleFileUpload function
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress)); // get the rounded precentage while uploading
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  // implementing the handleChange function
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // implementing the handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //starting the dispatch
      dispatch(updateUserStart());

      // initializing the api route
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // getting the res
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFaliure(data.message));
        return;
      }

      // if every thing success
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFaliure(error.message));
    }
  };

  // implemtnting the handleDeleteUser function
  const handleDeleteUser = async (e) => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFaliure(data.message));
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFaliure(error.message));
    }
  };

  // implement the handleSignOut function
  const handleSignOut = async () => {
    try {
      dispatch(singOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(singOutUserFaliure(data.message));
        return;
      }
      dispatch(singOutUserSuccess(data));
    } catch (error) {
      dispatch(singOutUserFaliure(error.message));
    }
  };

  // implementing the handleShowListings function
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListing(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  // implement the delete listing
  const handleListingDelete = async (listingId) => {
    try {
      // send the res api
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      // getting the respose
      const data = res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      // updating the user listing
      setUserListing((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      {/* creating form for the profile page */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* // get a file input for the update profile photo */}
        <input
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />

        <img
          src={formData.avatar || currentUser.avatar}
          alt="Profile-Picture"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          onClick={() => fileRef.current.click()}
        />

        <p className="text-sm self-center ">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (Image must be less than 2MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image Successfully Uploaded!</span>
          ) : (
            ""
          )}
        </p>

        {/* getting the updated input details from the user */}
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        {/* adding buttons */}
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading" : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>

      {/* implementing the delete account and sign out buttons */}
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User is Updated Successfully" : ""}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listing
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>
      {userListing && userListing.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListing.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4  "
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold flex-1 hover:underline truncate"
                to={`/listing/${listing._id}`}
              >
                <p className="">{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <button className="text-green-700 uppercase">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
