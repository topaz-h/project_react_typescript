import * as React from 'react';
import {Todo} from '@/models';
const todoItemStyle:React.CSSProperties = {
    backgroundColor:'green',
    color:'red',
}
interface Props{
    todo:Todo
}
const TodoItem:React.FC<Props> = (props:Props)=>{
    return (
        <li style={todoItemStyle}>{props.todo.text}</li>
    )
}
export default TodoItem;