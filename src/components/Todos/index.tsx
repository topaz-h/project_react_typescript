import * as React from 'react';
import { TodoItem as ITodoItem } from '@/models';
import TodoInput from './TodoInput';
import TodoItem from './TodoItem';
import { connect } from 'react-redux';
import { CombinedState, TodoState } from '@/store/reducers';
import * as actions from '@/store/actions/todo';
import { RouteComponentProps } from 'react-router-dom';
import { StaticContext } from 'react-router';

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof actions;
interface Params { }
interface LocationState { }
type RouteProps = RouteComponentProps<Params, StaticContext, LocationState>
type Props = StateProps & DispatchProps & RouteProps;
interface State { }
const ulStyle = {
    width: '100px'
}

class Todo extends React.Component<Props, State>{
    render() {
        let { todo, addTodo } = this.props;
        return (
            <div>
                <TodoInput addTodo={addTodo} />
                <ul style={ulStyle}>
                    {
                        todo.map((item: ITodoItem, index: number) => <TodoItem key={index} todo={item} />)
                    }
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state: CombinedState): TodoState => {
    return state.todo;
}
export default connect(
    mapStateToProps, actions
)(Todo);