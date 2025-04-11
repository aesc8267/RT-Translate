import type { Route } from "./+types/home";
import {Main} from '~/components/MicButton'
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}
export default function Home() {
  return(
    <div>
      {/* <Welcome/> */}
      {/* <App/> */}
      {/*<MicPhone/>*/}
      <Main/>
    </div>
  )
}
