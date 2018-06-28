import React from "react";
import { connect } from "react-redux";
import A from "../../actions";

import {
  Grid,
  Row,
  Col,
  Button,
  ButtonGroup,
  Tabs,
  Tab
} from "react-bootstrap";
import Spinner from "react-md-spinner";

import QueryProfiles from "../QueryProfiles";
import AuthorProgress from "../AuthorProgress";
import ThemeProgress from "../ThemeProgress";

import CollectedData from "../CollectedData";

class Home extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    const { getAllQueryProfiles } = this.props;
    getAllQueryProfiles();
  }

  componentDidUpdate(prevProps, prevState) {
    const { getAllQueryProfiles, forceUpdate } = this.props;
    if (forceUpdate !== prevProps.forceUpdate) {
      getAllQueryProfiles();
    }
  }

  render() {
    const { changeProgressMode, progressMode } = this.props;
    return (
      <Grid className="home">
        <Row>
          <Col md={12} xs={12}>
            <Tabs defaultActiveKey={1} id="homeTab">
              <Tab eventKey={1} title={"Query Profiles"}>
                <QueryProfiles />
              </Tab>
              <Tab eventKey={2} title={"Progress"}>
                <ThemeProgress />
              </Tab>
              <Tab eventKey={3} title={"Collected Data"}>
                <CollectedData />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = ({ home, queryProfiles: { forceUpdate } }) => {
  const { progressMode } = home;
  return {
    forceUpdate,
    progressMode
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getAllQueryProfiles: () => dispatch(A.getAllQueryProfiles()),
    changeProgressMode: mode => dispatch(A.changeProgressMode(mode))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
