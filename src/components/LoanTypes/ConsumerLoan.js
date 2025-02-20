import { useState, Fragment, lazy, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import axios from "axios";

export function ConsumerLoan({ statement, setStatement, setValidated }) {

    const [municipals, setMunicipals] = useState([]);
    const [controledMunicipals, setControledMunicipals] = useState([]);
    const [deposit, setDeposit] = useState(0);
    const [incomeSource, setIncomeSource] = useState([]);
    const [workExperiance, setWorkExperiance] = useState([]);
    const [regions, setRegions] = useState([]);
    const [overlay, setOverlay] = useState(false);
    const [monthlyAverageIncomeValidate, setMonthlyAverageIncomeValidate] = useState(null);
    const [agroType, setAgroType] = useState("physical");


    useEffect(async () => {
        // Good!
        console.log('ConsumerLoanConsumerLoanConsumerLoanConsumerLoanConsumerLoanConsumerLoan')
        let us = JSON.parse(localStorage.getItem("user"));
        // setUser(localStorage.getItem('user'))
        // setCurrentUser(us);

        // setStatement({ ...statement, userId: us?.id });
        // console.log("currentUser", currentUser);

        var result1 = await axios.get(`https://weblive.com.ge/api/IncomeSource`);
        console.log('result IncomeSource', result1)
        setIncomeSource(result1.data);
        var result2 = await axios.get(`https://weblive.com.ge/api/WorkExperience`);
        console.log("result WorkExperience", result2);
        setWorkExperiance(result2.data);

        var regionsRes = await axios.get(`https://weblive.com.ge/api/Region`);
        console.log("result regions", regionsRes);
        setRegions(regionsRes.data)

        var municipalsRes = await axios.get(`https://weblive.com.ge/api/Municipal`);
        console.log("result municipals", municipalsRes);
        setMunicipals(municipalsRes.data)

        var cc = [...municipalsRes.data.filter(r => r.regionId == statement.regionId)];
        console.log(111111111111, cc)

        setControledMunicipals([...cc])

    }, []);

    const calculateMonthlyAverageIncome = () =>{
        console.log('currency', statement)
        if (statement.currency == "GEL") {
            if (statement?.monthlyAverageIncome < 1000) {
                // setValidated(true)
                let monthlyAverageIncomePart = statement?.monthlyAverageIncome * 25 / 100;

                let valid = monthlyAverageIncomePart > deposit ? true : false
                setMonthlyAverageIncomeValidate(valid)

                console.log('statement.monthlyAverageIncome', statement.monthlyAverageIncome)

            } else {
                let monthlyAverageIncomePart = statement?.monthlyAverageIncome * 50 / 100;

                let valid = monthlyAverageIncomePart > deposit ? true : false
                setMonthlyAverageIncomeValidate(valid)
            }
        } else {
            console.log('elslelsllelsllell')
            if (statement?.monthlyAverageIncome < 1000) {
                // setValidated(true)
                let monthlyAverageIncomePart = statement?.monthlyAverageIncome * 20 / 100;

                let valid = monthlyAverageIncomePart > deposit ? true : false
                setMonthlyAverageIncomeValidate(valid)

                console.log('statement.monthlyAverageIncome', statement.monthlyAverageIncome)

            } else {
                let monthlyAverageIncomePart = statement?.monthlyAverageIncome * 30 / 100;

                let valid = monthlyAverageIncomePart > deposit ? true : false
                setMonthlyAverageIncomeValidate(valid)
            }
        }

    }

    useEffect(async () => {

        calculateMonthlyAverageIncome();

    }, [statement?.monthlyAverageIncome,statement?.currency]);

    const handleChangeOverlay = (e) => {
        console.log("eee", e.target.checked);
        setOverlay(e.target.checked);
    };

    const handleChangeInput = (e) => {
        console.log('change', statement, e.target.name, e.target.value)
        if (e.target.name == 'regionId') {
            var cc = [...municipals.filter(r => r.regionId == e.target.value)];
            console.log(111111111111, cc)

            setControledMunicipals([...cc])
        }
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

        //თვიური შემოსავლის ვალიდაცია


        console.log("statement", statement);
    };
    return (
        <>
            <Card border="info" style={{ width: '49rem' }}>
                <Card.Header>მოთხოვნილი პროდუქტი</Card.Header>
                <Card.Body>
                    <Card.Text>
                        <div >
                            <div className="form-row">
                                <div className="col-md-4">
                                    <label for="inputEmail4" style={{fontSize:'15px'}}>
                                        მოთხოვნილი თანხა <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Form.Control
                                        required
                                        type="number"
                                        className="form-control"
                                        id="inputEmail4"
                                        placeholder="თანხა"
                                        name="requestedAmount"
                                        value={statement?.requestedAmount}
                                        onChange={handleChangeInput}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        მიუთითეთ მოთხოვნილი თანხა.
                                    </Form.Control.Feedback>
                                </div>
                                <div className=" col-md-2">
                                    <label for="inputEmail4" style={{fontSize:'15px'}}>
                                        ვალუტა<span style={{ color: "red" }}>*</span>
                                    </label>
                                    <select
                                        id="inputcurrency"
                                        className="form-control"
                                        name="currency"
                                        value={statement?.currency}
                                        onChange={handleChangeInput}
                                    >
                                        <option >GEL</option>
                                        <option>USD</option>
                                        <option>EUR</option>
                                    </select>
                                </div>
                                <div className=" col-md-2">
                                    {statement?.loantypeId != 5 ? (
                                        <>
                                            <label for="inputPassword4" style={{fontSize:'15px'}}>
                                                ვადა (თვე)<span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input
                                                required
                                                type="number"
                                                className="form-control"
                                                id="inputPassword4"
                                                placeholder="ვადა"
                                                name="term"
                                                value={statement?.term}
                                                onChange={handleChangeInput}
                                            />

                                            <Form.Control.Feedback type="invalid">
                                                მიუთითეთ ვადა.
                                            </Form.Control.Feedback>
                                        </>
                                    ) : (
                                        ""
                                    )}
                                </div>
                                <div className=" col-md-4">

                                    {statement?.loantypeId != 5 ? (
                                        <>
                                            <label for="inputPassword4" style={{fontSize:'15px'}}>
                                                შენატანი (სავარაუდო)
                                            </label>
                                            <input
                                                disabled
                                                type="number"
                                                className="form-control"
                                                id="inputPassword4"
                                                placeholder="შენატანი"
                                                name="deposit"
                                                value={deposit}
                                            // onChange={handleChangeInput}
                                            />
                                        </>
                                    ) : (
                                        ""
                                    )}

                                </div>
                            </div>
                        </div>
                    </Card.Text>
                </Card.Body>
            </Card>
            <br>
            </br>

            <Card border="info" style={{ width: '49rem' }}>
                <Card.Header>შემოსავლები</Card.Header>
                <Card.Body>
                    <Card.Text>
                        <div className="form-row">
                            <div className="form-group col-md-5">
                                <label for="inputPassword4" style={{fontSize:'15px'}}>
                                    თვიური საშუალო შემოსავალი (ლარში) <span style={{ color: "red" }}>*</span>
                                </label>
                                <Form.Control
                                    required
                                    type="number"
                                    className="form-control"
                                    id="inputPassword4"
                                    placeholder="შემოსავალი"
                                    name="monthlyAverageIncome"
                                    value={statement?.monthlyAverageIncome}
                                    onChange={handleChangeInput}
                                    isInvalid={statement?.monthlyAverageIncome ? !monthlyAverageIncomeValidate : false}
                                    isValid={monthlyAverageIncomeValidate}
                                />
                                {/* <input
                                    required
                                    type="number"
                                    className="form-control"
                                    id="inputPassword4"
                                    placeholder="შემოსავალი"
                                    name="monthlyAverageIncome"
                                    value={statement?.monthlyAverageIncome}
                                    onChange={handleChangeInput}
                                    isInvalid={statement?.monthlyAverageIncome  > 10}
                                    isValid={statement?.monthlyAverageIncome<  11}
                                /> */}
                                <Form.Control.Feedback type="invalid">
                                    მიუთითეთ თვიური საშუალო შემოსავალი.
                                </Form.Control.Feedback>
                            </div>
                            <div className="form-group col-md-3">
                                <label for="inputState" style={{fontSize:'15px'}}>
                                    შემოსავლის წყარო <span style={{ color: "red" }}>*</span>
                                </label>
                                <Form.Control
                                    required
                                    as="select"
                                    id="inputState"
                                    className="form-control"
                                    name="incomeSourceId"
                                    value={statement?.incomeSourceId}
                                    onChange={handleChangeInput}
                                >
                                    <option></option>
                                    {incomeSource.map((s) => (
                                        <option key={s.id} name={s.id} value={s.id}>
                                            {s.incomeSourceName}
                                        </option>
                                    ))}
                                    ;
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    მიუთითეთ თვიური საშუალო შემოსავალი.
                                </Form.Control.Feedback>
                            </div>
                            <div className="form-group col-md-4">
                                {statement?.loantypeId == 3 ||
                                    (statement?.loantypeId == 4 && agroType == "legal") ? (
                                    ""
                                ) : (
                                    <>

                                        {/* {statement?.incomeSourceId == 7 ? ( */}
                                        <>
                                            <label for="inputPassword4" style={{fontSize:'15px'}}>
                                                სხვა შემოსავლის წყარო
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input
                                                disabled={statement?.incomeSourceId != 7}
                                                type="text"
                                                className="form-control"
                                                id="inputPassword4"
                                                placeholder="სხვა შემოსავლის წყარო"
                                                name="otherIncomeSource"
                                                value={statement?.otherIncomeSource}
                                                onChange={handleChangeInput}
                                            />
                                        </>
                                        {/* ) : (
                        ""
                      )} */}


                                    </>
                                )}

                            </div>
                            {statement?.loantypeId == 3 ||
                                (statement?.loantypeId == 4 && agroType == "legal") ? (
                                ""
                            ) : (
                                <>

                                    <div className="form-group col-md-5">
                                        <label for="inputState" style={{fontSize:'15px'}}>
                                            სად გერიცხებათ ხელფასი<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <select
                                            required
                                            id="inputState"
                                            className="form-control"
                                            name="incomeAccrue"
                                            value={statement?.incomeAccrue}
                                            onChange={handleChangeInput}
                                        >
                                            <option selected></option>
                                            <option value="ბანკში">ბანკში</option>
                                            <option value="ხელზე">ხელზე</option>
                                        </select>
                                        <Form.Control.Feedback type="invalid">
                                            მიუთითეთ  სად გერიცებათ ხელფასი.
                                        </Form.Control.Feedback>
                                    </div>
                                    <div className="form-group col-md-7">
                                        <label for="inputState" style={{fontSize:'15px'}}>
                                            სამუშო გამოცდილება - სტაჟი
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <select
                                            required
                                            id="inputState"
                                            className="form-control"
                                            name="workExperienceId"
                                            value={statement?.workExperienceId}
                                            onChange={handleChangeInput}
                                        >
                                            <option selected></option>
                                            {workExperiance.map((s) => (
                                                <option key={s.id} name={s.id} value={s.id}>
                                                    {s.workExperienceName}
                                                </option>
                                            ))}
                                            ;
                                        </select>
                                        <Form.Control.Feedback type="invalid">
                                            მიუთითეთ  სტაჟი.
                                        </Form.Control.Feedback>
                                    </div>
                                </>
                            )}
                        </div>
                    </Card.Text>
                </Card.Body>
            </Card>
            <br />



            <Card border="info" style={{ width: '49rem' }}>
                <Card.Header>დამატებითი ინფორმაცია</Card.Header>
                <Card.Body>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label for="inputPassword4" style={{fontSize:'15px'}}>
                                ფაქტიური მისამართი<span style={{ color: "red" }}>*</span>
                            </label>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <select
                                        required
                                        id="inputState"
                                        className="form-control"
                                        name="regionId"
                                        value={statement?.regionId}
                                        onChange={handleChangeInput}
                                    >
                                        <option selected></option>
                                        {regions.map((s) => (
                                            <option key={s.id} name={s.id} value={s.id}>
                                                {s.regionName}
                                            </option>
                                        ))}
                                        ;
                                    </select>
                                </div>
                                <div className="form-group col-md-6">
                                    <select
                                        required
                                        id="inputState"
                                        className="form-control"
                                        name="municipalId"
                                        value={statement?.municipalId}
                                        onChange={handleChangeInput}
                                    >
                                        <option selected></option>
                                        {controledMunicipals.map((s) => (
                                            <option key={s.id} name={s.id} value={s.id}>
                                                {s.municipalName}
                                            </option>
                                        ))}
                                        ;
                                    </select>
                                </div>

                            </div>

                            <Form.Control.Feedback type="invalid">
                                მიუთითეთ  მისამართი.
                            </Form.Control.Feedback>
                            {/* <input
            required
            type="text"
            className="form-control"
            id="inputPassword4"
            placeholder="ფაქტიური მისამართი"
            name="actualAddress"
            onChange={handleChangeInput}
            value={statement?.actualAddress}
          /> */}

                            {/* <Form.Control.Feedback type="invalid">
            მიუთითეთ ფაქტიური მისამართი.
          </Form.Control.Feedback> */}
                        </div>
                        <div className="form-group col-md-6">
                            <label for="inputPassword4" style={{fontSize:'15px'}}>
                                სხვა არსებული სესხები (ჯამურად ლარში)
                                <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                required
                                type="number"
                                className="form-control"
                                id="inputPassword4"
                                placeholder="ჯამი"
                                name="existingLoans"
                                onChange={handleChangeInput}
                                value={statement?.existingLoans}
                            />
                            <Form.Control.Feedback type="invalid">
                                სხვა არსებული სესხები (ჯამურად).
                            </Form.Control.Feedback>
                        </div>
                        <div className="form-group col-md-7">
                            <label for="inputPassword4" style={{fontSize:'15px'}}>
                                რამდენს იხდით სესხებში ყოველთვიურად? (ლარში)
                                <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                required
                                type="number"
                                className="form-control"
                                id="inputPassword4"
                                placeholder="თანხა"
                                name="montlyPaidAmount"
                                onChange={handleChangeInput}
                                value={statement?.montlyPaidAmount}
                            />
                            <Form.Control.Feedback type="invalid">
                                სხვა არსებული სესხები (ჯამურად).
                            </Form.Control.Feedback>
                        </div>
                        <div className="form-group col-md-5">
                            <label for="inputState" style={{fontSize:'15px'}}>
                                {" "}
                                გაქვს ნეგატიური სტატუსი?{" "}
                                <span style={{ color: "red" }}>*</span>
                            </label>
                            <select
                                required
                                id="inputState"
                                className="form-control"
                                name="negativeStatus"
                                onChange={handleChangeInput}
                            >
                                <option selected></option>
                                <option>მაქვს</option>
                                <option>მქონდა</option>
                                <option>არასდროს მქონია</option>
                            </select>
                            <Form.Control.Feedback type="invalid">
                                აირჩიეთ .
                            </Form.Control.Feedback>
                        </div>
                        <div className="form-group col-md-6">
                            <label>
                                {" "}
                                <input
                                    type="checkbox"
                                    checked={overlay}
                                    onChange={handleChangeOverlay}
                                />{" "}
                                აპირებთ თუ არა სხვა სესხების გადაფარვას?{" "}
                            </label>
                        </div>
                        {overlay ? (
                            <>
                                <div className="form-group col-md-6">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="inputPassword4"
                                        placeholder="მიუთითეთ თანხა"
                                        name="overlayAmount"
                                        onChange={handleChangeInput}
                                        value={statement?.overlayAmount}
                                    />
                                </div>
                            </>
                        ) : (
                            ""
                        )}
                    </div>
                </Card.Body>
            </Card>



        </>
    );
}



