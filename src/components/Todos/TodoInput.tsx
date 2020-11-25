import * as React from 'react';
import {Todo} from '@/models';
import {DefaultProps,withDefaultInputProps} from '@/utils/tools';
//代表组件的属性
interface OwnProps{
    addTodo:(todo:Todo)=>void
}
//Props是OwnProps和DefaultProps的联合类型
type Props = OwnProps&DefaultProps;
//代表组件的状态
interface State{
    text:string
}
let id=1;
class TodoInput extends React.Component<Props,State>{
    static myName = 'TodoInput';
    state = {text:''}
    constructor(props:Props){
        super(props);
    }
    handleChange = (event:React.ChangeEvent<HTMLInputElement>)=>{
        this.setState({text:event.target.value});
    }
    handleSubmit = (event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        let text = this.state.text.trim();
        if(!text) return;
        this.props.addTodo({id:id++,text});
        this.setState({text:''});
    }
    render(){
        let {text} = this.state;
        let {settings} = this.props;
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text" 
                    maxLength={settings.maxLength}
                    placeholder={settings.placeholder}
                    onChange={this.handleChange} 
                    value={text}/>
                <button type="submit">添加</button>
            </form>
        )
    }
}
export default withDefaultInputProps<Props>(TodoInput);