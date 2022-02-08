import React, {useEffect, useState} from 'react';
import { Table } from 'antd';
import Header from "@dhis2/d2-ui-header-bar";
import {MDBBox, MDBCard, MDBCardBody, MDBCardTitle, MDBCol} from "mdbreact";
import { useLocation } from "react-router-dom";
import {getInstance} from "d2";


const Analysis = () => {
    const location = useLocation();
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 100,
            fixed: 'left',
            filters: [
                {
                    text: 'Joe',
                    value: 'Joe',
                },
                {
                    text: 'John',
                    value: 'John',
                },
            ],
            onFilter: (value, record) => record.name.indexOf(value) === 0,
        },
        {
            title: 'Other',
            children: [
                {
                    title: 'Age',
                    dataIndex: 'age',
                    key: 'age',
                    width: 150,
                    sorter: (a, b) => a.age - b.age,
                },
                {
                    title: 'Address',
                    children: [
                        {
                            title: 'Street',
                            dataIndex: 'street',
                            key: 'street',
                            width: 150,
                        },
                        {
                            title: 'Block',
                            children: [
                                {
                                    title: 'Building',
                                    dataIndex: 'building',
                                    key: 'building',
                                    width: 100,
                                },
                                {
                                    title: 'Door No.',
                                    dataIndex: 'number',
                                    key: 'number',
                                    width: 100,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            title: 'Company',
            children: [
                {
                    title: 'Company Address',
                    dataIndex: 'companyAddress',
                    key: 'companyAddress',
                    width: 200,
                },
                {
                    title: 'Company Name',
                    dataIndex: 'companyName',
                    key: 'companyName',
                },
            ],
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            width: 80,
            fixed: 'right',
        },
    ];

    const [D2, setD2] = useState();

    useEffect(() => {
        if(location.state) {
            setD2(location.state.d2);}
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
                                bordered
                                size="middle"
                                scroll={{  y: 400}}
                            />
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </div>
        </>

    )
}

export default Analysis;
