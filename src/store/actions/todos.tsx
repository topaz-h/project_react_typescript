import * as actionTypes from '@/store/action-types';
import {Todo} from '@/models'
export function addTodo(todo:Todo){
    return {type:actionTypes.ADD_TODO,payload:todo}
}