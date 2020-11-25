import * as React from 'react';
import {Todo} from '@/models';
import TodoInput from './TodoInput';
import TodoItem from './TodoItem';
import {connect} from 'react-redux';
import {CombinedState,TodosState} from '@/store/reducers';
import * as actions from '@/store/actions/todos';
import {RouteComponentProps} from 'react-router-dom';
import {StaticContext} from 'react-router';
type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof actions;
interface Params{}
interface LocationState{}
type RouteProps = RouteComponentProps<Params,StaticContext,LocationState>
type Props = StateProps&DispatchProps&RouteProps;
interface State{}
const ulStyle = {
    width:'100px'
}
class Todos extends React.Component<Props,State>{
    render(){
        let {todos,addTodo}=this.props;
        return (
            <div>
                <TodoInput addTodo={addTodo}/>
                <ul style={ulStyle}>
                    {
                        todos.map((item:Todo,index:number)=><TodoItem key={index} todo={item}/>)
                    }
                </ul>
            </div>
        )
    }
}
const mapStateToProps = (state:CombinedState):TodosState=>{
    return state.todos;
}
export default connect(
    mapStateToProps,actions
)(Todos);