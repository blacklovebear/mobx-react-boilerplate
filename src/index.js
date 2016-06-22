import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Rx from 'rxjs';
import $ from 'jQuery';
import _ from 'underscore';

import {UserList} from './AppState';
import UserListView from './App';


const store = new UserList();

render(
    <AppContainer>
        <UserListView userList={store}/>
    </AppContainer>,
    document.getElementById('root')
  );


if (module.hot) {
  module.hot.accept('./App', () => {
    const NextUserListView = require('./App').default;

    render(
      <AppContainer>
        <NextUserListView userList={store}/>
      </AppContainer>,
      document.getElementById('root')
    );
  });
}

loadData();

// 代码参考实现
// https://segmentfault.com/a/1190000004293922
function loadData(){
    let refreshButton = document.querySelector(".refresh");
    let refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');

    let changeButton = document.querySelector(".change");
    let changeClickStream = Rx.Observable.fromEvent(changeButton, 'click');

    let requestStrem = refreshClickStream.startWith("startup click")
        .map(() => {
            let randomOffset = Math.floor(Math.random()*500);
            return 'https://api.github.com/users?since=' + randomOffset;
        });


    let responseStream = requestStrem.flatMap(
        (requestUrl) => Rx.Observable.fromPromise($.getJSON(requestUrl))
    )

    let suggestionStream = changeClickStream.startWith('startup click')
        .combineLatest(responseStream, (click, listUsers) => {
            // console.log(_.chain(listUsers).first(3).value());
            return _.chain(listUsers).shuffle().first(3).value();
        })
        .merge(
            refreshClickStream.map(() => null)
        )
        .startWith(null);


    suggestionStream.subscribe(function(suggestion) {
        if (suggestion == null) {
            store.users = [];
        } else {
            store.users = suggestion
        }
    })
}
