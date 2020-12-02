import * as actionTypes from '@/store/action-types';
import { TodoItem } from '@/models';

/**
 * @description 添加单个TODO
 * @param {TodoItem} todo 
 */
export function addTodo(todo: TodoItem) {
    return { type: actionTypes.ADD_TODO, payload: todo };
}