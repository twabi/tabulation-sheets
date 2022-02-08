import React, {useEffect, useState} from "react";
import {
    MDBBox,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardText,
    MDBCardTitle,
    MDBCol,
    MDBContainer, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader,
    MDBRow,
} from "mdbreact";
import {Select, Button, Dropdown, Menu, TreeSelect, Modal, Spin} from "antd";
import {getInstance} from "d2";
import {DownOutlined} from "@ant-design/icons";
import Header from "@dhis2/d2-ui-header-bar";
import { DatePicker, TimePicker, Space } from 'antd';
import use from "use";

const { Option } = Select;
const moment = require('moment');
const AnalysisForm = (props) => {

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

    var relativePeriods = weeks.concat(months).concat(bimonths).concat(quarters).concat(sixmonths).concat(years);
    const [showLoading, setShowLoading] = useState(false);
    const [orgUnits, setOrgUnits] = useState([]);
    const [groupSets, setGroupSets] = useState([]);
    const [searchValue, setSearchValue] = useState();
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

    getInstance().then(d2 =>{
        setD2(d2);
    });

    useEffect(() => {
        setOrgUnits(props.orgUnits);
        setPeriodTypes(props.periodTypes);
        setGroupSets(props.groupSets);
        setTreeMarkets(props.markets);

    },[props]);

    function PickerWithType({ type, onChange }) {
        return <DatePicker style={{ width: '100%' }}
                           size="large"
                           className="mt-2" picker={type} onChange={onChange} />;
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


    const handleAnalyse = () => {

        var indicatorGroup = groupSets[groupSets.findIndex(x => x.id === selectedGroup)];

        console.log(selectedOrgUnit);
        console.log(indicatorGroup);
        console.log(selectedPeriod);

    }


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

                                <MDBBtn color="primary" className="text-white" onClick={handleAnalyse}>
                                    Analyse{showLoading ? <div className="spinner-border mx-2 text-white spinner-border-sm" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div> : null}
                                </MDBBtn>
                            </div>

                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBBox>
        </div>
    );

}

export default AnalysisForm;
