var api= "http://localhost:4000/";


async function user(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const phonenumber= document.getElementById("phonenumber").value;
  
  const obj = {
    username,
    email,
    password,
    phonenumber
  };
  console.log(obj)
  try {
    console.log(obj);
    const res = await axios.post(`${api}signup`, obj);
    console.log(res.data);
    //showexpenseonscreen(res.data.expenses);
  } catch (error) {
    console.log(error);
  }
}