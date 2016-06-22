import React, { Component } from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';


const UserView = observer(({user}) =>
    <li style={{overflow: 'hidden', marginTop: 15+'px'}}>
        <img src={user.avatar_url} style={{width:100+'px', height:100+'px', float:'left'}}/>
        <b>{user.login}</b>
    </li>
);

@observer
class UserListView extends Component {
    render() {
        return <div>
            <ul>
                {this.props.userList.users.map(user =>
                    <UserView user={user} key={user.id} />
                )}
            </ul>
            Site Admin: {this.props.userList.siteAdminUserCount}
        </div>
    }
}

export default UserListView;
