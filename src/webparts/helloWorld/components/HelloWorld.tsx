import * as React from 'react';
import styles from './HelloWorld.module.scss';
import { IHelloWorldProps } from './IHelloWorldProps';
import { escape } from '@microsoft/sp-lodash-subset';
import MainComponent from './MainComponent';
import {sp} from "@pnp/sp/presets/all";
export default class HelloWorld extends React.Component<IHelloWorldProps, {}> 
{
  
  public constructor(prop: IHelloWorldProps, state: {}) {

    super(prop);

    sp.setup({

      spfxContext: this.props.context,

    });
  }
  
  public render(): React.ReactElement<IHelloWorldProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
     <div>
      <MainComponent context={this.props.context}/>
     </div>
    );
  }
}
