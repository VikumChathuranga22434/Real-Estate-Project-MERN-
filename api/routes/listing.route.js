import express from "express";
import { createListing } from "../controllers/listing.controller";

const router = express.Router();

router.post("/create", createListing);
