import * as actionTypes from '@/store/action-types';
import {Todo} from '@/models';
export interface TodosState{
    todos:Array<Todo>
}
let initialState:TodosState={todos:new Array<Todo>()}
export default function(state:TodosState=initialState,action:any):TodosState{
    switch(action.type){
        case actionTypes.ADD_TODO:
            return {todos:[...state.todos,action.payload]};  
        default:
            return state;    

    }
}