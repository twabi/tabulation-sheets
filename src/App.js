import React, {Fragment, useState} from "react";
import {getInstance} from "d2";
import {Switch, Route} from "react-router-dom";
import Analysis from "./Components/Analysis";

const App = (props) => {

  const [users, setUsers] = React.useState([]);
  const [userGroups, setGroups] = React.useState([]);
  const [roles, setRoles] = React.useState([]);
  const [D2, setD2] = React.useState();
  const [orgUnits, setOrgUnits] = React.useState([]);

  React.useEffect(() => {

    getInstance().then((d2) => {
      setD2(d2);
      const userPoint = "users.json?fields=id,firstName,surname,name,organisationUnits,userCredentials[id,userInfo,username,userRoles],userGroups&paging=false";
      const groupPoint = "userGroups.json?paging=false";
      const rolesPoint = "userRoles.json?paging=false";
      const orgEndpoint = "organisationUnits.json?fields=id,name&paging=false";

      //get the users from their endpoint
      d2.Api.getApi().get(userPoint)
          .then((response) => {
            //console.log(response.users);
            setUsers(response.users);
          })
          .catch((error) => {
            console.log(error);
            alert("An error occurred: " + error);
          });

      //get all the user groups defined in the system
      d2.Api.getApi().get(groupPoint)
          .then((response) => {
            //console.log(response.userGroups);
            setGroups(response.userGroups);
          })
          .catch((error) => {
            console.log(error);
            alert("An error occurred: " + error);
          });

      //get all the user roles available in the system
      d2.Api.getApi().get(rolesPoint)
          .then((response) => {
            //console.log(response.userRoles);
            setRoles(response.userRoles);
          })
          .catch((error) => {
            console.log(error);
            alert("An error occurred: " + error);
          });

      d2.Api.getApi().get(orgEndpoint).then((response) => {
        //console.log(response.userRoles);
        setOrgUnits(response.organisationUnits);
      })
          .catch((error) => {
            console.log(error);
            alert("An error occurred: " + error);
          });
    });

  }, [props]);


  return (
      <Fragment>
        <Switch>
          <Route path="/"  render={(props) => (
              <Analysis {...props}
                   d2={D2}
                   users={users}
                   orgUnits={orgUnits}
                   userGroups={userGroups}
                   userRoles={roles}
              />
          )} exact/>
        </Switch>
      </Fragment>
  );
}

export default App;
