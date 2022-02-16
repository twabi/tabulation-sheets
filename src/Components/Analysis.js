import React, {useEffect, useState} from 'react';
import {Button, Input, Table} from 'antd';
import Header from "@dhis2/d2-ui-header-bar";
import {MDBCard, MDBCardBody, MDBCardText, MDBCardTitle, MDBCol} from "mdbreact";
import {useHistory, useLocation} from "react-router-dom";
import axios from "axios";
import {TableExport} from "tableexport";

const { Search } = Input;
const Analysis = () => {
    const basicAuth = "Basic " + btoa("ahmed:Atwabi@20");
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
    const [tempDataArray, setTempDataArray] = useState([]);


    const getIndicatorData = (indicators) => {
        Promise.all(indicators.map((indicator) => axios.get(indicator.endpoint, {
            auth: {
                username: "ahmed",
                password: "Atwabi@20"
            }
        }))).then((data)=> {
            //console.log(data);
            //setFollowers(rows)
            //setFollowing(followings)
            var tempArray = [];
            location.state.crops.map((crop) =>{
                var cropName = (crop.crop).toLowerCase().replace(/\s/g, "");

                var array = data.filter(x => (x.data.metaData.items[x.data.metaData.dimensions.dx[0]].name).replace(/\s/g, "").toLowerCase().includes(cropName))

                var dataObject = {
                    key: crop.id,
                    crops: crop.crop
                }
                //console.log(cropName, crop.indicators);
                crop.indicators.map((indicator) =>{
                    //if(indicator.name.toLowerCase().includes(cropName))

                    //var word = array[0].data.metaData.dimensions.dx[0];
                    //console.log(word, array[0].data.metaData.items[word].name)

                    var indiValue = array.filter(x => (x.data.metaData.items[x.data.metaData.dimensions.dx[0]].name).replace(/\s/g, "").toLowerCase() ===
                        (indicator.displayName).replace(/\s/g, "").toLowerCase())
                    //console.log(indiValue);

                    var sum = 0;
                    indiValue[0].data.rows&&indiValue[0].data.rows.map((row) => {
                        sum = sum + parseFloat(row[2]);
                    });
                    indicator.value = sum;

                    if(indicator.displayName.includes("T1")){
                        if(indicator.displayName.includes("Round 2")){
                            indicator.title = indicator.displayName.split("Round 2")[1].split("-")[0].trim().toLowerCase();
                        } else {
                            if(indicator.displayName.includes(";")){
                                indicator.title = indicator.displayName.split(";")[1].split("-")[0].trim().toLowerCase();
                            } else {
                                indicator.title = indicator.displayName.split("-")[1].trim().toLowerCase();
                            }

                        }

                    }



                    console.log(indicator);
                    dataObject[indicator.title] = indicator.value;
                })
                //console.log(dataObject);
                tempArray.push(dataObject);
                console.log(tempArray);
                setDataArray([...tempArray]);
                setTempDataArray([...tempArray]);
                setLoading(false);

            })

        });
    }

    const handleSearch = searchText => {
        const filteredEvents = tempDataArray.filter(({ crops }) => {
            crops = crops&&crops.toLowerCase();
            return crops&&crops.includes(searchText);
        });

        setDataArray(filteredEvents);
    };


    useEffect(() => {

        if(location.state) {
            //getGithubData();
            setD2(location.state.d2);
            setColumns(location.state.columns);
            setPeriod(location.state.period);
            setOrgUnit(location.state.orgUnit);
            setCropIndicators(location.state.indicators);

            console.log(location.state.columns);
            setCrops(location.state.crops);
            var croppedIndicators = location.state.crops&&location.state.crops;
            console.log(croppedIndicators);

            var indes = [];
            croppedIndicators.forEach(crop => {
                crop.indicators.forEach(ind =>{
                    indes.push(ind);
                })
            })

            getIndicatorData(indes);


        }
        else {
            history.push("/");
        }
    }, [ history, location]);


    const exportXL = (tab) => {
        var table = tab;
        var exportData = table.getExportData();
        console.log(exportData);
        var csv = exportData.dataTable.csv;
        table.export2file(csv.data, csv.mimeType, csv.filename, csv.fileExtension, csv.merges, csv.RTL, csv.sheetname);

    }


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
                            <div className="d-flex justify-content-between">
                                <Search height={40}
                                        placeholder="Search crops" className="w-25 float-right"   onChange={e => handleSearch(e.target.value)} />
                                <Button type="primary" lassName="mx-1" onClick={() => {
                                    exportXL(TableExport(document.getElementById("dataTable"), {
                                        filename: "Tabulation sheets",
                                        exportButtons: false,
                                        sheetname: "Tabulation sheets",
                                    }));
                                }}>
                                    Print CSV
                                </Button>
                            </div>
                            <Table
                                columns={columns}
                                dataSource={dataArray}
                                id={"dataTable"}
                                loading={loading}
                                style={{overflow: "auto"}}
                                bordered
                                pagination={{ defaultPageSize: 25, showSizeChanger: true, pageSizeOptions: ['25', '50', '75']}}
                            />
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </div>
        </>

    )
}

export default Analysis;
