var api= "http://localhost:4000/";


async function userlogin(event) {
  event.preventDefault();
  //const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const obj = {
    email,
    password,
  };
  try {
    const resp = await axios.post(`${api}login`, obj);
    console.log(resp);
    //const groupchat= await axios.get(`${api}get-groupchat`);
    console.log("groupchat");
    
    //const groupmember= await axios.get(`${api}addmember/8`);
    //console.log(groupmember);
    
    if (resp.data.login) {
      localStorage.setItem('token',resp.data.token);
      console.log(localStorage.getItem('token'));
      localStorage.setItem('user',resp.data.data.id);
      localStorage.setItem('group',JSON.stringify(resp.data.data.groups));
      console.log(localStorage.getItem('group'));

      window.location.href = "/get-chat";
    } else {
      console.log("fail");
    }
    
  } catch (error) {
    console.log(error);
  }
}
