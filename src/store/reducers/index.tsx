import counter,{CounterState} from './counter';
import todos,{TodosState} from './todos';
import {combineReducers} from 'redux';
import history from '@/utils/history';
import {connectRouter} from 'connected-react-router';
let reducers = {
    router:connectRouter(history),
    counter,
    todos
}
type ReducersType = typeof reducers;
type ReducersType2 = {
    counter:(state:CounterState,action:any)=>CounterState,
    todos:(state:TodosState,action:any)=>TodosState,
}
//ReturnType是获取某个函数的返回值的类型
type CombinedState = {
    [key in keyof ReducersType]:ReturnType<ReducersType[key]>
}
type CombinedState2={
    counter:CounterState,
    todos:TodosState
}
export {CombinedState,CounterState,TodosState}
let rootReducer = combineReducers(reducers);
export default rootReducer;