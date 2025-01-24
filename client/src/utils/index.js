import axios from 'axios';

const API_URL =  'https://demojobportal.onrender.com/api-v1';
// const API_URL =  'http://localhost:8800/api-v1';
export const API = axios.create({
    baseURL: API_URL,
    responseType: 'json',
});

export const apiRequest = async ({ url, token, data, method }) => {
    try {
        const result = await API(url, {
            method: method || "GET",
            data: data,
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
            }
        });
        // console.log(result)
        return result?.data

    } catch (error) {
        const err = error.response.data;
        console.log(err);
        alert(err.message)
        return { status: err.success, message: err.message }
    }
};

export const handleFileUpload = async(uploadFile) =>{
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append("upload_preset", "job-app");
 
    try {
        const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dtnxoaxcp/image/upload/ ",
            formData
        )
        return response.data.secure.url
    } catch (error) {
        
    }

    // return await axiosInstance.post('/upload', formData, {
    //     headers: {
    //         'Content-Type': 'multipart/form-data'
    //     }
    // });
}

export const updateURL = ({
    pageNum,
    query,
    cmpLoc,
    sort,
    navigate,
    location,
    // jtype,
    exp
}) => {

    const params = new URLSearchParams();

    if(pageNum && pageNum > 1){
        params.set("page", pageNum);
    }       

    if(query){
        params.set("query", query);
    }

    if(cmpLoc){
        params.set("cmpLoc", cmpLoc);
    }

    if(sort){
        params.set("sort", sort);
    }
    if(navigate){
        params.set("navigate", navigate);
    }
    
    // if(jtype){
    //     params.set("jtype", jtype);
    // }

    if(exp){
        params.set("exp", exp);
    }
    
    const Newurl = `${location.pathname}?${params.toString()}`;
    // navigate(Newurl, { replace: true });
    // consoel.log(Newurl)
    return Newurl
};
   