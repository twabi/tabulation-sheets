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
    const [periodTypes, setPeriodTypes] = useState([]);
    const [activePeriod, setActivePeriod] = useState(periodSwitch[1]);
    const [type, setType] = useState('date');
    const [selectedOrgUnit, setSelectedOrgUnit] = useState();
    const [selectedPeriod, setSelectedPeriod] = useState();
    const [columnArray, setColumnArray] = useState([]);
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

    var resultArray = [];

    const handleYear = (value) => {
        console.log(moment(value).format("YYYY"));
        setSelectedPeriod(moment(value).format("YYYY"));
    }

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
            if(group.displayName.includes("Tabulation")){
                if(group.displayName.includes("Round")){
                    var title = group.displayName.split('Round')[1].replace(/[0-9]/g, '').trim().toLowerCase();
                } else{
                    var title = group.displayName.split('-')[1].replace(/[0-9]/g, '').trim().toLowerCase();
                }
            }



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
            var object = {id: crop.id, crop: crop.name, indicators: array}
            croppedIndicators.push(object);
        });

        console.log(croppedIndicators);
        setCropObjects(croppedIndicators);


        var pe = selectedPeriod;
        var ouID = selectedOrgUnit.id;

        croppedIndicators.map((crop) => {
          crop.indicators.forEach((indicator) => {
              var dxID = indicator.id;
              indicator.endpoint = `https://www.namis.org/main/api/analytics.json?dimension=pe:${pe}&dimension=ou:${ouID}&filter=dx:${dxID}&displayProperty=NAME&outputIdScheme=NAME`
          })
        });

        console.log(croppedIndicators);
        gotoTable(columns, resultArray, selectedOrgUnit, selectedPeriod, croppedIndicators);

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
                                                {/*
                                                    <Dropdown overlay={orgUnitMenu} className="ml-3">
                                                        <Button size="small">{orgFilter} <DownOutlined /></Button>
                                                    </Dropdown>
                                                    */}

                                            </label>

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

                                        </div>
                                    </MDBCol>
                                    <MDBCol>
                                        <div className="text-left my-3 d-flex flex-column">
                                            <label className="grey-text ml-2">
                                                <strong>Select agricultural year</strong>
                                            </label>
                                            <Space>
                                                {/*
                                                        <Select value={type} style={{ width: '100%' }}
                                                                size="large"
                                                                className="mt-2" onChange={setType}>
                                                            <Option value="date">Date</Option>
                                                            <Option value="week">Week</Option>
                                                            <Option value="month">Month</Option>
                                                            <Option value="quarter">Quarter</Option>
                                                            <Option value="year">Year</Option>
                                                        </Select>
                                                        */}

                                                <DatePicker style={{ width: '100%' }}
                                                            size="large"
                                                            className="mt-2"
                                                            picker={"year"} onChange={value => {
                                                    handleYear(value);
                                                }} />
                                            </Space>
                                            {/*
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

                                            */}

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
