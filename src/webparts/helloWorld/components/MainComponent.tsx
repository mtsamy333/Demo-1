import * as React from 'react';
import { useState } from 'react';
import FirstReact from './FirstReact';
import { DefaultButton } from '@fluentui/react/lib/Button';
import List from './list';

interface IEdit{
    authendication:boolean;
    id:number
}

export default function MainComponent(props:any):JSX.Element{

    const [flag,setFlag]=useState(false)
    
    const [edit,setEdit]=useState<IEdit>({
        authendication:false,
        id:null
    })

    return(
        <div>
            <DefaultButton text={flag ? 'List':'Form'} onClick={()=>setFlag(!flag)} />
            {
                flag ? <FirstReact context={props.context} edit={edit} setEdit={setEdit}/> : <List edit={edit} setEdit={setEdit}/>
            }
        </div>
    )
}

