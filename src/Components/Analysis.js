import React, {useEffect, useState} from 'react';
import { Table } from 'antd';
import Header from "@dhis2/d2-ui-header-bar";
import {MDBBox, MDBCard, MDBCardBody, MDBCardText, MDBCardTitle, MDBCol} from "mdbreact";
import { useLocation, useHistory } from "react-router-dom";
import {getInstance} from "d2";


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
            setCrops(location.state.crops);
            console.log(location.state.indicators);

            var tempArray = []
            //location.state.indicators&&location.state.indicators.map((indicator, index) =>{

            //});
            var cropArray = location.state.crops&&location.state.crops;
            cropArray = cropArray.sort(function(a, b){return b.id - a.id}).reverse();
            cropArray.map((crop, index) => {
                tempArray.push({
                    key: crop.id,
                    crops: crop.name,
                })
            })

            setDataArray([...tempArray]);
            setLoading(false);
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
                                Org Unit : {orgUnit&&orgUnit.name}
                            </MDBCardText>
                            <MDBCardText className="text-center">
                                Period : {period}
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
