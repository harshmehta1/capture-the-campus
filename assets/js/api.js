import store from './store';

class TheServer {

  submit_register(data) {
    console.log(data)
    // data.wins = 0;
    // data.totalGames = 0;

    let newData = {
      name: data.name,
      email: data.email,
      password: data.password,
      wins: 0,
      totalGames: 0,
    };
    console.log(newData)
    console.log(data)
    $.ajax("/api/v1/users", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(newData),
      success: (resp) => {
        alert("User created successfully");
        store.dispatch({
          type: 'ADD_USER',
          users: resp.data,
        });
      // this.request_users();
      },
      error: function(e){
        alert("Username Taken! Please enter a different username");
      },
    });
  }

  submit_login(data) {
    $.ajax("/api/v1/token", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(data),
      success: (resp) => {
        store.dispatch({
          type: 'SET_TOKEN',
          token: resp,
        })
        console.log(resp)

      },
      error: function(e){
        alert("Invalid Login Details");
      },
    });
  }
}

export default new TheServer();
// Attribution - http://www.ccs.neu.edu/home/ntuck/courses/2018/01/cs4550/notes/20-redux/notes.html
