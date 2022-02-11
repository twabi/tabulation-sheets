import React, {useEffect, useState} from "react";
import {MDBBox, MDBCard, MDBCardBody, MDBCardText, MDBCardTitle, MDBCol, MDBContainer, MDBRow,} from "mdbreact";
import {Button, DatePicker, Dropdown, Menu, Select, Space, TreeSelect} from "antd";
import {getInstance} from "d2";
import {DownOutlined} from "@ant-design/icons";
import Header from "@dhis2/d2-ui-header-bar";
import {useHistory} from 'react-router-dom';
import each from "async/each";
import _, { map } from 'underscore';

const { Option } = Select;
const moment = require('moment');
const AnalysisForm = (props) => {

    const basicAuth = "Basic " + btoa("ahmed:Atwabi@20");
    var orgUnitFilters = ["Filter By", "Markets"];
    var periodSwitch = ["Fixed Periods", "Relative Periods"];
    //https://www.namis.org/namis1/api/29/analytics.json?dimension=pe:${pe}&dimension=ou:${ouID}&filter=dx:${dxID}&displayProperty=NAME&outputIdScheme=NAME`
    //

    var weeks = [ "THIS_WEEK", "LAST_WEEK", "LAST_4_WEEKS", "LAST_12_WEEKS", "LAST_52_WEEKS"];
    var quarters = ["THIS_QUARTER", "LAST_QUARTER", "QUARTERS_THIS_YEAR", "QUARTERS_LAST_YEAR", "LAST_4_QUARTERS"];
    var bimonths = ["THIS_BIMONTH", "LAST_BIMONTH", "LAST_6_BIMONTHS"];
    var months = ["THIS_MONTH", "LAST_MONTH", "LAST_3_MONTHS", "MONTHS_THIS_YEAR",  "MONTHS_LAST_YEAR", "LAST_12_MONTHS"];
    //var array2 = ["Weeks", "Months", "Years", "Quarters", "Financial Years", "Bi-Months", "Six-Months"];
    var sixmonths = ["THIS_SIX_MONTH", "LAST_SIX_MONTH", "LAST_2_SIXMONTHS"];
    var years = ["THIS_YEAR", "LAST_YEAR", "LAST_5_YEARS"];
    const history = useHistory();
    var relativePeriods = weeks.concat(months).concat(bimonths).concat(quarters).concat(sixmonths).concat(years);
    const [showLoading, setShowLoading] = useState(false);
    const [orgUnits, setOrgUnits] = useState([]);
    const [groupSets, setGroupSets] = useState([]);
    const [searchValue, setSearchValue] = useState();
    const [crops, setCrops] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [orgFilter, setOrgFilter] = useState(orgUnitFilters[0]);
    const [choseFilter, setChoseFilter] = useState(false);
    const [treeMarkets, setTreeMarkets] = useState(null);
    const [treeValue, setTreeValue] = useState();
    const [flattenedUnits, setFlattenedUnits] = useState([]);
    const [D2, setD2] = useState();
    const [modal, setModal] = useState(false);
    const [alertModal, setAlertModal] = useState(false);
    const [message, setMessage] = useState("");
    const [periodTypes, setPeriodTypes] = useState([]);
    const [showLoad, setShowLoad] = useState(false);
    const [switchFixed, setSwitchFixed] = useState(false);
    const [activePeriod, setActivePeriod] = useState(periodSwitch[1]);
    const [type, setType] = useState('date');
    const [selectedOrgUnit, setSelectedOrgUnit] = useState();
    const [selectedPeriod, setSelectedPeriod] = useState();
    const [analysisArray, setAnalysisArray] = useState([]);
    const [columnArray, setColumnArray] = useState([]);
    const [dataArray, setDataArray] = useState([]);
    const [indicatorState, setIndicatorState] = useState([]);
    const [cropObjects, setCropObjects] = useState([]);
    const columns = [
        {
            title: 'Crops',
            dataIndex: 'crops',
            key: 'crops',
        },
        {
            title: 'Indicators',
            dataIndex: 'indicators',
            key: 'indicators',
            children: []
        }
    ];

    useEffect(() => {
        setCrops(props.crops);
        setOrgUnits(props.orgUnits);
        setPeriodTypes(props.periodTypes);
        setGroupSets(props.groupSets);
        setTreeMarkets(props.markets);

    },[props]);

    getInstance().then(d2 =>{
        setD2(d2);
    });

    /*
    var resultArray = [];
    const fetchIndicator = function(indicator) {
        //var tempArray = [];
        var dxID = indicator.id;
        var pe = selectedPeriod;
        var ouID = selectedOrgUnit.id;
        const endpoint = `analytics.json?dimension=pe:${pe}&dimension=ou:${ouID}&filter=dx:${dxID}&displayProperty=NAME&outputIdScheme=NAME`
        D2.Api.getApi().get(endpoint).then((response) => {
            //console.log(response)
            var sum = 0;
            response.rows&&response.rows.map((row) => {
                sum = sum + parseInt(row[2]);
            });
            var object = indicator;
            object.value = sum;
            //resultArray.push(object);
            //tempArray.push(indicator);
            //setIndicatorArray(indi => [...indi, object]);
        })

    };

    const createData = function(crop, indicator){
        var dataObject = {
            key: crop.id,
            crops: crop.name
        }

        //console.log(columns);
        columns[1].children.map((child) =>{

            dataObject[child.title] = crop.indicators[crop.indicators.findIndex(x => (x && x.displayName.toLowerCase().replace(/\s/g, ""))
                .includes((child.title.toLowerCase()).replace(/\s/g, "")))];

            //tempArray.push(dataObject);
            //console.log(dataObject);
            //setDataArray(indi => [...indi, dataObject]);
        })
    }

    const fetchOut = (array) => {
        array.map((indicator) => {
            //each(crop.indicators, fetchIndicator);
            each(indicator, getAnalytics);
        });
    }



    //the function that runs the analytics api is this one, carrying with it are the parameters orgUnits etc
    const getAnalytics = async (indicator) => {
        var dxID = indicator.id;
        var pe = selectedPeriod;
        var ouID = selectedOrgUnit.id;
        //var analysis = [];

        return await fetch(`https://www.namis.org/main/api/analytics.json?dimension=pe:${pe}&dimension=ou:${ouID}&filter=dx:${dxID}&displayProperty=NAME&outputIdScheme=NAME`, {
            method: "GET",
            mode: "cors",
            headers: {
                "Authorization" : basicAuth,
                "Content-type": "application/json",

            }

        }).then((response) => response.json())
            .then((response) => {
                var sum = 0;
                response.rows&&response.rows.map((row) => {
                    sum = sum + parseInt(row[2]);
                });
                indicator.value = sum;
                //console.log(crop.indicators[crop.indicators.findIndex(x => x.id === indicator.id)])
                //crop.indicator = indicator;
                //console.log(crop)
                console.log(indicator);
                setIndicatorState(indi => [...indi, indicator]);
                //setDataArray(indi => [...indi, indicator])
                /*
                if (_.findWhere(resultArray, crop) == null) {
                    resultArray.push(crop);
                    //setDataArray([...resultArray]);
                }



                //callBack(crop, indicator); //initiate the callback method


            }).catch((error) => {
                alert("oops an error occurred: " + error + " .Try reloading your page");

            });

    };

*/




    const handlePeriods = (value) => {
        if (typeof value === 'string' || value instanceof String){
            setSelectedPeriod(value);
        } else {
            if(type === "date"){
                console.log(moment(value).format("YYYYMMDD"));
                setSelectedPeriod(moment(value).format("YYYYMMDD"));
            } else if(type === "week"){
                console.log(moment(value).format("YYYY") +"W"+ moment(value).format("WW"));
                setSelectedPeriod(moment(value).format("YYYY") +"W"+ moment(value).format("WW"));
            } else if(type === "month"){
                console.log(moment(value).format("YYYYMM"));
                setSelectedPeriod(moment(value).format("YYYYMM"));
            } else if(type === "quarter"){
                console.log(moment(value).format("YYYY") +"Q"+ moment(value).format("Q"));
                setSelectedPeriod(moment(value).format("YYYY") +"Q"+ moment(value).format("Q"));
            } else if(type === "year"){
                console.log(moment(value).format("YYYY"));
                setSelectedPeriod(moment(value).format("YYYY"));
            }
        }

    }

    const handle = (value, label, extra) => {
        setSearchValue(value)
    };

    const onSelect = (value, node) => {
        console.log(node);
        setSelectedOrgUnit(node);
    };

    const gotoTable = (columns, indicators, orgUnit, period, crops) => {
        history.push(
            {
                pathname: '/analysis',
                state: {
                    columns: columns,
                    indicators: indicators,
                    d2: D2,
                    period: period,
                    orgUnit: orgUnit,
                    crops: crops
                },
            }
        );
    };

    const handleTree = (value, label, extra) => {
        setTreeValue(value)
        //console.log(value);
    };

    const onSelectTree = (value, node) => {
        //setOrgUnit(selectedOrgUnit => [...selectedOrgUnit, node]);
        setSelectedOrgUnit(node);
        console.log(node);
    };

    const handleGroup = selectedOption => {
        setSelectedGroup(selectedOption);
    };


    const handlePeriodSwitch = (value) => {
        setActivePeriod(value);
    }

    const handleOrgFilter = (value) => {
        setOrgFilter(value);
        if(value === "Markets"){
            setChoseFilter(true);
            setFlattenedUnits([]);
            //setSelectedOrgUnit(null)
            setSearchValue(null);
            setTreeValue(null);
        } else {
            setChoseFilter(false);
            setFlattenedUnits([]);
            //setSelectedOrgUnit(null)
            setSearchValue(null);
            setTreeValue(null);
        }
    }

    const handleAnalyse = () => {
        setShowLoading(true);
        var indicatorGroup = groupSets[groupSets.findIndex(x => x.id === selectedGroup)];

        console.log(selectedOrgUnit);
        console.log(indicatorGroup);
        console.log(selectedPeriod);


        var indicatorArray = [];
        indicatorGroup&&indicatorGroup.indicatorGroups.map(group => {
            indicatorArray = indicatorArray.concat(group.indicators);
            console.log(group.displayName);
            var title = group.displayName.split('1')[2].trim().toLowerCase();
            columns[1].children.push(
                {
                    title: title,
                    key: title,
                    dataIndex: title,
                }
            );
        });

        console.log(columns);
        setColumnArray(columns);

        var cropArray = crops.sort(function(a, b){return b.id - a.id}).reverse();
        setCrops(cropArray);


        var croppedIndicators = [];
        cropArray.map((crop) => {
            //console.log(crop.name);
            var array = indicatorArray.filter(x => (x.displayName).replace(/\s/g, "").toLowerCase()
                .includes(("-"+crop.name).replace(/\s/g, "").toLowerCase()))
            if(array.length > 4){
                array = array.filter(x => !(x.displayName).toLowerCase().includes("seed"));
            }

            array = array.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.displayName === value.displayName
                ))
            )
            //console.log(array);
            var object = {crop: crop.name, indicators: array}
            croppedIndicators.push(object);
        });

        console.log(croppedIndicators);

        /*
        croppedIndicators.map((crop) => {
            fetchOut(crop.indicators);
            crop.indicators.forEach((indicator) => {

                getAnalytics(crop, indicator, createData)
                    .then((r) => {
                        //setAnalytics([...analyzed]);
                        //console.log(indicatorArray);
                        //setDataArray([...resultArray]);
                        //setCropObjects([...croppedIndicators]);
                        //console.log(croppedIndicators);
                    }).then(() =>{
                    //gotoTable(columns, indicatorArray, selectedOrgUnit, selectedPeriod, indicatorArray, croppedIndicators);
                })

            })
        })

        console.log(indicatorState);

        waterfall([
            function(callback) {
                fetchOut(croppedIndicators)
                callback(null, indicatorArray);
            },
            function(arg1, callback) {
                // arg1 now equals indicatorArray and arg2 now equals 'two'
                console.log(arg1)
                croppedIndicators.forEach(function(cropped){
                    cropped.indicators.map((indicator)=>{
                        var indie = arg1[arg1.findIndex(x => (x.id === indicator.id))];
                        indicator.value = indie.value;
                    })
                })
                each(croppedIndicators, createData);

                console.log(croppedIndicators);
                callback(null, croppedIndicators);
            }
        ], function (err, result) {
            // result now equals 'done'
            console.log(result);
            gotoTable(columns, resultArray, selectedOrgUnit, selectedPeriod, croppedIndicators);
        });
        //console.log(resultArray);

        //console.log(JSON.stringify(croppedIndicators));
        //

         */


    }


    const orgUnitMenu = (
        <Menu>
            {orgUnitFilters.map((item, index) => (
                <Menu.Item key={index} onClick={()=>{handleOrgFilter(item)}}>
                    {item}
                </Menu.Item>
            ))}
        </Menu>
    );

    const periodMenu = (
        <Menu>
            {periodSwitch.map((item, index) => (
                <Menu.Item key={index} onClick={()=>{handlePeriodSwitch(item)}}>
                    {item}
                </Menu.Item>
            ))}
        </Menu>
    );

    return (

        <div>
            {D2 && <Header className="mb-5" d2={D2}/>}
            <MDBBox className="mt-5" display="flex" justifyContent="center" >
                <MDBCol className="mb-5 mt-5" md="10">
                    <MDBCard display="flex" justifyContent="center" className="text-xl-center w-100">
                        <MDBCardBody>
                            <MDBCardTitle>
                                <strong>Tabulation Sheets</strong>
                            </MDBCardTitle>

                            <MDBCardText>
                                <strong>Select indicator groupsets and Org Unit(s)</strong>
                            </MDBCardText>

                            {groupSets.length === 0 ? <div className="spinner-border mx-2 indigo-text spinner-border-sm" role="status">
                                <span className="sr-only">Loading...</span>
                            </div> : null}

                            <hr/>

                            <MDBContainer className="pl-5 mt-3">
                                <MDBRow>
                                    <MDBCol>
                                        <div className="text-left my-3 d-flex flex-column">
                                            <label className="grey-text ml-2">
                                                <strong>Select Indicator GroupSet</strong>
                                            </label>
                                            <Select placeholder="select indicator group set option"
                                                    style={{ width: '100%' }}
                                                    size="large"
                                                    className="mt-2"
                                                    showSearch
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0 || false
                                                    }
                                                    onChange={handleGroup}>
                                                {groupSets.map((item, index) => (
                                                    <Select.Option key={index} value={item.id}>{item.displayName}</Select.Option>
                                                ))}

                                            </Select>

                                        </div>
                                    </MDBCol>
                                    <MDBCol>

                                        <div className="text-left my-3">
                                            <label className="grey-text ml-2">
                                                <strong>Select Organization Unit</strong>
                                                {
                                                    <Dropdown overlay={orgUnitMenu} className="ml-3">
                                                        <Button size="small">{orgFilter} <DownOutlined /></Button>
                                                    </Dropdown>
                                                }

                                            </label>

                                            {choseFilter ?
                                                <TreeSelect
                                                    style={{ width: '100%' }}
                                                    value={treeValue}
                                                    className="mt-2"
                                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto'}}
                                                    treeData={treeMarkets}
                                                    allowClear
                                                    size="large"
                                                    placeholder="Please select organizational unit"
                                                    onChange={handleTree}
                                                    onSelect={onSelectTree}
                                                    showSearch={true}
                                                />
                                                :
                                                <TreeSelect
                                                    style={{ width: '100%' }}
                                                    value={searchValue}
                                                    className="mt-2"
                                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                    treeData={orgUnits}
                                                    allowClear
                                                    size="large"
                                                    placeholder="Please select organizational unit"
                                                    onChange={handle}
                                                    onSelect={onSelect}
                                                    showSearch={true}
                                                />

                                            }

                                        </div>
                                    </MDBCol>
                                    <MDBCol>
                                        <div className="text-left my-3 d-flex flex-column">
                                            <label className="grey-text ml-2">
                                                <strong>Select Period</strong>
                                                {
                                                    <Dropdown overlay={periodMenu} className="ml-3">
                                                        <Button size="small">{activePeriod} <DownOutlined /></Button>
                                                    </Dropdown>
                                                }
                                            </label>
                                            {
                                                activePeriod === "Relative Periods" ?
                                                    <Select placeholder="select Period option"
                                                            style={{ width: '100%' }}
                                                            size="large"
                                                            className="mt-2"
                                                            showSearch
                                                            optionFilterProp="children"
                                                            filterOption={(input, option) =>
                                                                option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0 || false
                                                            }
                                                            onChange={handlePeriods}>
                                                        {relativePeriods.map((item, index) => (
                                                            <Select.Option key={index} value={item}>{item}</Select.Option>
                                                        ))}

                                                    </Select>
                                                    :
                                                    <Space>
                                                        <Select value={type} style={{ width: '100%' }}
                                                                size="large"
                                                                className="mt-2" onChange={setType}>
                                                            <Option value="date">Date</Option>
                                                            <Option value="week">Week</Option>
                                                            <Option value="month">Month</Option>
                                                            <Option value="quarter">Quarter</Option>
                                                            <Option value="year">Year</Option>
                                                        </Select>
                                                        <DatePicker style={{ width: '100%' }}
                                                                        size="large"
                                                                        className="mt-2"
                                                                        picker={type} onChange={value => {
                                                                            handlePeriods(value);
                                                        }} />
                                                    </Space>
                                            }

                                        </div>
                                    </MDBCol>
                                </MDBRow>

                            </MDBContainer>

                            <div className="text-center py-4 mt-2">

                                <Button size="large" loading={showLoading} type="primary" className="text-white" onClick={handleAnalyse}>
                                    Analyse
                                </Button>
                            </div>

                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBBox>
        </div>
    );

}

export default AnalysisForm;
