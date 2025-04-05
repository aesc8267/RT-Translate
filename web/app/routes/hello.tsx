import { Outlet } from "react-router";

export default function hello(){
    return (
        <div>
            <h1>Hello world</h1>
            <Outlet/>
        </div>
    )
}