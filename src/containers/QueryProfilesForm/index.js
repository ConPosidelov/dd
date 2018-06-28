import React from "react";
import { connect } from "react-redux";
import A from "../../actions";

import {
  Row,
  Col,
  Button,
  Tooltip,
  OverlayTrigger,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock
} from "react-bootstrap";

import Spinner from "react-md-spinner";

class ProfilesForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.getValidation = this.getValidation.bind(this);

    this.state = {
      valueObj: {
        name: "",
        description: "without description",
        type: "custom",
        url: "",
        pageStart: 1,
        pageOffset: 20,
        itemLimit: 999,
        minSales: 1,
        minRank: 1,
        results: []
      }
    };

    this.errorsObj = {
      name: true,
      description: true,
      type: false,
      url: true,
      pageStart: true,
      pageOffset: true,
      itemLimit: true,
      minSales: true,
      minRank: true
    };
  }

  getValidation(target) {
    const { valueObj } = this.state;
    const errorsObj = this.errorsObj;
    const { setErrorOfForm } = this.props;

    const setError = prop => {
      setErrorOfForm(true);
      errorsObj[prop] = true;
      return "error";
    };
    const setSuccess = prop => {
      setErrorOfForm(false);
      errorsObj[prop] = false;
      Object.keys(errorsObj).forEach(item => {
        if (errorsObj[item]) setErrorOfForm(true);
      });
      return "success";
    };

    if (target === "name") {
      const { length } = valueObj.name;
      if (length > 3) return setSuccess("name");
      else if (length >= 0) return setError("name");
    } else if (target === "description") {
      const { length } = valueObj.description;
      if (length >= 0 && length <= 200) return setSuccess("description");
      else if (length > 200) return setError("description");
    } else if (target === "url") {
      const { length } = valueObj.url;
      if (length > 14) return setSuccess("url");
      else if (length >= 0) return setError("url");
    } else if (target === "pageStart") {
      const { pageStart } = valueObj;
      if (!isNaN(pageStart) && pageStart > 0 && pageStart <= 500)
        return setSuccess("pageStart");
      else return setError("pageStart");
    } else if (target === "pageOffset") {
      const { pageOffset } = valueObj;
      if (!isNaN(pageOffset) && pageOffset > 0 && pageOffset <= 500)
        return setSuccess("pageOffset");
      else return setError("pageOffset");
    } else if (target === "itemLimit") {
      const { itemLimit } = valueObj;
      if (!isNaN(itemLimit) && itemLimit > 0 && itemLimit <= 2000)
        return setSuccess("itemLimit");
      else return setError("itemLimit");
    } else if (target === "minSales") {
      const { minSales } = valueObj;
      if (!isNaN(minSales) && minSales > 0 && minSales <= 99999)
        return setSuccess("minSales");
      else return setError("minSales");
    } else if (target === "minRank") {
      const { minRank } = valueObj;
      if (!isNaN(minRank) && minRank > 0 && minRank <= 99999)
        return setSuccess("minRank");
      else return setError("minRank");
    }

    return null;
  }

  handleChange(e) {
    const { types } = this.props;
    const { valueObj } = this.state;
    const { target } = e;
    const id = target.getAttribute("id");

    if (id === "queryProfileTitle") {
      this.setState({ valueObj: { ...valueObj, name: target.value } });
    } else if (id === "queryProfileDescription") {
      this.setState({ valueObj: { ...valueObj, description: target.value } });
    } else if (id === "queryProfileType") {
      this.setState({
        valueObj: {
          ...valueObj,
          type: target.value,
          url: types[target.value].url
        }
      });
    } else if (id === "queryProfileUrl") {
      this.setState({ valueObj: { ...valueObj, url: target.value } });
    } else if (id === "queryProfilePageStart") {
      this.setState({ valueObj: { ...valueObj, pageStart: target.value } });
    } else if (id === "queryProfilePageOffset") {
      this.setState({ valueObj: { ...valueObj, pageOffset: target.value } });
    } else if (id === "queryProfileItemLimit") {
      this.setState({ valueObj: { ...valueObj, itemLimit: target.value } });
    } else if (id === "queryProfileMinSales") {
      this.setState({ valueObj: { ...valueObj, minSales: target.value } });
    } else if (id === "queryProfileMinRank") {
      this.setState({ valueObj: { ...valueObj, minRank: target.value } });
    }
  }

  render() {
    const {
      valueObj: {
        name,
        description,
        type,
        url,
        pageStart,
        pageOffset,
        itemLimit,
        minSales,
        minRank,
        results
      }
    } = this.state;

    const {
      errorOfForm,
      saveNewQueryProfile,
      cancelNewQueryProfile,
      newProfileStatus,
      types,
      forceUpdate
    } = this.props;

    const options = Object.keys(types).map((item, i) => {
      return (
        <option key={i} value={`${item}`}>
          {item}
        </option>
      );
    });

    return (
      <Row className="form_profiles">
        <Col md={12} xs={12}>
          <Row>
            <form>
              <Col md={8} xs={8}>
                <FormGroup
                  controlId="queryProfileTitle"
                  validationState={this.getValidation("name")}
                >
                  <ControlLabel>Title</ControlLabel>
                  <FormControl
                    type="text"
                    value={name}
                    placeholder="Enter Title"
                    onChange={this.handleChange}
                  />
                  <FormControl.Feedback />
                </FormGroup>

                <FormGroup controlId="queryProfileType">
                  <ControlLabel>Type</ControlLabel>
                  <FormControl
                    componentClass="select"
                    value={type}
                    placeholder="custom"
                    onChange={this.handleChange}
                  >
                    {options}
                  </FormControl>
                </FormGroup>

                <FormGroup
                  controlId="queryProfileUrl"
                  validationState={this.getValidation("url")}
                >
                  <ControlLabel>Url</ControlLabel>
                  <FormControl
                    type="url"
                    value={url}
                    placeholder="Enter Url"
                    onChange={this.handleChange}
                  />
                  <FormControl.Feedback />
                </FormGroup>

                <FormGroup
                  controlId="queryProfileDescription"
                  validationState={this.getValidation("description")}
                >
                  <ControlLabel>Description</ControlLabel>
                  <FormControl
                    componentClass="textarea"
                    value={description}
                    placeholder="Enter Description"
                    onChange={this.handleChange}
                  />
                  <FormControl.Feedback />
                </FormGroup>

                <Row className="form_profiles_btns">
                  <Col md={12} xs={12}>
                    <Button
                      bsStyle="primary"
                      onClick={() =>
                        saveNewQueryProfile(this.state.valueObj, forceUpdate)
                      }
                      disabled={errorOfForm ? true : false}
                    >
                      Save
                    </Button>

                    <div className="form_profiles_msg" />

                    <Button
                      bsStyle="primary"
                      onClick={() => cancelNewQueryProfile()}
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </Col>

              <Col md={4} xs={4}>
                <FormGroup
                  controlId="queryProfilePageStart"
                  validationState={this.getValidation("pageStart")}
                >
                  <ControlLabel>Page Start</ControlLabel>
                  <FormControl
                    type="text"
                    value={pageStart}
                    placeholder="Enter PageStart"
                    onChange={this.handleChange}
                  />
                  <FormControl.Feedback />
                </FormGroup>

                <FormGroup
                  controlId="queryProfilePageOffset"
                  validationState={this.getValidation("pageOffset")}
                >
                  <ControlLabel>Page Offset</ControlLabel>
                  <FormControl
                    type="text"
                    value={pageOffset}
                    placeholder="Enter PageOffset"
                    onChange={this.handleChange}
                  />
                  <FormControl.Feedback />
                </FormGroup>

                <FormGroup
                  controlId="queryProfileItemLimit"
                  validationState={this.getValidation("itemLimit")}
                >
                  <ControlLabel>Item Limit</ControlLabel>
                  <FormControl
                    type="text"
                    value={itemLimit}
                    placeholder="Enter Item Limit"
                    onChange={this.handleChange}
                  />
                  <FormControl.Feedback />
                </FormGroup>

                <FormGroup
                  controlId="queryProfileMinSales"
                  validationState={this.getValidation("minSales")}
                >
                  <ControlLabel>Min Sales</ControlLabel>
                  <FormControl
                    type="text"
                    value={minSales}
                    placeholder="Enter Min Sales"
                    onChange={this.handleChange}
                  />
                  <FormControl.Feedback />
                </FormGroup>

                <FormGroup
                  controlId="queryProfileMinRank"
                  validationState={this.getValidation("minRank")}
                >
                  <ControlLabel>Min Rank</ControlLabel>
                  <FormControl
                    type="text"
                    value={minRank}
                    placeholder="Enter Min Rank"
                    onChange={this.handleChange}
                  />
                  <FormControl.Feedback />
                </FormGroup>
              </Col>
            </form>
          </Row>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({
  queryProfiles: { errorOfForm, newProfileStatus, types, forceUpdate }
}) => {
  return {
    errorOfForm,
    newProfileStatus,
    types,
    forceUpdate
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setErrorOfForm: val => dispatch(A.setErrorOfProfileForm(val)),
    saveNewQueryProfile: (data, forceUpdate) =>
      dispatch(A.saveNewQueryProfile(data, forceUpdate)),
    cancelNewQueryProfile: () => dispatch(A.manageNewQueryProfile("fetched"))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilesForm);
