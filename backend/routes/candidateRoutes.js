const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidateModel");
const { jwtAuthMiddleware, generateToken } = require("./../jwt");
const User = require("../models/userModel");

const checkAdminRole = async (userID) => {
  try {
    const user = await User.findById(userID);
    if (user.role === "admin") {
      return true;
    }
  } catch (err) {
    return false;
  }
};
//post request to add a candidate
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    const isAdmin = await checkAdminRole(req.user.id);
    if (!isAdmin) {
      return res.status(403).json({ message: "Unauthorized: Admins only" });
    }
    const { name, party, age } = req.body;
    console.log(req.body);
    // Check if the required fields are present
    if (!name || !party || !age) {
      return res.status(400).json({ error: "All fields are required" });
    }
    //Capitalising PRTY name to verify they dont do extra candidate with same party
    const Capsparty = party.toUpperCase();
    console.log(Capsparty);
    //check if the candidate party already exists
    const existingParty = await Candidate.findOne({ party: Capsparty });
    if (existingParty) {
      return res.status(400).json({ error: "Party already exists " });
    }

    const newCandidate = new Candidate({ name, party: Capsparty, age });
    const savedCandidate = await newCandidate.save();

    console.log(
      `Candidate Created - Name: ${savedCandidate.name}, Party: ${savedCandidate.party}, ID: ${savedCandidate._id}`
    );

    res.status(201).json({
      message: "Candidate created successfully",
      candidate: savedCandidate,
    });
  } catch (err) {
    console.error("Error creating candidate:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:candidateId", jwtAuthMiddleware, async (req, res) => {``
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "unauthorized to Admin" });
    const candidateId = req.params.candidateId; //retrive the parameter from the id url
    const updateCandidateData = req.body; //retrive data from the body by the miiddle ware body-parser
    const response = await Candidate.findByIdAndUpdate(
      candidateId,
      updateCandidateData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!response) {
      res
        .status(403)
        .json({ errro: `Not found person having Id ${candidateId}` });
      console.log(`Not found person having Id ${candidateId}`);
    }
    console.log(
      `updated data : ${response.name} ,${response.age},${response.party}`
    );
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.delete("/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "unauthorized to Admin" });
    const deleteId = req.params.candidateId;
     const response = await Candidate.findByIdAndDelete(deleteId);
    if (!response) {
      return res.status(404).json({ error: "Person Not Found" });
    }
    console.log(
      `deleted successfully  party:${response.party} Candidate:${response.name}`
    );
    res.status(200).json({ message: "Deleted Successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/vote/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    const candidateId = req.params.candidateId;
    const userId = req.user.id;

    // Find the candidate document with the specified candidateId
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (user.isVoted) {
      return res.status(400).json({ message: "You have already voted." });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin cannot vote." });
    }

    // Updating candidate document to record the vote
    candidate.votes.push({ user: userId });
    candidate.voteCount++;
    await candidate.save();

    // Update user document to mark the user as having voted
    user.isVoted = true;
    await user.save();

    // If everything is successful, send the final response
    return res
      .status(200)
      .json({ message: "Successfully voted and recorded." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/vote/count", async (req, res) => {
  try {
    const candidate = await Candidate.find().sort({ voteCount: "desc" });
    //map the candidates to only return there name and voteCount
    const voteRecord = candidate.map((data) => {
      return {
        party: data.party,
        count: data.voteCount,
        name:data.name
      };
    });
    return res.status(200).json(voteRecord);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "internal Server error" });
  }
});

router.get("/",  async (req, res) => {
  try {
   
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (err) {
    console.error("Error fetching candidates:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
