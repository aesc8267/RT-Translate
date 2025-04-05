import type {Route} from "./+types/say";
import { addMessage} from "~/api/test-service";
import {message,Button, Input} from "antd";
import {Form} from 'react-router'
export async function clientAction({request}: Route.ClientActionArgs) {
    // console.log('action',request)
    let formdata = await request.formData();
    let user = formdata.get("user")
    let msg = formdata.get("message")
    let result=await addMessage({"user": user as string , "message": msg as string})
    message.success("success")
}

export default function () {
    return (
        <div>
            <h1>
                add message
            </h1>
            <Form method={"post"} >
                <Input name="user" placeholder="user"/>
                <Input name="message" placeholder="message"/>
                <Button type="primary" htmlType="submit" className="mt-2">
                    submit
                </Button>
            </Form>
        </div>
    )
}