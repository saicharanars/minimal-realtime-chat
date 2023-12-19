const Group = require("../models/groups");
const User = require("../models/user");
const Chat = require("../models/chat");
const GroupMember = require("../models/groupmember");
const Sequelize = require("sequelize");

const { Op, literal } = require("sequelize");

exports.postGroup = async (req, res, next) => {
  try {
    //const { name, email, phone } = req.body;

    const userId = req.user.id;
    const groupName = req.body.groupname;
    console.log(userId);
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    console.log(user);
    const group = await Group.create({
      groupname: groupName,
      //groupuserId: userId,
      owner: userId,
    });
    console.log(group, "group>>>>>>");
    const result = await user.addGroup(group);

    res.status(200).json({ message: "success", data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
};
exports.getGroups = async (req, res, next) => {
  try {
    console.log(req.body);
    const groups = await User.findAll({
      where: {
        id: req.user.id,
      },
      include: Group,
    });
    console.log(">>>>>>>", groups, ">>>>>");
    res.status(200).json({ message: "foundgroups", data: groups });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
};
exports.getGroupChat = async (req, res, next) => {
  try {
    groupid = req.params.id;
    // msg = "hello how are you are you there iam fine fguy";
    // const user = await User.findOne({
    //   where: {
    //     id: 6,
    //   },
    // });
    // const chat = await Chat.create({
    //   message: msg,
    //   groupId: 8,
    //   groupuserId: 6,
    // });
    const groupchat = await Group.findAll({
      where: {
        id: groupid,
      },
      include: [
        {
          model: Chat,
          attributes: ["message", "updatedAt"],
          include: [
            {
              model: User,
              attributes: ["username","id"],
            },
          ],
          order: [["createdAt", "DESC"]],
          limit: 10,
        },
      ],
      attributes: ["id", "groupname"],
    });

    //console.log(user, "user>>>>>", chat, "chat>>>>", groupchat, "group>>>>");
    res.status(200).json({ groupmessaghes: groupchat });
  } catch (error) {
    console.log(error);
  }
};
exports.getgroupmembers = async (req, res, next) => {
  try {
    const groupid = req.params.id;
    const group = await Group.findAll({
      where: {
        id: groupid,
      },
      include: {
        model: User,
        attributes: ["id", "username"],
      },
    });

    //const addmember=group.addUser(user);
    //console.log(group,"group>>>>>",user,"user>>>>>",addmember,"addmember>>>");
    res.status(200).json({ users: group });
  } catch (error) {
    console.log(error);
    res.status(401).json("request failed");
  }
};
exports.addGroupmember = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.body.userId;
    const isAdmin = req.body.isAdmin;
    console.log(groupId, userId);
    const check = await GroupMember.findOne({
      where: {
        groupId: groupId,
        groupuserId: userId,
      },
    });
    //console.log(check)
    if (check) {
      console.log("already present");
      return res
        .status(404)
        .json({ message: "user exists in group", data: check });
    } else {
      const add = await GroupMember.create({
        groupId: groupId,
        groupuserId: userId,
        isAdmin: isAdmin,
      });
      console.log(add);
      // Return success response
      return res
        .status(200)
        .json({ message: "User added to the group successfully", data: add });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteGroupMember = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.body.userId;
    console.log(userId, "userrr", req.body);
    // Find the group member to delete
    const groupMember = await GroupMember.findOne({
      where: {
        groupId: groupId,
        groupuserId: userId,
      },
    });

    if (!groupMember) {
      return res.status(404).json({ message: "Group member not found" });
    }

    // Delete the group member
    const deleted = await groupMember.destroy();

    // Return success response
    return res
      .status(200)
      .json({ message: "Group member deleted successfully", data: deleted });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUsersNotInGroup = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;

    // Find users not in the specified group
    const usersNotInGroup = await User.findAll({
      attributes: ["id", "username"],
    });

    res.status(200).json({ users: usersNotInGroup });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.makeAdmin = async (req, res, next) => {
    try {
      const groupId = req.params.groupId;
      const userId = req.body.userId;
      const isAdmin = req.body.isAdmin;
  
      // Find the group member in the specified group
      const groupMember = await GroupMember.findOne({
        where: {
          groupId: groupId,
          groupuserId: userId,
        },
      });
  
      if (!groupMember) {
        return res.status(404).json({ message: "Group member not found" });
      }
  
      if (isAdmin === "true") {
        if (!groupMember.isAdmin) {
          // Update the user's admin status to true and retrieve the updated data
          const updatedGroupMember = await GroupMember.update(
            { isAdmin: true },
            {
              where: {
                groupId: groupId,
                groupuserId: userId,
              },
              returning: true,
              attributes:["isAdmin","groupuserId"],
            },
            
            
          );
  
          res.status(200).json({ message: "User is now an admin", data: updatedGroupMember });
        } else {
          res.status(400).json({ message: "User is already an admin" });
        }
      } else if (isAdmin === "false") {
        if (groupMember.isAdmin) {
          // Update the user's admin status to false and retrieve the updated data
          const updatedGroupMember = await GroupMember.update(
            { isAdmin: false },
            {
              where: {
                groupId: groupId,
                groupuserId: userId,
              },
              returning: true,
              attributes:["isAdmin","groupuserId"],
            }
          );
  
          res.status(200).json({ message: "Admin privileges removed", data: updatedGroupMember });
        } else {
          res.status(400).json({ message: "User is not an admin" });
        }
      } else {
        res.status(400).json({ message: "Invalid value for isAdmin" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
