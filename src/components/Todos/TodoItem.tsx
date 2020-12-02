import * as React from 'react';
import { TodoItem as ITodoItem } from '@/models';
const todoItemStyle: React.CSSProperties = {
    backgroundColor: 'green',
    color: 'red',
}
interface Props {
    todo: ITodoItem
}
const TodoItem: React.FC<Props> = (props: Props) => {
    return (
        <li style={todoItemStyle}>{props.todo.text}</li>
    )
}
export default TodoItem;