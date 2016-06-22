import { observable, computed } from 'mobx';


export class UserList {
    @observable users = [];
    @computed get siteAdminUserCount() {
        return this.users.filter(user => user.site_admin).length;
    }
}

