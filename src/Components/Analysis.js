import React, {useEffect, useState} from 'react';
import {Table} from 'antd';
import Header from "@dhis2/d2-ui-header-bar";
import {MDBCard, MDBCardBody, MDBCardText, MDBCardTitle, MDBCol} from "mdbreact";
import {useHistory, useLocation} from "react-router-dom";
import each from 'async/each';
import waterfall from 'async/waterfall';

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
    const [cropIndicators, setCropIndicators] = useState([]);
    const [indicators, setIndicators] = useState([]);




    useEffect(() => {

        if(location.state) {
            setD2(location.state.d2);
            setColumns(location.state.columns);
            setPeriod(location.state.period);
            setOrgUnit(location.state.orgUnit);
            setCropIndicators(location.state.indicators);
            setIndicators(location.state.indies);

            //console.log(location.state.indicators);
            var indieArray = location.state.indies&&location.state.indies;
            console.log(JSON.stringify(location.state.indicators));
            var croppedIndicators = location.state.crops&&location.state.crops;
            console.log(croppedIndicators);

            croppedIndicators.map((crop) => {
                var dataObject = {
                    key: crop.id,
                    crops: crop.name
                }

                location.state.columns[1].children.map((child) =>{

                    var valued = indicators[indicators.findIndex(x => (x&&x.displayName.toLowerCase().replace(/\s/g, ""))
                        .includes((child.title.toLowerCase()).replace(/\s/g, "")))];
                    
                    //console.log(valued);

                    dataObject[child.title] = valued&&valued.value;
                })
            })

            /*
            var tempArray = [];
            cropArray.map((crop) => {
                var dataObject = {
                    key: crop.id,
                    crops: crop.name
                }

                //console.log(columns);
                location.state.columns[1].children.map((child) =>{

                     var valued = crop.indicators[crop.indicators.findIndex(x => (x && x.displayName.toLowerCase().replace(/\s/g, ""))
                        .includes((child.title.toLowerCase()).replace(/\s/g, "")))];

                    dataObject[child.title] = valued&&valued.value;

                    tempArray.push(dataObject);
                    //console.log(dataObject);
                    setDataArray(indi => [...indi, dataObject]);
                })
                
            });

            console.log(tempArray);

             */
            

        }
        else {
            history.push("/");
        }
    }, [cropIndicators, history, indicators, location]);


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
