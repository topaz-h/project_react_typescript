import * as React from 'react';
import { connect } from 'react-redux';
import { CombinedState, CounterState } from '@/store/reducers';
import * as actions from '@/store/actions/counter';
import { RouteComponentProps } from 'react-router-dom';
import { StaticContext } from 'react-router';

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof actions;
interface Params { }
interface LocationState { }
type RouteProps = RouteComponentProps<Params, StaticContext, LocationState>
type Props = StateProps & DispatchProps & RouteProps;

class Counter extends React.Component<Props>{
    render() {
        const { number, add, goto } = this.props;
        return (
            <>
                <button onClick={add}>
                    {number}
                </button>
                <button onClick={() => goto({ pathname: '/post/2', state: { title: '白等' } })}>跳转到Post里</button>
            </>
        )
    }
}

// 注入props
const mapStateToProps = (state: CombinedState): CounterState => {
    return state.counter;
}
export default connect(
    mapStateToProps, actions
)(Counter);