import React, {Fragment, useState} from "react";
import {getInstance} from "d2";
import {Switch, Route} from "react-router-dom";
import Analysis from "./Analysis";
import AnalysisForm from "./AnalysisForm";

var arrayToTree = require("array-to-tree");
const App = (props) => {

  const [groupSets, setGroupSets] = React.useState([]);
  const [crops, setCrops] = React.useState([]);
  const [D2, setD2] = React.useState();
  const [orgUnits, setOrgUnits] = React.useState([]);
  const [periodTypes, setPeriodTypes] = React.useState([]);
  const [treeMarkets, setTreeMarkets] = React.useState([]);


  React.useEffect(() => {

    getInstance().then((d2) => {
      setD2(d2);
      const groupPoint = "indicatorGroupSets.json?paging=false&fields=id,displayName,indicatorGroups[id,displayName,indicators[id,displayName]]";
      const cropPoint = "dataStore/crops/crops";
      const orgEndpoint = "organisationUnits.json?fields=id,name&paging=false";
      const periodPoint = "periodTypes.json"
      const marketsEndPoint = "organisationUnitGroups/Lp9RVPodv0V.json?fields=organisationUnits[id,name,level,ancestors[id,name,level,parent]]";


        //get the indicator groups from their endpoint
      d2.Api.getApi().get(groupPoint)
          .then((response) => {
            //console.log(response.users);
            setGroupSets(response.indicatorGroupSets);
          })
          .catch((error) => {
            console.log(error);
            //alert("An error occurred: " + error);
          });

      //get all the crops available in the system
      d2.Api.getApi().get(cropPoint)
          .then((response) => {
            //console.log(response.userRoles);
            setCrops(response);
          })
          .catch((error) => {
            console.log(error);
            //alert("An error occurred: " + error);
          });

      d2.Api.getApi().get(periodPoint)
          .then((response) => {
            setPeriodTypes(response.periodTypes);
          })
          .catch((error) => {
            console.log(error);
            //alert("An error occurred: " + error);
          });

      d2.Api.getApi().get(orgEndpoint)
          .then((response) => {
            console.log(response.organisationUnits)

            response.organisationUnits.map((item, index) => {
              //

              //making sure every org unit has a parent node, if not set it to undefined
              item.title = item.name;
              item.value = item.name.replace(/ /g, "") + "-" + index;
              if(item.parent != null){
                //console.log(item.parent.id)
                item.parent = item.parent.id
              } else {
                item.parent = undefined
              }
            });

            //do the array-to-tree thing using the parent and id fields in each org unit
            var tree = arrayToTree(response.organisationUnits, {
              parentProperty: 'parent',
              customID: 'id'
            });

            //console.log(tree);
            setOrgUnits(tree)

          })
          .catch((error) => {
            console.log(error);
            //alert("An error occurred: " + error);
          });

      d2.Api.getApi().get(marketsEndPoint)
          .then((response) => {
              console.log(response.organisationUnits);

              const tempArray = []
              response.organisationUnits.map((item) => {
                  tempArray.push({"id" : item.id, "label" : item.name})
              });
              setTreeMarkets(tempArray);


              //var tempVar = {};
              var anotherArray = [];
              response.organisationUnits.map((item, index) => {
                  item.title = item.name;
                  item.value = item.name.replace(/ /g, "") + "-" + index;
                  item.ancestors.map((ancestor, number) => {

                      if(ancestor.level === 3){
                          item.parent = ancestor.id
                          ancestor.parent = ""
                          ancestor.title = ancestor.name;
                          ancestor.value = ancestor.name.replace(/ /g, "") + "-" + (index+number);
                          anotherArray.push(ancestor);
                      } else if(ancestor.level === 1){
                          ancestor.parent = undefined;
                          ancestor.title = ancestor.name;
                          ancestor.value = ancestor.name.replace(/ /g, "") + "-" + (index+number);
                          //tempVar = ancestor;
                      }
                  });
                  if(item.parent != null){
                      //console.log(item.parent.id)
                      //item.parent = item.parent.id
                  } else {
                      item.parent = undefined
                  }
              });

              anotherArray = anotherArray.slice().filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);

              response.organisationUnits = response.organisationUnits.concat(anotherArray);
              //response.organisationUnits.push(tempVar);

              //do the array-to-tree thing using the parent and id fields in each org unit
              var tree = arrayToTree(response.organisationUnits, {
                  parentProperty: 'parent',
                  customID: 'id'
              });

              setTreeMarkets(tree);
              console.log(tree);

          })
          .catch((error) => {
              console.log(error);
              //alert("An error occurred: " + error);
          });
    });

  }, [props]);


  return (
      <Fragment>
        <Switch>
          <Route path="/"  render={(props) => (
              <AnalysisForm {...props}
                    d2={D2}
                    orgUnits={orgUnits}
                    groupSets={groupSets}
                    periodTypes={periodTypes}
                    markets={treeMarkets}
                    crops={crops}
              />
          )} exact/>
        </Switch>
      </Fragment>
  );
}

export default App;
