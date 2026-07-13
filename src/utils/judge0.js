import axios from "axios";
const submitBatch=async (submissions)=>
{  try{
  const response=await axios.post(`${process.env.JUDGE0_URL}/submissions/batch`,{
    
     submissions,
    
  });


return response.data;}
catch(error)
{
  throw error;
}
} 

const getBatchResult = async (tokens) => {
  try {
   
    const response = await axios.get(
      `${process.env.JUDGE0_URL}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          fields: "token,status,time,memory,stdout,stderr,compile_output",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export {submitBatch,getBatchResult};