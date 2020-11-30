import * as actionTypes from '@/store/action-types';
import { CallHistoryMethodAction, push } from 'connected-react-router';
import { LocationDescriptorObject } from 'history';
import { PostLocationState } from '@/components/Post';

/**
 * @description 计数器加1
 */
export function add() {
    return { type: actionTypes.ADD };
}

/**
 * @description 计数器减1
 */
export function minus() {
    return { type: actionTypes.MINUS };
}

/**
 * @description 路由跳转
 * @param {LocationDescriptorObject<PostLocationState>} path
 */
export function goto(path: LocationDescriptorObject<PostLocationState>): CallHistoryMethodAction {
    return push(path);
}