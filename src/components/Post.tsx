import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { CombinedState } from '@/store/reducers';
import { StaticContext } from 'react-router';

type StateProps = ReturnType<typeof mapStateToProps>
interface Params { id: string }//路径参数
export interface PostLocationState { title: string }//路径状态对象
type RouteProps = RouteComponentProps<Params, StaticContext, PostLocationState>
type Props = StateProps & RouteProps;

class Post extends React.Component<Props>{
    render() {
        const { match, location } = this.props;
        return (
            <div>
                id:{match.params.id}
                title:{location.state.title}
            </div>
        )
    }
}

// 注入props
const mapStateToProps = (state: CombinedState): CombinedState => {
    return state;
}
export default connect(
    mapStateToProps
)(Post);