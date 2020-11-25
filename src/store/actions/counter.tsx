import * as actionTypes from '@/store/action-types';
import { CallHistoryMethodAction, push } from 'connected-react-router';
import {LocationDescriptorObject,Path} from 'history';
import {PostLocationState} from '@/components/Post';
export function add(){
    return {type:actionTypes.ADD}
}

export function minus(){
    return {type:actionTypes.MINUS}
}
export function goto(path:LocationDescriptorObject<PostLocationState>):CallHistoryMethodAction{
    return push(path);
}