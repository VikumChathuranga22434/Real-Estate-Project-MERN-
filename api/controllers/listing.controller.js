import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    // create a listing
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  // first check the listing exist
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  // check the user owns that listing or not
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings"));
  }

  // if all cofitions true
  try {
    // then we delete the listing
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been Deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  // check the listing excist
  const listing = await Listing.findById(req.params.id);
  // first check the listing exist
  try {
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    // check the user owns that listing or not
    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, "You can only update your own listings"));
    }
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not Found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
