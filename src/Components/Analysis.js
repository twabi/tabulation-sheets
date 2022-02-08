import React, {useEffect, useState} from 'react';
import { Table } from 'antd';
import Header from "@dhis2/d2-ui-header-bar";
import {MDBBox, MDBCard, MDBCardBody, MDBCardTitle, MDBCol} from "mdbreact";
import { useLocation } from "react-router-dom";
import {getInstance} from "d2";


const Analysis = () => {
    const location = useLocation();
    const [D2, setD2] = useState();
    const [columns, setColumns] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if(location.state) {
            setLoading(false);
            setD2(location.state.d2);
            setColumns(location.state.columns);
            console.log(location.state.indicators);
        }
        else {
            getInstance().then((d2) => {
                setD2(d2);});
        }
    }, [location]);

    const data = [];
    for (let i = 0; i < 50; i++) {
        data.push({
            key: i,
            name: 'John Brown',
            age: i + 1,
            street: 'Lake Park',
            building: 'C',
            number: 2035,
            companyAddress: 'Lake Street 42',
            companyName: 'SoftLake Co',
            gender: 'M',
        });
    }

    return (
        <>
            {D2 && <Header className="mb-5" d2={D2}/>}
            <div className="d-flex justify-content-center" >
                <MDBCol className="mb-5 mt-5" md="10">
                    <MDBCard className="mt-4">
                        <MDBCardTitle className="text-center my-4">
                            <>Tabulation Sheets</>
                        </MDBCardTitle>
                        <MDBCardBody>
                            <Table
                                columns={columns}
                                dataSource={data}
                                loading={loading}
                                style={{overflow: "auto"}}
                                bordered
                            />
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </div>
        </>

    )
}

export default Analysis;
