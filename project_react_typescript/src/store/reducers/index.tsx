import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import history from '@/utils/history';
import todo from './todo';
import counter from './counter';
import { CounterState, TodoState } from '@/models';

const reducers = {
    router: connectRouter(history),
    counter,
    todo
};

type ReducersType = typeof reducers;
// ReturnType 是获取某个函数的返回值的类型
type CombinedState = {
    [key in keyof ReducersType]: ReturnType<ReducersType[key]>
};
// type ReducersType2 = {
//     counter: (state: CounterState, action: any) => CounterState,
//     todo: (state: TodoState, action: any) => TodoState,
// }
// type CombinedState2 = {
//     counter: CounterState,
//     todo: TodoState
// }
export { CombinedState, CounterState, TodoState };

// rootReducer
const rootReducer = combineReducers(reducers);
export default rootReducer;