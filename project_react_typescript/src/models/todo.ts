export type TodoItem = {
    id:number;
    text:string
};

export interface TodoState {
    todo: Array<TodoItem>
};
