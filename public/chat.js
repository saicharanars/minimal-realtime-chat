const socket = io("http://localhost:3000");
const api = "http://localhost:4000/";
const msglength = 0;
const storedchatslength = 10;
socket.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("chat", (message) => {
    console.log(message);
    //document.getElementById("messages").innerHTML += message + "<br>";
  });
  socket.on("group", (handleGroup) => {
    console.log(handleGroup);
  });
});

const joinRoom = (room) => {
  socket.emit("join", room);
};

const leaveRoom = (room) => {
  socket.emit("leave", room);
};
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Retrieve messages from local storage
    getGroups();
    activegroups();
    chatheader();
    adduserbutton();
    getuserbutton();
    message();
  } catch (error) {
    console.error("An error occurred:", error);
  }
});
let formData1;
function message() {
  const fileInput = document.getElementById("file-input");
  formData1 = new FormData();

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    // Append the groupid value to the formData1
    formData1.append("image", file);
    console.log(formData1.entries, formData1.keys, formData1.values);

    for (let obj of formData1) {
      console.log(obj);
    }

    return formData1; // Append the file to the FormData
  });
}
//message();

document.getElementById("myForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = localStorage.getItem("token");
  const formData1 = new FormData();
  const fileInput = document.getElementById("file-input");
  for (const file of fileInput.files) {
    formData1.append("image", file);
  }
  const msg = document.getElementById("message").value;

  const groupId = document
    .getElementById("sendmessage")
    .querySelector("span").id;
  // Create a new FormData object
  //console.log(formData1);

  formData1.append("message", msg); // Append the message value to the formData1
  formData1.append("groupid", groupId);
  for (let obj of formData1) {
    console.log(obj);
  }
  try {
    const resp = await axios.post(`${api}message`, formData1, {
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(resp.data, "lghjk>>>>>>>>");
    if (resp.data) {
      if (resp.data.data.imageurl === undefined) {
        console.log("im done");
        try {
          console.log("undef");
          socket.emit("msg2", {
            message: msg,
            group: groupId,
            username: resp.data.username,
            userid: resp.data.data.groupuserId,
            timestamp: resp.data.data.createdAt,
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          console.log("def");
          socket.emit("msg2", {
            message: msg,
            group: groupId,
            username: resp.data.username,
            userid: resp.data.data.groupuserId,
            timestamp: resp.data.data.createdAt,
            image: resp.data.data.imageurl,
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
    fileInput.value = "";
    document.getElementById("message").value = "";
  } catch (error) {
    console.log("Error while sending message:", error);
  }
});


async function creategroup(event) {
  event.preventDefault();
  const token = localStorage.getItem("token");
  const groupname = document.getElementById("groupname").value;

  const groupname1 = {
    groupname: groupname,
  };

  try {
    const resp = await axios.post(`${api}add-group`, groupname1, {
      headers: {
        Authorization: token,
      },
    });
    console.log(resp.data, "add group>>>>");
    socket.emit("group", groupname, resp.data);
  } catch (error) {
    console.log("Error while sending message:", error);
  }
}
async function getGroups() {
  const grouparrayString = localStorage.getItem("group");
  const grouparray = JSON.parse(grouparrayString);
  console.log(grouparray);
  grouparray.forEach((group) => {
    addgroup(group);
  });
}
function addgroup(group, groupname) {
  console.log(group);
  const groupbutton = document.createElement("button");
  groupbutton.className =
    "flex flex-row items-center hover:bg-gray-100 rounded-xl p-2";
  groupbutton.id = group.id;
  const ava = document.createElement("div");
  ava.className =
    "flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full";
  ava.innerText = group.groupname ? group.groupname[0] : groupname[0];
  const text = document.createElement("div");
  text.className = "ml-2 text-sm font-semibold";
  text.innerText = group.groupname ? group.groupname : groupname;
  groupbutton.append(ava);
  groupbutton.append(text);
  const handleClick = (event) => {
    const groupId = event.currentTarget.closest("button").id;
    console.log("Clicked button with groupId:", groupId);
    // Perform your desired action with the groupId
  };

  groupbutton.addEventListener("click", handleClick);
  ava.addEventListener("click", handleClick);
  text.addEventListener("click", handleClick);
  const groupele = document.getElementById("activegroup");
  groupele.append(groupbutton);
}
// Assign event listener to form submit event
document.getElementById("myForm").addEventListener("submit", message);
function activegroups() {
  const buttons = document.querySelectorAll("#activegroup button");
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const groupId = event.target.id;
      // Call your API with the groupId parameter
      const ele = document.getElementById("sendmessage");
      const span = ele.querySelector("span");
      span.id = groupId;

      // You can make an API call here or call a separate function with the groupId as a parameter
      // Example:
      // myAPIFunction(groupId);
      fetchmessages(groupId);
      console.log("Clicked button with groupId:", groupId);
      let current = groupId;
      joinRoom(groupId);
      getchat(groupId);
    });
  });
}
async function fetchmessages(id) {
  try {
    const response = await axios.get(`${api}get-groupchat/${id}`);
    const newmessages = response.data;
    console.log(newmessages);
    console.log(newmessages.groupmessaghes);
    console.log(newmessages.groupmessaghes[0].groupname);
    const messages = newmessages.groupmessaghes[0].chats;
    const groupnameactive = newmessages.groupmessaghes[0].groupname;
    const groupnameid = newmessages.groupmessaghes[0].id;
    changechatheader(groupnameactive, groupnameid);

    if (messages && messages.length > 0) {
      chatui(messages);
    } else {
      nomessages();
    }
  } catch (error) {
    console.error(error);
  }
}
function chatui(chats) {
  const parent = document.getElementById("chatui");

  // Remove existing children
  parent.innerHTML = "";
  if (chats && chats.length > 0) {
    chats.reverse().forEach((chat) => {
      const obj = {
        username: chat.groupuser.username,
        message: chat.message,
        userid: chat.groupuser.id,
      };
      const userid = localStorage.getItem("user");
      let floatleft;
      if (obj.userid === Number(userid)) {
        showmessage(obj, true);
        console.log("left");
      } else {
        showmessage(obj, false);
        console.log("rifght", false);
      }
    });
  } else {
    console.log("no messages");
  }
}
function nomessages() {
  const parent = document.getElementById("chatui");

  // Remove existing children
  parent.innerHTML = "";
  const child = document.createElement("div");
  child.className = "col-start-1 col-end-8 p-3 rounded-lg";
  const innerchild = document.createElement("div");
  innerchild.className = "flex flex-row items-center";
  const avatar = document.createElement("div");
  avatar.className =
    "flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0";
  avatar.innerText = "A";
  const messageouter = document.createElement("div");
  messageouter.className =
    "relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl";
  const messagetext = document.createElement("div");
  messagetext.textContent = "no messages";
  messageouter.appendChild(messagetext);
  innerchild.append(avatar);
  innerchild.append(messageouter);
  child.append(innerchild);

  parent.append(child);
}
function chatheader() {
  const header = document.getElementById("chatheader");
  const innerdiv = document.createElement("div");
  innerdiv.className =
    "flex flex-row  align-content-start items-center justify-center justify-around bg-indigo-400";
  const groupavatar = document.createElement("div");
  groupavatar.className =
    "flex items-center justify-center  h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0";
  groupavatar.innerText = "b";
  const groupouter = document.createElement("div");
  groupouter.className =
    "relative ml-3 text-2xl font-bold text-indigo-700 bg-blue-200 py-2 px-4  rounded-sm";
  const groupname = document.createElement("div");
  groupname.textContent = "click on active conversations";
  groupname.id = "headergroupname";
  const addbutton = document.createElement("button");
  addbutton.id = "addusersingroup";
  addbutton.type = "button";
  addbutton.className =
    "flex justify-self-center align-items-center border rounded-xl focus:outline-none bg-blue-500 hover:bg-blue-600 text-2xl font-bold text-white px-4 py-1 flex-shrink-0";

  addbutton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
</svg>`;
  const usersbutton = document.createElement("button");
  usersbutton.id = "groupuserscheck";
  usersbutton.className =
    "flex justify-self-center align-items-center border rounded-xl focus:outline-none bg-blue-500 hover:bg-blue-600 text-2xl font-bold text-white px-4 py-1 flex-shrink-0";

  usersbutton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
</svg>`;

  groupouter.appendChild(groupname);
  innerdiv.append(groupavatar);
  innerdiv.append(groupouter);
  innerdiv.append(addbutton);
  innerdiv.append(usersbutton);
  //header.append(innerdiv);
  header.insertBefore(innerdiv, header.firstChild);
}
function changechatheader(groupnameactive, id) {
  const header = document.getElementById("headergroupname");
  header.textContent = groupnameactive;
  const adduserbutton = document.getElementById("addusersingroup");
  adduserbutton.setAttribute("data-group-id", id);
  const groupuserscheck = document.getElementById("groupuserscheck");
  groupuserscheck.setAttribute("data-group-id", id);
}
function adduserbutton() {
  document
    .getElementById("addusersingroup")
    .addEventListener("click", async () => {
      createadminui("add");
      createadminui("remove");
      createadminui("admin");
    });
}

async function createadminui(admintype) {
  const group = document.getElementById("addusersingroup");
  const groupid = group.getAttribute("data-group-id");
  console.log(groupid);

  const parent = document.getElementById("chatui");
  parent.className = "grid grid-cols-12 gap-y-2 bg-white ";
  parent.innerHTML = "";

  const child = document.createElement("div");
  child.className = "col-start-1 col-end-8 p-3 rounded-lg";
  const inner = document.createElement("h1");
  inner.className = "text-2xl font-bold";
  inner.textContent = admintype;
  const form = document.createElement("form");
  form.type = "submit";
  form.id = "adduserform";
  form.className =
    "col-start-1 col-end-10 p-3 flex flex-row justify-center justify-items-center content-center items-center place-content-center place-items-center";

  const select = document.createElement("select");
  select.name = "users";
  select.placeholder = "Select a user";
  select.className =
    "w-full cursor-default  bg-grey-500 py-1.5 pl-3 pr-10 text-left  text-2xl ";
  form.append(select);

  // Add options to the select element

  const getusers = await axios.get(`${api}usersnotingroup/${groupid}`);
  console.log(getusers.data.users);
  const usersforselect = getusers.data.users;
  usersforselect.forEach((user) => {
    const option1 = document.createElement("option");
    option1.textContent = user.username;
    option1.id = user.id;

    select.appendChild(option1);
  });
  if (admintype !== "remove") {
    const select2 = document.createElement("select");
    select2.name = "admin type";
    select2.placeholder = "is admin";
    if (admintype === "add") {
      select2.id = "addid";
    } else {
      select2.id = "adminid";
    }
    select2.className =
      "w-full cursor-default  bg-grey-500 py-1.5 pl-3 pr-10 text-left  text-2xl ";

    const option1 = document.createElement("option");
    option1.textContent = "true";
    const option2 = document.createElement("option");
    option2.textContent = "false";
    select2.appendChild(option1);
    select2.appendChild(option2);
    form.append(select2);
  }

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = admintype;
  submit.className =
    "flex items-center  justify-center bg-blue-500 hover:bg-blue-600 rounded-xl text-white px-4 py-1 flex-shrink-0";
  submit.addEventListener("click", async (event) => {
    event.preventDefault();

    const selectedUsername = select.value;
    const selectedUserId = select.options[select.selectedIndex].id;
    console.log(
      "Selected User ID:",
      selectedUserId,
      "Selected Username:",
      selectedUsername,
      "Group ID:",
      groupid
    );
    const add = document.getElementById("addid").value;
    const admin = document.getElementById("adminid").value;
    console.log(add, "options<<<<<", admin);

    // Make API call to upload the selected user ID
    if (admintype === "add") {
      const response = await axios.post(`${api}addmember/${groupid}`, {
        userId: selectedUserId,
        isAdmin: admin,
      });
      console.log(response.data.message);
      responsedata(response.data);
    } else if (admintype === "remove") {
      console.log(selectedUserId, "udfy");
      user = {
        userId: selectedUserId,
      };
      const response = await axios.delete(
        `${api}deleteGroupMember/${groupid}`,
        { data: user }
      );
      console.log(response.data);
      console.log("remove");
      responsedata(response.data);
    } else {
      const response = await axios.post(`${api}makeadmin/${groupid}`, {
        userId: selectedUserId,
        isAdmin: admin,
      });
      console.log(response.data);

      console.log("admin");
      console.log(response.data.message);
      responsedata(response.data);
    }
    function responsedata(data) {
      const child3 = document.createElement("div");
      child3.className = "col-start-1 col-end-8 p-3 rounded-lg";
      const inner3 = document.createElement("h3");
      inner3.className = "text-2xl font-bold";
      inner3.textContent = data.message;
      child3.append(inner3);
      parent.append(child3);
    }

    // Handle the API response as needed
  });

  form.append(submit);

  child.append(inner);
  child.append(form);
  parent.append(child);
}
function getuserbutton() {
  document
    .getElementById("groupuserscheck")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      console.log("gnj");
      checkusers();
    });
}
async function checkusers() {
  const group = document.getElementById("groupuserscheck");
  const groupid = group.getAttribute("data-group-id");
  console.log(groupid);
  const getusers = await axios.get(`${api}getgroupmembers/${groupid}`);
  const usersarray = getusers.data.users[0].groupusers;
  console.log(usersarray);

  const parent = document.getElementById("chatui");
  parent.className = "grid grid-cols-12 gap-y-2 bg-white ";
  parent.innerHTML = ""; // Clear previous content before appending new users.

  usersarray.forEach((user) => {
    const child = document.createElement("div");
    child.className = "col-start-1 col-end-8 p-3 rounded-lg";

    const inner = document.createElement("h1");
    inner.className = "text-2xl font-bold";
    inner.textContent = user.username;

    child.append(inner);
    parent.append(child); // Append the current user's div to the parent div.
  });
}
async function getchat(groupid) {
  console.log(groupid, "getchat");

  socket.on(groupid, (obj) => {
    console.log(obj.data.userid, "obj?????");
    const userid = localStorage.getItem("user");
    console.log(typeof obj.data.userid, typeof userid);
    let floatleft;
    if (obj.data.userid === Number(userid)) {
      showmessage(obj.data, true);
      console.log("left");
    } else {
      showmessage(obj.data);
      console.log("rifght", false);
    }
  });
}
function showmessage(obj, floatleft) {
  console.log(obj, floatleft);
  const timestamp = getCurrentTime();
  //const time2=timestamp.getHours() + ':' + timestamp.getMinutes();
  const child = document.createElement("div");
  child.className = floatleft
    ? "col-start-6 col-end-13 p-3 rounded-lg"
    : "col-start-1 col-end-8 p-3 rounded-lg";
  const innerchild = document.createElement("div");
  innerchild.className = floatleft
    ? "flex items-center justify-start flex-row-reverse"
    : "flex flex-row items-center";
  const avatar = document.createElement("div");
  avatar.className =
    "flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0";
  avatar.innerText = "a";
  const messageouter = document.createElement("div");
  messageouter.className =
    "flex flex-col justify-between items-end relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl";
  const messagetext = document.createElement("div");
  messagetext.className = "self-start";
  const messagetextp = document.createElement("p");

  messagetextp.textContent = obj.message;
  messagetextp.className = "self-start flex text-green-400 bg-white-200";
  messagetext.append(messagetextp);

  const usernametext = document.createElement("div");

  usernametext.className = "flex text-green-400 bg-white-200";
  usernametext.textContent = obj.username;

  if (obj.image) {
    const image = document.createElement("img");
    image.src = obj.image;
    image.className = "w-30 h-30";
    messagetext.append(image);
  }
  //obj.image?messagetext.append(image):image.parentNode.removeChild(image);
  const time = document.createElement("p");

  time.textContent = timestamp;
  time.className = "self-end";
  messagetext.append(time);

  messageouter.appendChild(usernametext);
  messageouter.appendChild(messagetext);
  messageouter.appendChild(time);
  innerchild.append(avatar);
  innerchild.append(messageouter);
  //innerchild.append(username)
  child.append(innerchild);
  const parent = document.getElementById("chatui");
  parent.append(child);
  //msglength = obj.id;
}
function getCurrentTime() {
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // "0" should be converted to "12"

  // Add leading zeros to minutes
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // Construct the time string
  const timeString = hours + ":" + minutes + " " + ampm;

  return timeString;
}

function chooseFile() {
  document.getElementById("file-input").click();
}
