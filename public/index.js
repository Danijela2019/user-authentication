const registerUser = async (event) => {
    event.preventDefault();
    const userName= document.getElementById("login-input-name").value;
    const password = document.getElementById("login-input-password").value;
    const options = {
        method: 'POST',
        headers:{
        'Content-Type': 'application/json'
        },
        body : JSON.stringify({userName, password})
    }
    const resault = await fetch('/api/register',options)
    .then((res)=> res.json())
    .then((data) => { if(data.error)console.log('Data.error',data.error)})
    .catch((err)=> console.log('Error',err))
}

const clearForm = (event) => {
    event.preventDefault();
    document.getElementById("login-form").reset()
};
//////////////////////////////////////////////////////////////////////////
const clearForm1 = (event) => {
    event.preventDefault();
    document.getElementById("login-form1").reset()
};

const loginUser = async (event) => {
    event.preventDefault();
    const userName= document.getElementById("login-input-name1").value;
    const password = document.getElementById("login-input-password1").value;
    const options = {
        method: 'POST',
        headers:{
        'Content-Type': 'application/json'
        },
        body : JSON.stringify({userName, password})
    }
    const resault = await fetch('/api/login',options)
    .then((res)=> res.json())
    if(resault.status === "ok"){
        console.log('The token is', resault.data)

    }else {
        console.log('Resault.error', resault.error)
    }
}

