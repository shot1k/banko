import { useState, Fragment, lazy, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { ConsumerLoan } from "./ConsumerLoan";

export function BusinessLoan({ statement, setStatement }) {

    const [municipals, setMunicipals] = useState([]);
    const [controledMunicipals, setControledMunicipals] = useState([]);
    const [deposit, setDeposit] = useState(0);
    const [incomeSource, setIncomeSource] = useState([]);
    const [workExperiance, setWorkExperiance] = useState([]);
    const [regions, setRegions] = useState([]);
    const [overlay, setOverlay] = useState(false);
    const [agroType, setAgroType] = useState("physical");

    useEffect(async () => {
        // Good!
        let us = JSON.parse(localStorage.getItem("user"));
        // setUser(localStorage.getItem('user'))
        // setCurrentUser(us);

        // setStatement({ ...statement, userId: us?.id });
        // console.log("currentUser", currentUser);

        // var result1 = await axios.get(`https://weblive.com.ge/api/IncomeSource`);
        // console.log('result IncomeSource', result1)
        // setIncomeSource(result1.data);
        // var result2 = await axios.get(`https://weblive.com.ge/api/WorkExperience`);
        // console.log("result WorkExperience", result2);
        // setWorkExperiance(result2.data);

        // var regionsRes = await axios.get(`https://weblive.com.ge/api/Region`);
        // console.log("result regions", regionsRes);
        // setRegions(regionsRes.data)

        // var municipalsRes = await axios.get(`https://weblive.com.ge/api/Municipal`);
        // console.log("result municipals", municipalsRes);
        // setMunicipals(municipalsRes.data)

    }, []);

    const handleChangeOverlay = (e) => {
        console.log("eee", e.target.checked);
        setOverlay(e.target.checked);
    };

    const handleChangeInput = (e) => {
        console.log('change', e.target.name, e.target.value)
        if (e.target.name == 'regionId') {
            var cc = [...municipals.filter(r => r.regionId == e.target.value)];
            console.log(111111111111, cc)

            setControledMunicipals([...cc])
        }
        console.log('res', res)
        // setStatement({...statement, deposit: res})
        //10%
        setStatement({ ...statement, [e.target.name]: e.target.value });

        //setStatement({...statement, kk: res})
        if (e.target.name == 'term' || e.target.name == 'requestedAmount') {
            let t;
            let r;
            if (e.target.name == 'requestedAmount') {
                t = statement.term;
                r = e.target.value;
            }
            if (e.target.name == 'term') {
                t = e.target.value;
                r = statement.requestedAmount;
            }
            let per = 1 / 100;
            let x = Math.pow((1 + per), t);
            console.log('xxxxxxxxxxx', x)
            var res = r / ((1 - (1 / x)) / per);
            setDeposit(res.toFixed(2))
        }

        console.log("statement", statement);
    };
    return (
        <>

            <Card border="info" style={{ width: '49rem' }}>
                <Card.Header>კომპანიის შესახებ</Card.Header>
                <Card.Body>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label for="inputPassword4" style={{fontSize:'15px'}}>
                                კომპანიის დასახელება<span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                required
                                type="text"
                                className="form-control"
                                id="inputPassword4"
                                placeholder="კომპანიის დასახელება"
                                name="borrowerName"
                                value={statement?.borrowerName}
                                onChange={handleChangeInput}
                            />
                            <Form.Control.Feedback type="invalid">
                                მოითითეთ კომპანიის დასახელება.
                            </Form.Control.Feedback>
                        </div>
                        <div className="form-group col-md-6">
                            <label for="inputPassword4" style={{fontSize:'15px'}}>
                                საიდენტიფიკაციო ნომერი<span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                required
                                type="text"
                                className="form-control"
                                id="inputPassword4"
                                placeholder="საიდენტიფიკაციო ნომერი"
                                name="taxcode"
                                value={statement?.taxcode}
                                onChange={handleChangeInput}
                            />
                            <Form.Control.Feedback type="invalid">
                                საიდენტიფინაციო ნომერი.
                            </Form.Control.Feedback>
                        </div>
                    </div>
                </Card.Body>
            </Card>
            <br></br>
            {/* <div className="form-group col-md-6">
          <label for="inputPassword4">ბიზნესის გამოცდილება</label>
          <input
            type="text"
            className="form-control"
            id="inputPassword4"
            placeholder="ბიზნესის გამოცდილება"
            name="businessExperience"
            onChange={handleChangeInput}
          />
        </div> */}
            <ConsumerLoan statement={statement} setStatement={setStatement} />


        </>
    );
}




