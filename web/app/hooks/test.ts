import { useEffect, useState } from "react"
export const useTest=()=>{
    const [temp,setTemp] = useState(0)
    useEffect(()=>{
        console.log(temp)
    },[temp])
    return  {setTemp}
}