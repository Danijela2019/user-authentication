const sendUserDataToServer = async (event, input1Id, input2Id, path) => {
    event.preventDefault();
    const userName=(document.getElementById(input1Id)) ? document.getElementById(input1Id).value : null;
    const password = document.getElementById(input2Id).value;
    const options = {
        method: 'POST',
        headers:{
        'Content-Type': 'application/json'
        },
        body : userName ?
            JSON.stringify({userName, password}): 
            JSON.stringify({
                newPassword : password,
                token:localStorage.getItem("token")})
    }
    const resault = await fetch(path,options)
        .then((res)=> res.json())
        .catch((err)=> console.log('Error',err))
        handleResponseData(resault,path);
    }  
    
const handleResponseData= (data,path) => {
    if(data.error){
        console.log('There is an error',data.error)
    }
    if(data.status === 'ok') {
         switch(path) {
            case ("/api/register"):
                console.log(data.message)
            break;
            case ("/api/login"):
                localStorage.setItem("token", data.data);
                console.log(data.message)
            break;
            case ('/api/change-password'):
                console.log(data.message)
                break;
            default:
                console.log('Somethin went wrong,check the url path');
            }
    } 
}
       
const clearForm = (event,formId) => {
    event.preventDefault();
    document.getElementById(formId).reset()
};



