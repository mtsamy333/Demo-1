import * as React from 'react';
import { useState,useEffect } from 'react';
import { sp } from "@pnp/sp/presets/all";
import { DetailsList, IColumn } from '@fluentui/react/lib/DetailsList';
import { IconButton } from '@fluentui/react/lib/Button';
import * as moment from "moment"

interface IDatas {
    Title: string;
    age: number;
    Id: number;
    gender: string;
    Email:string;
    EmailId:number;
    DOB:string;
}

/*testing   */

const List = (props:any):JSX.Element =>{

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
            <IconButton iconProps={{ iconName:'Edit'}} title="delete" ariaLabel="delete" onClick={()=>{props.setEdit({authendication:true,id:item.Id})}}/>
        )
    },
    // test
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

    const [mData, setMData] = useState<IDatas[]>([]);

    const errorfunction = (error: any): void =>{
        console.log(error);
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
        getData();
    },[])

    return(
        <div>
            <DetailsList items={mData} columns={cols} />
           
        </div>
    )
}

export default List;