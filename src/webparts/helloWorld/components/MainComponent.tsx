import * as React from 'react';
import FirstReact from './FirstReact';
export default function MainComponent(props:any):JSX.Element
{
    return (<div>
        <FirstReact context={props.context}/>
        
    </div>)
}