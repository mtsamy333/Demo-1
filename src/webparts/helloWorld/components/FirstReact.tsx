import * as React from 'react';
import { useState,useEffect } from 'react';
import { Carousel } from "@pnp/spfx-controls-react/lib/Carousel";
import { sp } from "@pnp/sp/presets/all";
import { DetailsList, IColumn } from '@fluentui/react/lib/DetailsList';
import { TextField } from '@fluentui/react/lib/TextField';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react/lib/ChoiceGroup';
import { DatePicker, IPersonaProps } from '@fluentui/react';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { DateTimePicker, DateConvention, TimeConvention } from '@pnp/spfx-controls-react/lib/DateTimePicker';
import { IconButton } from '@fluentui/react/lib/Button';
import * as moment from "moment"
/*gkgkjgkjkjgkjgkj*/
interface IDatas {
    Title: string;
    age: number;
    Id: number;
    gender: string;
    Email:string;
    EmailId:number;
    DOB:string;
}

interface IInputs{
    name:string;
    age:number;
    gender:string;
    Email:string;
    EmailId:number;
    DOB:string;
}

interface IEdit{
    editAuthendication:boolean;
    data:IDatas
}

export default function FirstReact(props:any): JSX.Element {

    const cols: IColumn[] = [{
        key: '1',
        fieldName: 'Title',
        name: 'Name',
        minWidth: 200
    }, 
    {
        key: '2',
        fieldName: 'age',
        name: 'Age',
        minWidth: 200
    }, 
    {
        key: '3',
        fieldName: 'Id',
        name: 'Id',
        minWidth: 200
    },
    {
        key: '4',
        fieldName: 'gender',
        name: 'Gender',
        minWidth: 200
    }, 
    {
        key: '5',
        fieldName: 'Delete',
        name: 'Delete',
        minWidth: 200,
        onRender: (item, index) => (
            <IconButton iconProps={{iconName:'delete'}} title="delete" ariaLabel="delete" onClick={()=>{deleteVal(item.Id, index)}}/>
        )
    },
    {
        key: '6',
        fieldName: 'edit',
        name: 'Edit',
        minWidth: 200,
        onRender: (item) => (
            <IconButton iconProps={{ iconName:'Edit'}} title="delete" ariaLabel="delete" onClick={()=>{editVal(item)}}/>
        )
    },
    {
        key: '7',
        fieldName: 'Email',
        name: 'Email',
        minWidth: 200
    },
    {
        key: '8',
        fieldName: 'DOB',
        name: 'Dob',
        minWidth: 200
    }]

    const [choices, setChoices] = useState<IChoiceGroupOption[]>([])
    const [mData, setMData] = useState<IDatas[]>([]);
    const [value, setValue] = useState<IInputs>({
        name: '',
        age: null,
        gender: 'male',
        Email:'',
        EmailId:null,
        DOB:new Date().toISOString()
    })
    const [edit,setEdit] = useState<IEdit>({
        editAuthendication:false,
        data:{
            Title: '',
            age: null,
            Id: null,
            gender: "",
            Email:'',
            EmailId:null,
            DOB:new Date().toISOString()
        }
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
            getData()
        }).catch(function (error) {
            errorfunction(error)
        })
    }

    async function getData() {
        await sp.web.lists.getByTitle("Practice").items.select("*,Title,age,gender,Id,EmailId,Email/EMail").expand('Email').get()
        .then(function (data: any) {
            var masterData: IDatas[] = [];
            data.forEach((item: any) => {                
                masterData.push(
                    {
                        Title: item.Title ? item.Title : '',
                        age: item.age ? item.age : null,
                        Id: item.ID ? item.ID : null,
                        gender: item.gender ? item.gender : '',
                        Email:item.Email.EMail ? item.Email.EMail:'',
                        EmailId:item.EmailId ? item.EmailId:null,
                        DOB:item.DOB ? moment(item.DOB).format('DD/MM/YYYY'):''
                    }
                )
            })
            setMData(masterData)
        })
        .catch(function (error) {
            errorfunction(error)
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
            var addval:IDatas={
                Title: data.data.Title ? data.data.Title : '',
                age: data.data.age ? data.data.age : null,
                Id: data.data.ID ? data.data.ID : null,
                gender: data.data.gender ? data.data.gender : '',
                Email:value.Email,
                EmailId:data.data.EmailId ? data.data.EmailId:null,
                DOB:data.data.DOB ? moment(data.data.DOB).format('DD/MM/YYYY'):''
            }
            setMData([...mData,addval])
            setValue({
                name: '',
                age: null,
                gender: 'male',
                Email:'',
                EmailId:null,
                DOB:new Date().toString()
            })

        }).catch((error) => {
            errorfunction(error)
        })
    }

    const editVal=(item:IDatas)=>{
        setEdit({
            editAuthendication:true,
            data:{
                Title: item.Title,
                age: item.age,
                Id: item.Id,
                gender: item.gender,
                Email:item.Email,
                EmailId:item.EmailId,
                DOB:item.DOB
           }
        })        
    }
    
    const updateVal = async () =>{
        await sp.web.lists.getByTitle("Practice").items.getById(edit.data.Id).update({
            Title:value.name,
            age:value.age,
            gender:value.gender,
            EmailId:value.EmailId,
            DOB:value.DOB
        }).then((data:any)=>{
            var index = mData.map(x=>x.Id).indexOf(edit.data.Id);
            var updatedData:IDatas[] = [...mData];
            updatedData[index]={
                ...updatedData[index],
                Title:value.name,
                age:value.age,
                gender:value.gender,
                Email:value.Email,
                EmailId:value.EmailId,
                DOB:moment(value.DOB).format('DD/MM/YYYY')
            }

            setMData(updatedData)            
            setEdit({...edit,editAuthendication:false})

        }).catch((error)=>{
            errorfunction(error)
        })   
    }

    const deleteVal = async(id: number, index: number) => {
        await sp.web.lists.getByTitle("Practice").items.getById(id).delete().then((data)=>{
            let deletedData = [...mData];
            deletedData.splice(index,1);
            setMData(deletedData)
        }).catch((error)=>{
            errorfunction(error)
        })
    }
    
    useEffect(function () {
        getChoice();
    },[])

    useEffect(function () {
        if(edit.editAuthendication){
            setValue({
                name: edit.data.Title,
                age: edit.data.age,
                gender: edit.data.gender,
                Email:edit.data.Email,
                EmailId:edit.data.EmailId,
                DOB:edit.data.DOB
            })
        }
        else{
            setValue({
                name: '',
                age: null,
                gender: 'male',
                Email:'',
                EmailId:null,
                DOB:new Date().toISOString()
            })
        }
    },[edit])

    return (

        <div>
            <DetailsList items={mData} columns={cols} />
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
                {edit.editAuthendication ? <DefaultButton text='Update' onClick={() => updateVal()} /> :  <DefaultButton text='Add' onClick={() => addData()} />}
            </div>
        </div>
    )
}