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

  // first check the listing excist
  if (!listing) {
    return next(errorHandler(401, "Listing not found!"));
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
