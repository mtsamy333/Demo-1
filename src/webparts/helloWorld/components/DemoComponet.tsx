import * as React from 'react';
import { Items, sp } from "@pnp/sp/presets/all";
import { DetailsList,IColumn, TextField } from '@fluentui/react';

interface IDatas{
    Title:String;
    Age:number;
    gender:string;
    Email:string;
    EmailId:number;
}

export const DemoComponent=()=>{
    const cols:Partial<IColumn[]>=[{
        key:'1',
        fieldName:'Title',
        name:'Name',
        minWidth:200
    },{
        key:'2',
        fieldName:'Age',
        name:'Age',
        minWidth:200
    },{
        key:'3',
        fieldName:'gender',
        name:'Gender',
        minWidth:200
    },{
        key:'4',
        fieldName:'Email',
        name:'Email',
        minWidth:200
    }]
    const [MData,setData]=React.useState<any>([])
    console.log("data",MData);
    
    const errorFunction=(error:any)=>{
        console.log("error",error); 
    }
    async function getData(){
        await sp.web.lists.getByTitle("Demo").items.select('Title,Age,Gender,EmailId,Email/EMail').expand('Email').get().then((data)=>{
            console.log("get data",data);
            var masterData=[]
            data.forEach((item)=>{
                masterData.push({
                    Title:item.Title,
                    Age:item.Age,
                    Gender:item.Gender,
                    Email:item.Email,
                    EmailId:item.EmailId
                })
            })
            setData(masterData)
        }).catch((error)=>{
            errorFunction(error)
        })
    }
    React.useEffect(()=>{
        getData()
    },[])
return(
    <div>
        {/* <DetailsList items={MData} columns={cols}/> */}
        <TextField label=''/>
    </div>
)
}