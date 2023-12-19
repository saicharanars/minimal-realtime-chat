const express = require('express');

const groupController = require('../controllers/group');

const auth=require('../middleware/auth')



const router = express.Router();
router.post("/add-group",auth.authenticate,groupController.postGroup);
router.get("/get-groups",auth.authenticate,groupController.getGroups)
router.get("/get-groupchat/:id",groupController.getGroupChat);
router.get("/getgroupmembers/:id",groupController.getgroupmembers);
router.get("/usersnotingroup/:groupId",groupController.getUsersNotInGroup);
router.post("/addmember/:groupId",groupController.addGroupmember);
router.delete("/deleteGroupMember/:groupId",groupController.deleteGroupMember);
router.post("/makeadmin/:groupId",groupController.makeAdmin);


module.exports = router;