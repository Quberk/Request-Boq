import express from "express";
import { Login, Logout, Register, createUser, 
        deleteUser, 
        getUsers, 
        getUsersById, 
        updateUser
} from "../controllers/UserController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { createRequest, deleteRequest, getMaterialById, getRequestById, getRequests, updateRequest } from "../controllers/RequestController.js";
import { ApproveRequest, RejectRequest } from "../controllers/RequestConfirmationController.js";

const router = express.Router();

//Users
router.get('/users', verifyToken, getUsers); //Route tidak dapat diakses jika belum Login
router.get('/users/:id', getUsersById);
router.post('/users', createUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

//Request BOQ
router.get('/request', getRequests);
router.get('/request/:id', getRequestById);
router.post('/request', createRequest);
router.patch('/request/:id', updateRequest);
router.delete('/request/:id', deleteRequest);

//Materials
router.get('/material/:id', getMaterialById);

//Login Auth
router.post('/register', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

// Approve or Reject Request
router.put('/approveRequest/:id', ApproveRequest);
router.put('/rejectRequest/:id', RejectRequest);


export default router;