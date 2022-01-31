import React, {Fragment} from "react";
import {
    Switch,
    Route,
} from "react-router-dom";
import Analysis from "./Analysis";
import App from "./App";


const Navigation = () => {


    return (
        <Fragment>
            <Switch>

                <Route path="/" render={(props) => (
                    <App {...props} />)} exact />
                <Route path="/analysis" render={(props) => (
                    <Analysis {...props} />)} exact />
                <Route path="/reports" render={(props) => (
                    <App {...props} />)} exact />

            </Switch>
        </Fragment>
    );

}

export default Navigation;
