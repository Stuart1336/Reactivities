import React, { ChangeEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props{
    activity: Activity | undefined;
    closeForm: () => void;
    createOrEdit: (activity: Activity) => void;
}
export default function ActivityForm({activity: selectedActivity, closeForm, createOrEdit}: Props){

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
        //???? 將input change的值對應到相對應的activity的name當中，
        //ex:title的值改變，activity title變更為input的值
        setActivity({...activity, [name]: value}) 
    }

    return(
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete = 'off'>
                {/* 將value設為activity.title，此時欄位為readonly，因為react無法追蹤input change */}
                <Form.Input placeholder='Title' value={activity.title} name = 'title' onChange={handleInputChange}/> 
                <Form.TextArea placeholder='Description' value={activity.description} name = 'description' onChange={handleInputChange}/>
                <Form.Input placeholder='Category' value={activity.category} name = 'category' onChange={handleInputChange}/>
                <Form.Input placeholder='Date' value={activity.date} name = 'date' onChange={handleInputChange}/>
                <Form.Input placeholder='City' value={activity.city} name = 'city' onChange={handleInputChange}/>
                <Form.Input placeholder='Venue' value={activity.venue} name = 'venue' onChange={handleInputChange}/>
                <Button floated="right" positive type="submit" content='Submit' />
                <Button onClick={closeForm} floated="right" type="button" content='Cancel' />
            </Form>
        </Segment>
    )
}