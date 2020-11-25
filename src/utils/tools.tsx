import * as React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
let defaultProps = {
    settings:{
        maxLength:6,
        placeholder:'请输入待办事项'
    }
}
export type DefaultProps = typeof defaultProps;

export const withDefaultInputProps = <Props extends DefaultProps>(OldComponent:React.ComponentType<Props>)=>{
    type OwnProps = Omit<Props,keyof DefaultProps>;//把Props里面的属于DefaultProps key里的属性给忽略掉
    class NewComponent extends React.Component<OwnProps>{
        render(){
            let props = {...defaultProps,...this.props} as Props;
            return <OldComponent {...props}/>
        }
    }
    return hoistNonReactStatics(NewComponent,OldComponent);
}

/**
 * DefaultProps 默认属性 settings
 * Props settings + 别的属性
 * OwnProps Props-DefaultProps=别的属性
 */
