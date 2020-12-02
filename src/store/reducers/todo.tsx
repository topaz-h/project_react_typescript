import * as actionTypes from '@/store/action-types';
import { TodoItem, TodoState } from '@/models';

const initialState: TodoState = { todo: new Array<TodoItem>() };

export default function (state: TodoState = initialState, action: any): TodoState {
    switch (action.type) {
        case actionTypes.ADD_TODO:
            return { todo: [...state.todo, action.payload] };
        default:
            return state;

    }
}