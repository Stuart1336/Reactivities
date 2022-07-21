import React, { ChangeEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props{
    activity: Activity | undefined;
    closeForm: () => void;
    createOrEdit: (activity: Activity) => void;
    submitting:boolean;
}
export default function ActivityForm({activity: selectedActivity, closeForm, createOrEdit, submitting}: Props){

    const initialState = selectedActivity ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    }

    const [activity, setActivity] = useState(initialState);

    function handleSubmit(){
        createOrEdit(activity);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
        const {name, value} = event.target;
        //以{...activity}將activity拆解成其屬性
        //event.target.name代表activity的屬性，利用event.target來偵測哪一個input發生InputChange事件
        //並把使用者輸入的值帶入input中
        setActivity({...activity, [name]: value}) 
    }

    return(
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete = 'off'>
                {/* 將value設為activity.title，此時欄位為readonly，因為react無法追蹤input change */}
                <Form.Input placeholder='Title' value={activity.title} name = 'title' onChange={handleInputChange}/> 
                <Form.TextArea placeholder='Description' value={activity.description} name = 'description' onChange={handleInputChange}/>
                <Form.Input placeholder='Category' value={activity.category} name = 'category' onChange={handleInputChange}/>
                <Form.Input placeholder='Date' type="date" value={activity.date} name = 'date' onChange={handleInputChange}/>
                <Form.Input placeholder='City' value={activity.city} name = 'city' onChange={handleInputChange}/>
                <Form.Input placeholder='Venue' value={activity.venue} name = 'venue' onChange={handleInputChange}/>
                <Button loading={submitting} floated="right" positive type="submit" content='Submit' />
                <Button onClick={closeForm} floated="right" type="button" content='Cancel' />
            </Form>
        </Segment>
    )
}