import * as React from 'react';
import { useState,useEffect } from 'react';
import { sp } from "@pnp/sp/presets/all";
import { TextField } from '@fluentui/react/lib/TextField';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react/lib/ChoiceGroup';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { DateTimePicker, DateConvention, TimeConvention } from '@pnp/spfx-controls-react/lib/DateTimePicker';
import * as moment from "moment"

interface IInputs{
    name:string;
    age:number;
    gender:string;
    Email:string;
    EmailId:number;
    DOB:string;
}

export default function FirstReact(props:any): JSX.Element {

    const [choices, setChoices] = useState<IChoiceGroupOption[]>([])
    const [value, setValue] = useState<IInputs>({
        name: '',
        age: null,
        gender: 'male',
        Email:'',
        EmailId:null,
        DOB:new Date().toISOString()
    })
    
    
    const inputHandle = (e:any): void => {
        if (e.target.name == 'name') {
            setValue({ ...value, name: e.target.value })
        } else if (e.target.name == 'age') {
            setValue({ ...value, age: e.target.value })
        }
    }

    const inputChoice = (e:any, options: IChoiceGroupOption) => {
        setValue({ ...value, gender: options.key })
    }

    const  getPeoplePickerItems = (items: any[]) =>{

        setValue({...value,EmailId:items[0].id,Email:items[0].secondaryText})
    }
    
    const handleChange=(date:any)=>{
        setValue({...value,DOB:date.toISOString()})
    }

    const errorfunction = (error: any): void =>{
        console.log(error);
    }

    const getChoice = async () => {
       await sp.web.lists.getByTitle("Practice").fields.getByTitle("gender").get().then(function (data: any) {        
            const choiceData: IChoiceGroupOption[] = []
            data.Choices.forEach((value: string) => {
                choiceData.push({ key: value, text: value })
            })
            setChoices(choiceData)
           
        }).catch(function (error) {
            errorfunction(error)
        })
    }

    const getData = async () =>{
        await sp.web.lists.getByTitle("Practice").items.getById(props.edit.id).select("*,Title,age,gender,Id,EmailId,Email/EMail").expand('Email').get()
        .then((item:any) =>{
            
            setValue({
                name: item.Title ? item.Title : '',
                age: item.age ? item.age : null,
                gender: item.gender ? item.gender : '',
                Email:item.Email.EMail ? item.Email.EMail:'',
                EmailId:item.EmailId ? item.EmailId:null,
                DOB:item.DOB ? moment(item.DOB).format('DD/MM/YYYY'):''
            })
        })
    
    }

    const addData = async () => {
        await sp.web.lists.getByTitle("Practice").items.add({
            Title: value.name,
            age: value.age,
            gender: value.gender,
            EmailId:value.EmailId,
            DOB:value.DOB
        }).then((data:any) => {
            setValue({
                name: '',
                age: null,
                gender: 'male',
                Email:'',
                EmailId:null,
                DOB:new Date().toISOString()
            })

        }).catch((error) => {
            errorfunction(error)
        })
    }

    const updateVal = async () =>{
        await sp.web.lists.getByTitle("Practice").items.getById(props.edit.id).update({
            Title:value.name,
            age:value.age,
            gender:value.gender,
            EmailId:value.EmailId,
            DOB:new Date(value.DOB).toISOString
        }).then((data:any)=>{
            setValue({
                name: '',
                age: null,
                gender: 'male',
                Email:'',
                EmailId:null,
                DOB:new Date().toISOString()
            })

            props.setEdit({...props.edit,authendication:false})
        }).catch((error)=>{
            errorfunction(error)
        })   
    }

    useEffect(function () {
        getChoice();
    },[])

    useEffect(()=>{
        if(props.edit.authendication){
            getData()
        }
        else{
            setValue({
                name: '',
                age: null,
                gender: 'male',
                Email:'',
                EmailId:null,
                DOB:new Date().toString()
            })
        }
    },[props.edit.authendication])

    
    return (

        <div>
            
            <div>
                <TextField label='Name' name='name' value={value.name} onChange={(e) => inputHandle(e)} />
                <TextField label='Age'  name='age' value={value.age==null?'':value.age.toString()} onChange={(e) => inputHandle(e)} />
                <ChoiceGroup options={choices} label='Gender' selectedKey={value.gender}onChange={(e, options) => inputChoice(e, options)} />
                <PeoplePicker
                    context={props.context}
                    ensureUser={true}
                    titleText="People Picker"
                    personSelectionLimit={3}
                    defaultSelectedUsers={[value.Email]}
                    //groupName={""} // Leave this blank in case you want to filter from all users
                    showtooltip={true}
                    required={true}
                    disabled={false}
                    onChange={getPeoplePickerItems}
                    showHiddenInUI={false}
                    principalTypes={[PrincipalType.User]}
                    resolveDelay={1000} />
                <DateTimePicker 
                    label="DateTime Picker - 12h"
                    dateConvention={DateConvention.DateTime}
                    timeConvention={TimeConvention.Hours12} 
                    value={new Date(value.DOB)}
                    onChange={handleChange} />
                {props.edit.authendication ? <DefaultButton text='Update' onClick={() => updateVal()} /> :  <DefaultButton text='Add' onClick={() => addData()} />}
            </div>
        </div>
    )
}