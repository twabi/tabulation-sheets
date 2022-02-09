import React, {useCallback, useEffect, useState} from 'react';
import { Table } from 'antd';
import Header from "@dhis2/d2-ui-header-bar";
import {MDBBox, MDBCard, MDBCardBody, MDBCardText, MDBCardTitle, MDBCol} from "mdbreact";
import { useLocation, useHistory } from "react-router-dom";
import _, { map } from 'underscore';


const Analysis = () => {
    const history = useHistory();
    const location = useLocation();
    const [D2, setD2] = useState();
    const [columns, setColumns] = useState();
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState();
    const [orgUnit, setOrgUnit] = useState();
    const [crops, setCrops] = useState();
    const [dataArray, setDataArray] = useState([]);


    useEffect(() => {

        if(location.state) {
            setD2(location.state.d2);
            setColumns(location.state.columns);
            setPeriod(location.state.period);
            setOrgUnit(location.state.orgUnit);
            var cropArray = location.state.crops&&location.state.crops;
            cropArray = cropArray.sort(function(a, b){return b.id - a.id}).reverse();
            setCrops(cropArray);

            var columnArray = location.state.columns&&location.state.columns;
            var indicatorArray = location.state.indicators&&location.state.indicators;
            var tempArray = [];
            indicatorArray.map((indicator) => {
                var dxID = indicator.id;
                var pe = location.state.period;
                var ouID = location.state.orgUnit.id;
                const endpoint = `analytics.json?dimension=pe:${pe}&dimension=ou:${ouID}&filter=dx:${dxID}&displayProperty=NAME&outputIdScheme=NAME`

                location.state.d2.Api.getApi().get(endpoint)
                    .then((response) => {
                        var sum = 0;
                        response.rows&&response.rows.map((row) => {
                            sum = sum + parseInt(row[2]);
                        })

                        indicator.value = sum ? sum : 0;
                        cropArray.map((crop) => {

                            var dataObject = {
                                key: crop.id,
                                crops: crop.name
                            }
                            columnArray[1].children.map((child) =>{
                                //var i = indicator.findIndex(x => (x&&x.displayName.includes(child.title))&&(x&&x.displayName.includes(crop.name)));
                                //console.log(indicator);
                                console.log(child.title, crop.name, indicator.displayName);
                                var indie = (indicator.displayName.toLowerCase().includes(child.title.toLowerCase()))
                                &&(indicator.displayName.toLowerCase().includes(crop.name.toLowerCase())) ?
                                    indicator.value : "-";
                                console.log(indie);
                                dataObject[child.title] = indie;

                            })
                            if (_.findWhere(tempArray, dataObject) == null) {
                                tempArray.push(dataObject);
                            }
                            tempArray.push(dataObject);
                            //console.log(dataObject)

                            setDataArray([...tempArray]);
                        })

                        setLoading(false);
                        console.log(tempArray);
                        //tempArray.push(indicator);
                        //setDataArray([...tempArray]);
                    })
                    .catch((error) => {
                        console.log(error);
                        //alert("An error occurred: " + error);
                    });
                //setDataArray([...tempArray]);
            });

        }
        else {
            history.push("/");
        }
    }, [history, location]);


    return (
        <>
            {D2 && <Header className="mb-5" d2={D2}/>}
            <div className="d-flex justify-content-center" >
                <MDBCol className="mb-5 mt-5" md="10">
                    <MDBCard className="mt-4">
                        <div className="text-center">
                            <MDBCardTitle className="text-center my-4">
                                <>Tabulation Sheets</>
                            </MDBCardTitle>
                            <MDBCardText className="text-center">
                                <b>Org Unit:</b> {orgUnit&&orgUnit.name}
                            </MDBCardText>
                            <MDBCardText className="text-center">
                                <b>Period:</b> {period}
                            </MDBCardText>
                        </div>

                        <MDBCardBody>
                            <Table
                                columns={columns}
                                dataSource={dataArray}
                                loading={loading}
                                style={{overflow: "auto"}}
                                bordered
                                pagination={{ defaultPageSize: 52, showSizeChanger: true, pageSizeOptions: ['52', '100', '200']}}
                            />
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </div>
        </>

    )
}

export default Analysis;
