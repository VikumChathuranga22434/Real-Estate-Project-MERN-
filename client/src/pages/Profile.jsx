import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";

export default function Profile() {
  // getting the current user and saved details
  const { currentUser } = useSelector((state) => state.user);

  // getting the useRef to configure a click event on the on the image
  const fileRef = useRef(null);

  // setting a change file state to the keep track of the image changes
  const [file, setFile] = useState(undefined);
  console.log(file);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      {/* creating form for the profile page */}
      <form className="flex flex-col gap-3">
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
          src={currentUser.avatar}
          alt="Profile-Picture"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          onClick={() => fileRef.current.click()}
        />

        {/* getting the updated input details from the user */}
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />

        {/* adding buttons */}
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>

      {/* implementing the delete account and sign out buttons */}
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}
